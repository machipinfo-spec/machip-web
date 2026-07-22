import { auth } from "@/src/services/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  confirmPhoneVerification,
  getPhoneStatus,
  startPhoneVerification,
  toUserMessage,
} from "@/src/services/cognitoAttributes";
import { normalizeJapanesePhone } from "@/src/utils/phone";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const status = await getPhoneStatus(session.accessToken);
    return NextResponse.json(status);
  } catch (error) {
    console.error("phone GET:", error);
    const { message, status } = toUserMessage(error);
    return NextResponse.json({ error: message }, { status });
  }
}

/** 電話番号を登録してSMS検証コードを送信 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { phoneNumber } = await request.json();
  const normalized = normalizeJapanesePhone(String(phoneNumber ?? ""));
  if (!normalized) {
    return NextResponse.json(
      { error: "電話番号の形式が正しくありません(例: 090-1234-5678)" },
      { status: 400 },
    );
  }
  try {
    await startPhoneVerification(session.accessToken, normalized);
    return NextResponse.json({ sent: true, phoneNumber: normalized });
  } catch (error) {
    console.error("phone POST:", error);
    const { message, status } = toUserMessage(error);
    return NextResponse.json({ error: message }, { status });
  }
}

/** SMSコードを検証して電話番号を確認済みにする */
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { code } = await request.json();
  if (!/^\d{4,8}$/.test(String(code ?? ""))) {
    return NextResponse.json(
      { error: "認証コードを入力してください" },
      { status: 400 },
    );
  }
  try {
    await confirmPhoneVerification(session.accessToken, String(code));
    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("phone PUT:", error);
    const { message, status } = toUserMessage(error);
    return NextResponse.json({ error: message }, { status });
  }
}
