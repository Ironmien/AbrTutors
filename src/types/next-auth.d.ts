import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import type { User } from "./index";
import { JWT } from "next-auth/jwt";
import { Role, UserType } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      userType: UserType;
      profileComplete: boolean;
      availableSessions: number;
      packageType: string;
      hasLearners: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: Role;
    userType: UserType;
    profileComplete: boolean;
    availableSessions: number;
    packageType: string;
    hasLearners: boolean;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    postcode?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    userType: UserType;
    profileComplete: boolean;
    availableSessions: number;
    packageType: string;
    hasLearners: boolean;
  }
}
