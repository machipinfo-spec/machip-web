// Cognitoユーザー属性(電話番号)とMFAの操作
// アクセストークンで呼び出すユーザーAPIのため、AWS認証情報は不要
// (要スコープ: aws.cognito.signin.user.admin)
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";

const cognito = new CognitoIdentityProvider({ region: "ap-northeast-1" });

export interface PhoneStatus {
  phoneNumber: string | null;
  verified: boolean;
}

export interface MfaStatus {
  totpEnabled: boolean;
}

/** 電話番号の登録状況と検証状態を取得 */
export async function getPhoneStatus(accessToken: string): Promise<PhoneStatus> {
  const user = await cognito.getUser({ AccessToken: accessToken });
  const attrs = new Map(
    (user.UserAttributes ?? []).map((a) => [a.Name, a.Value]),
  );
  return {
    phoneNumber: attrs.get("phone_number") ?? null,
    verified: attrs.get("phone_number_verified") === "true",
  };
}

/** MFA(認証アプリ)の有効状態を取得 */
export async function getMfaStatus(accessToken: string): Promise<MfaStatus> {
  const user = await cognito.getUser({ AccessToken: accessToken });
  return {
    totpEnabled: (user.UserMFASettingList ?? []).includes(
      "SOFTWARE_TOKEN_MFA",
    ),
  };
}

/** 電話番号を登録し、SMSで検証コードを送信する */
export async function startPhoneVerification(
  accessToken: string,
  phoneNumber: string,
): Promise<void> {
  await cognito.updateUserAttributes({
    AccessToken: accessToken,
    UserAttributes: [{ Name: "phone_number", Value: phoneNumber }],
  });
  await cognito.getUserAttributeVerificationCode({
    AccessToken: accessToken,
    AttributeName: "phone_number",
  });
}

/** SMSで受け取ったコードで電話番号を検証する */
export async function confirmPhoneVerification(
  accessToken: string,
  code: string,
): Promise<void> {
  await cognito.verifyUserAttribute({
    AccessToken: accessToken,
    AttributeName: "phone_number",
    Code: code,
  });
}

/** 認証アプリ(TOTP)の登録を開始し、シークレットを返す */
export async function associateTotp(accessToken: string): Promise<string> {
  const res = await cognito.associateSoftwareToken({
    AccessToken: accessToken,
  });
  if (!res.SecretCode) {
    throw new Error("シークレットコードの取得に失敗しました");
  }
  return res.SecretCode;
}

/** 認証アプリのコードを検証し、MFAを有効化する */
export async function confirmTotp(
  accessToken: string,
  code: string,
): Promise<void> {
  const res = await cognito.verifySoftwareToken({
    AccessToken: accessToken,
    UserCode: code,
    FriendlyDeviceName: "Machip",
  });
  if (res.Status !== "SUCCESS") {
    throw new Error("コードの検証に失敗しました");
  }
  await cognito.setUserMFAPreference({
    AccessToken: accessToken,
    SoftwareTokenMfaSettings: { Enabled: true, PreferredMfa: true },
  });
}

/** Cognitoのエラーをユーザー向けメッセージへ変換 */
export function toUserMessage(error: unknown): { message: string; status: number } {
  const name = (error as { name?: string })?.name ?? "";
  switch (name) {
    case "CodeMismatchException":
      return { message: "コードが正しくありません", status: 400 };
    case "ExpiredCodeException":
      return { message: "コードの有効期限が切れています。再送信してください", status: 400 };
    case "EnableSoftwareTokenMFAException":
      return { message: "コードの検証に失敗しました。もう一度お試しください", status: 400 };
    case "InvalidParameterException":
      return { message: "入力内容が正しくありません", status: 400 };
    case "LimitExceededException":
      return { message: "試行回数の上限に達しました。しばらく待ってからお試しください", status: 429 };
    case "NotAuthorizedException":
      return { message: "認証の有効期限が切れています。再ログインしてください", status: 403 };
    case "AccessDeniedException":
      return { message: "権限がありません。再ログインしてください", status: 403 };
    default:
      return { message: "エラーが発生しました。しばらくしてからお試しください", status: 500 };
  }
}
