import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const { userId, type, amount, category, reason } = await request.json();

    console.log("Updating credits for user:", userId);
    console.log("Type:", type);
    console.log("Amount:", amount);

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          [type === "ADD" ? "increment" : "decrement"]: Number(amount),
        },
      },
    });

    console.log("Updated user:", updatedUser);

    // Record the credit transaction
    const creditHistory = await prisma.creditHistory.create({
      data: {
        userId,
        type,
        amount: Number(amount),
        category,
        reason,
        createdAt: new Date(), // Using createdAt instead of date to match Prisma schema
      },
    });

    console.log("Credit history created:", creditHistory);

    return NextResponse.json({
      user: updatedUser,
      history: creditHistory,
      message: "Credits updated successfully",
    });
  } catch (error) {
    console.error("Credit update error:", error);
    return NextResponse.json(
      { error: "Failed to update credits" },
      { status: 500 }
    );
  }
}
