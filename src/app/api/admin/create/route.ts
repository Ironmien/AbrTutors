import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "admin",
        name: "Admin User",
        profileComplete: true,
      },
    });

    return NextResponse.json(
      { message: "Admin created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Error creating admin" },
      { status: 500 }
    );
  }
}
