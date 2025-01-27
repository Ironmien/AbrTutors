import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const body = await request.json();
    const { packageId, amount, credits } = body;

    // Validate required fields
    if (!packageId || !amount || !credits) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create payment and add credits in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the payment record
      const payment = await prisma.payment.create({
        data: {
          amount,
          type: packageId,
          status: "completed", // In a real app, this would be pending until payment is confirmed
          userEmail,
        },
      });

      // Add credits to user
      const user = await prisma.user.update({
        where: { email: userEmail },
        data: {
          credits: {
            increment: credits,
          },
        },
        select: {
          credits: true,
        },
      });

      return { payment, user };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
