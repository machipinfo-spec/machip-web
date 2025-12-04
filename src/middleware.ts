import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./services/auth";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export type UserCheckResult = "ok" | "unauthorized" | "undefined" | "failed";

async function createOrVerifyUser(token: string): Promise<UserCheckResult> {
  if (!token) return "unauthorized";

  try {
    // ユーザーの存在確認
    const res = await fetch(`${baseUrl}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    console.log(res.status);

    if (res.status === 404) {
      // ユーザーが存在しない場合は作成
      await fetch(`${baseUrl}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      return "ok";
    } else if (res.status === 401) {
      return "unauthorized";
    } else if (res.status === 200) {
      return "ok";
    } else {
      console.error("Error checking user:", res.status, res.statusText);
      return "failed";
    }
  } catch (error) {
    console.error("Error in createOrVerifyUser:", error);
    return "failed";
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ルートパス（"/"）へのアクセスの場合 "/home" にリダイレクト
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  try {
    // セッションを取得
    const session = await auth();

    if (!session) {
      console.log(
        "[Middleware] No session found. Redirecting to /login-prompt"
      );
      return NextResponse.redirect(new URL("/login-prompt", req.url));
    }

    // sessionが有効か検証する
    const isValid = session.expires && new Date(session.expires) > new Date();
    if (!isValid) {
      console.log("[Middleware] Session expired. Redirecting to /login-prompt");
      return NextResponse.redirect(new URL("/login-prompt", req.url));
    }

    try {
      // ユーザーが存在するかチェックする
      const isUser = await createOrVerifyUser(session.idToken!);
      if (isUser === "unauthorized" || isUser === 'failed') {
        return NextResponse.redirect(new URL("/login-prompt", req.url));
      }

      if (isUser === "undefined") {
        // ユーザー作成に失敗した場合はログインプロンプトに戻す
        return NextResponse.redirect(new URL("/newUser", req.url));
      }

      // ユーザーのステータスをチェックする追加のAPIコール
      const userStatusRes = await fetch(`${baseUrl}/user/@self/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session.idToken!,
        },
      });

      if (userStatusRes.ok) {
        const userData = await userStatusRes.json();

        // ユーザーの登録が完了していない場合は新規登録画面へリダイレクト
        if (!userData.isProfileComplete) {
          return NextResponse.redirect(new URL("/new", req.url));
        }

        // 正常なユーザーであれば通常のフローを続行
        return NextResponse.next();
      } else {
        // ステータス取得に失敗した場合は安全のため新規登録画面へ
        return NextResponse.redirect(new URL("/new", req.url));
      }
    } catch (error) {
      console.error("[Middleware] Error checking user status:", error);
      // エラーが発生した場合はログインプロンプトに戻す
      return NextResponse.redirect(new URL("/login-prompt", req.url));
    }
  } catch (error) {
    console.error("[Middleware] Error in auth middleware:", error);
    return NextResponse.redirect(new URL("/login-prompt", req.url));
  }
}
export const config = {
  matcher: [
    "/profile/:path*",
    "/inbox/:path*",
    "/home/:path*",
    "/workout/:path*",
    "/",
  ],
};
