import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

interface AuthToken {
  role?: string;
  userType?: string;
  profileComplete?: boolean;
  hasLearners?: boolean;
  availableSessions?: number;
}

// Add paths that don't require authentication or profile completion
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/api/auth",
  "/services",
  "/testimonials",
  "/contact",
];

export default async function middleware(request: NextRequestWithAuth) {
  const token = (await getToken({ req: request })) as AuthToken;
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Require authentication
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Admin bypass - admins can access all routes
  if (token.role === "admin") {
    return NextResponse.next();
  }

  // Profile completion flow
  if (!token.profileComplete && !pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // User type selection flow (if not selected)
  if (!token.userType && !pathname.startsWith("/user-type")) {
    return NextResponse.redirect(new URL("/user-type", request.url));
  }

  // Parent flow - learner registration
  if (
    token.userType === "parent" &&
    !token.hasLearners &&
    !pathname.startsWith("/register-learners")
  ) {
    return NextResponse.redirect(new URL("/register-learners", request.url));
  }

  // Session check for booking
  if (pathname.startsWith("/book")) {
    if (!token.availableSessions || token.availableSessions <= 0) {
      return NextResponse.redirect(new URL("/sessions", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
