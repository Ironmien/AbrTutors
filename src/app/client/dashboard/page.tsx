"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {
  CalendarDays,
  CreditCard,
  BookOpen,
  User,
  History,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  GraduationCap,
  Clock,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface UpcomingSession {
  id: string;
  date: string;
  time: string;
  subject: string;
  status: string;
}

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("status");
  const [notifications, setNotifications] = useState(2);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([
    {
      id: "1",
      date: "2024-02-20",
      time: "14:00",
      subject: "Pure Mathematics",
      status: "confirmed",
    },
    {
      id: "2",
      date: "2024-02-22",
      time: "15:00",
      subject: "Mathematics Literacy",
      status: "pending",
    },
  ]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (paymentStatus === "cancelled") {
      toast.error(
        "Payment was cancelled. You can try again when you're ready."
      );
    } else if (paymentStatus === "success") {
      toast.success(
        "Payment successful! Your credits will be updated shortly."
      );
    }
  }, [paymentStatus]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const quickActions = [
    {
      title: "Book a Session",
      icon: <CalendarDays className="h-8 w-8 text-amber-600" />,
      description: "Schedule your next tutoring session",
      link: "/book",
      color: "bg-amber-50",
    },
    {
      title: "Your Sessions",
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      description: `${
        session?.user?.availableSessions || 0
      } sessions available`,
      link: "/sessions",
      color: "bg-green-50",
    },
    {
      title: "Active Sessions",
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      description: "View your upcoming sessions",
      link: "/bookings",
      color: "bg-blue-50",
    },
    {
      title: "Messages",
      icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
      description: "View your messages",
      link: "/messages",
      color: "bg-purple-50",
    },
  ];

  const navigationItems = [
    { icon: <CalendarDays size={24} />, label: "Book", path: "/book" },
    { icon: <History size={24} />, label: "Sessions", path: "/sessions" },
    { icon: <User size={24} />, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-amber-600">AbrTutors</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs text-center leading-5">
                    {notifications}
                  </span>
                )}
              </button>
              <button
                onClick={handleSignOut}
                className="hidden md:flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Welcome back, {session?.user?.name}!
              </h2>
              <p className="mt-1 text-gray-600">
                Your learning journey continues here.
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => router.push(item.link)}
                  className={`${item.color} p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
                >
                  <div className="flex flex-col items-center text-center">
                    {item.icon}
                    <h3 className="mt-2 font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs md:text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upcoming Sessions
                </h3>
                <button
                  onClick={() => router.push("/sessions")}
                  className="text-amber-600 hover:text-amber-700 text-sm flex items-center"
                >
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {session.subject}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(session.date).toLocaleDateString()} at{" "}
                          {session.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Stats */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-amber-100 p-3 rounded-full">
                  <User className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {session?.user?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sessions</span>
                  <span className="font-medium">
                    {session?.user?.availableSessions || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium capitalize">
                    {session?.user?.userType?.replace("_", " ") || "Student"}
                  </span>
                </div>
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full mt-4 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/settings")}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-600 mr-3" />
                    <span>Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
                <button
                  onClick={() => router.push("/help")}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-gray-600 mr-3" />
                    <span>Help & Support</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex justify-around items-center h-16">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-amber-600"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
