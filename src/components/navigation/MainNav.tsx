"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
      show: true,
    },
    {
      href: "/profile",
      label: session?.user?.profileComplete ? "My Profile" : "Complete Profile",
      active: pathname === "/profile",
      show: session?.user && !session.user.profileComplete,
      highlight: !session?.user?.profileComplete,
    },
    {
      href: "/learners",
      label: "Manage Learners",
      active: pathname === "/learners",
      show:
        session?.user?.profileComplete && session?.user?.userType === "parent",
    },
    {
      href: "/book",
      label: "Book a Session",
      active: pathname === "/book",
      show:
        session?.user?.profileComplete &&
        (session?.user?.hasLearners ||
          session?.user?.userType === "independent_learner"),
    },
    {
      href: "/bookings",
      label: "My Bookings",
      active: pathname === "/bookings",
      show:
        session?.user?.profileComplete &&
        (session?.user?.hasLearners ||
          session?.user?.userType === "independent_learner"),
    },
    {
      href: "/credits",
      label: "Credits",
      active: pathname === "/credits",
      show:
        session?.user?.profileComplete &&
        (session?.user?.hasLearners ||
          session?.user?.userType === "independent_learner"),
    },
    {
      href: "/admin/bookings",
      label: "Admin",
      active: pathname.startsWith("/admin"),
      show: session?.user?.role === "admin",
    },
  ];

  return (
    <nav className="flex items-center space-x-6">
      {routes.map(
        (route) =>
          route.show && (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active
                  ? "text-black dark:text-white"
                  : "text-muted-foreground",
                route.highlight && "text-blue-600 font-semibold animate-pulse"
              )}
            >
              {route.label}
            </Link>
          )
      )}
    </nav>
  );
}
