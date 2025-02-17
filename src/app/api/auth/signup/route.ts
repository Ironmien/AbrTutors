import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, userType } = await req.json();

    // Validate input
    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email is already registered
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with correct role and userType
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
        userType,
        profileComplete: false,
        availableSessions: 0,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userType: true,
        profileComplete: true,
        availableSessions: true,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          userType: user.userType,
          profileComplete: user.profileComplete,
          availableSessions: user.availableSessions,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
