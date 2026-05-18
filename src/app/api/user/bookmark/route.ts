import { auth } from "@/src/services/auth";
import { NextRequest, NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    const response = await fetch(`${apiBaseUrl}/user/bookmark?limit=${limit}&offset=${offset}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.idToken || ""}`,
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
    console.error("user/bookmark GET API error:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarked threads" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${apiBaseUrl}/user/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session.idToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("user/bookmark POST API error:", error);
    return NextResponse.json({ error: "Failed to bookmark thread" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId");

    if (!threadId) {
      return NextResponse.json({ error: "threadId is required" }, { status: 400 });
    }

    const response = await fetch(`${apiBaseUrl}/user/bookmark?threadId=${threadId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session.idToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("user/bookmark DELETE API error:", error);
    return NextResponse.json({ error: "Failed to unbookmark thread" }, { status: 500 });
  }
}
