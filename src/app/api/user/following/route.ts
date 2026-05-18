import { auth } from "@/src/services/auth";
import { NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${apiBaseUrl}/user/following`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session.idToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        return NextResponse.json({ error: "Forbidden: User profile not registered" }, { status: 403 });
      }
      if (response.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("user/following GET API error:", error);
    return NextResponse.json({ error: "Failed to fetch following users" }, { status: 500 });
  }
}
