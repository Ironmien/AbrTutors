import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId, amount, category, reason, type } = await request.json();

    // Validate input
    if (!userId || !amount || !category || !reason || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (type !== "CREDIT" && type !== "DEBIT") {
      return new NextResponse("Invalid credit type", { status: 400 });
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create credit history entry
      const creditHistory = await tx.creditHistory.create({
        data: {
          userId,
          amount,
          category,
          reason,
          type,
          adminId: session.user.id,
        },
      });

      // Update user credits
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            [type === "CREDIT" ? "increment" : "decrement"]: amount,
          },
        },
      });

      return { creditHistory, updatedUser };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error managing credits:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const creditHistory = await prisma.creditHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            credits: true,
          },
        },
      },
    });

    return NextResponse.json({ creditHistory });
  } catch (error) {
    console.error("Error fetching credit history:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
