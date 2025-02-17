import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user?.email || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, amount, type, reason } = body;

    // Validate required fields
    if (!userId || !amount || !type || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update user sessions and create history in a transaction
    const result = await db.$transaction(async (tx) => {
      // Update user's available sessions
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          availableSessions: {
            increment: type === "ADD" ? amount : -amount,
          },
        },
      });

      // Create session history record
      const sessionHistory = await tx.sessionHistory.create({
        data: {
          userId,
          amount,
          type,
          category: "manual_adjustment",
          reason,
          adminId: session.user.id,
        },
      });

      return { updatedUser, sessionHistory };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error managing sessions:", error);
    return NextResponse.json(
      { error: "Failed to manage sessions" },
      { status: 500 }
    );
  }
}

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
