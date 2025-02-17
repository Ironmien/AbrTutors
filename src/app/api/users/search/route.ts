import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    // Get the search query from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ users: [] });
    }

    // Search for users with case-insensitive matching
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
      },
    });

    console.log("Search query:", query); // Debug log
    console.log("Found users:", users); // Debug log

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Search error:", error); // Debug log
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
