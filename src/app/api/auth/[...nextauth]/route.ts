import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, Role, UserType } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            userType: true,
            profileComplete: true,
            availableSessions: true,
            packageType: true,
            learners: {
              select: {
                id: true,
              },
            },
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          userType: user.userType,
          profileComplete: user.profileComplete,
          availableSessions: user.availableSessions,
          packageType: user.packageType,
          hasLearners: user.learners.length > 0,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.userType = user.userType;
        token.profileComplete = user.profileComplete;
        token.availableSessions = user.availableSessions;
        token.packageType = user.packageType;
        token.hasLearners = user.hasLearners;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.userType = token.userType;
        session.user.profileComplete = token.profileComplete;
        session.user.availableSessions = token.availableSessions;
        session.user.packageType = token.packageType;
        session.user.hasLearners = token.hasLearners;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
