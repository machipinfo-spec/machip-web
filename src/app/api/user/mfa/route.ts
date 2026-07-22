import { auth } from "@/src/services/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  associateTotp,
  confirmTotp,
  getMfaStatus,
  toUserMessage,
} from "@/src/services/cognitoAttributes";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const status = await getMfaStatus(session.accessToken);
    return NextResponse.json(status);
  } catch (error) {
    console.error("mfa GET:", error);
    const { message, status } = toUserMessage(error);
    return NextResponse.json({ error: message }, { status });
  }
}

/** 認証アプリの登録を開始し、QRコード用のotpauth URIを返す */
export async function POST() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const secret = await associateTotp(session.accessToken);
    const account = encodeURIComponent(session.user?.email ?? "user");
    const otpauthUrl = `otpauth://totp/Machip:${account}?secret=${secret}&issuer=Machip`;
    return NextResponse.json({ secret, otpauthUrl });
  } catch (error) {
    console.error("mfa POST:", error);
    const { message, status } = toUserMessage(error);
    return NextResponse.json({ error: message }, { status });
  }
}

/** 認証アプリのコードを検証してMFAを有効化 */
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { code } = await request.json();
  if (!/^\d{6}$/.test(String(code ?? ""))) {
    return NextResponse.json(
      { error: "6桁の認証コードを入力してください" },
      { status: 400 },
    );
  }
  try {
    await confirmTotp(session.accessToken, String(code));
    return NextResponse.json({ enabled: true });
  } catch (error) {
    console.error("mfa PUT:", error);
    const { message, status } = toUserMessage(error);
    return NextResponse.json({ error: message }, { status });
  }
}
