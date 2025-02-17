import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user?.email || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch session history for the user
    const sessionHistory = await db.sessionHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        type: true,
        amount: true,
        category: true,
        reason: true,
      },
    });

    return NextResponse.json({ sessionHistory });
  } catch (error) {
    console.error("Error fetching session history:", error);
    return NextResponse.json(
      { error: "Failed to fetch session history" },
      { status: 500 }
    );
  }
}
