import { Role, UserType } from "@prisma/client";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null;
  role: Role;
  userType: UserType;
  availableSessions: number;
  packageType: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postcode?: string | null;
  profileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  expires: string;
}
export { Role, UserType };
