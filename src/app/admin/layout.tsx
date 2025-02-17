"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  CalendarDays,
  Users,
  GraduationCap,
  CreditCard,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  LucideIcon,
  Gift,
  LayoutDashboard,
  DollarSign,
  Clock,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    name: "Sessions",
    href: "/admin/sessions",
    icon: CreditCard,
  },
  {
    name: "Learners",
    href: "/admin/learners",
    icon: GraduationCap,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: DollarSign,
  },
  {
    name: "Availability",
    href: "/admin/availability",
    icon: Clock,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        <div className="fixed inset-0 flex">
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-2xl font-bold text-amber-700">Admin Panel</h1>
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto">
              <nav className="space-y-1 px-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive
                          ? "bg-amber-100 text-amber-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={`mr-4 h-6 w-6 flex-shrink-0 ${
                          isActive
                            ? "text-amber-700"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-2xl font-bold text-amber-700">Admin Panel</h1>
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-amber-100 text-amber-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${
                        isActive
                          ? "text-amber-700"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              <LogOut className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        {/* Top header */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              {/* Add search or other header content here */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
