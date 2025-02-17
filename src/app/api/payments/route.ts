import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

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
    const { packageId, amount, sessions } = body;

    // Validate required fields
    if (!packageId || !amount || !sessions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create payment and add sessions in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create the payment record
      const payment = await tx.payment.create({
        data: {
          amount,
          type: packageId,
          status: "completed", // In a real app, this would be pending until payment is confirmed
          userEmail,
        },
      });

      // Add sessions to user
      const user = await tx.user.update({
        where: { email: userEmail },
        data: {
          availableSessions: {
            increment: sessions,
          },
        },
        select: {
          availableSessions: true,
        },
      });

      // Create session history record
      await tx.sessionHistory.create({
        data: {
          userId: session.user.id,
          amount: sessions,
          category: "purchase",
          reason: `Purchased ${sessions} session${sessions > 1 ? "s" : ""}`,
          type: "ADD",
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
