"use server";

import { auth } from "@/src/services/auth";


export async function getAuthToken(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.idToken || null;
  } catch (error) {
    console.error("トークン取得エラー:", error);
    return null;
  }
}