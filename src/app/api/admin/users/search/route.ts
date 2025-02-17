import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Define the type for our user response
type UserResponse = {
  id: string;
  name: string;
  email: string;
  availableSessions: number;
};

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ users: [] });
    }

    // Search for users who are not admins
    const users = await db.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
          { role: { not: "admin" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        availableSessions: true,
      },
    });

    // Transform the data and ensure non-null values
    const transformedUsers: UserResponse[] = users.map((user) => ({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      availableSessions: user.availableSessions || 0,
    }));

    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error("Search error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
