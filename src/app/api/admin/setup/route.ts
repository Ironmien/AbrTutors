import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// This endpoint should only be used once to set up the initial admin
// After that, it should be disabled or removed
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, adminKey } = body;

    // Verify the admin setup key from environment variable
    // This adds an extra layer of security
    if (adminKey !== process.env.ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { error: "Invalid admin setup key" },
        { status: 401 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: "admin",
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Admin user created successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error setting up admin:", error);
    return NextResponse.json(
      { error: "Failed to set up admin user" },
      { status: 500 }
    );
  }
}
