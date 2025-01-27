"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Users, CalendarDays, CreditCard, LucideIcon } from "lucide-react";

interface Booking {
  id: string;
  date: Date;
  hour: number;
  slotNumber: number;
  userId: string;
  user: {
    name: string;
    email: string;
    packageType: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  packageType: string;
}

interface BookingSlot {
  bookings: number;
  users: string[];
}

interface DayBookings {
  [hour: number]: BookingSlot;
}

interface StatCard {
  title: string;
  value: number;
  Icon: typeof Users | typeof CalendarDays | typeof CreditCard;
  description: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<{ [date: string]: DayBookings }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (session?.user?.email) {
      fetchData();
    }
  }, [session, selectedDate]);

  const fetchData = async () => {
    try {
      // Fetch bookings for the selected month
      const startDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      const endDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      );

      const bookingsResponse = await fetch(
        `/api/admin/bookings?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      const bookingsData = await bookingsResponse.json();

      if (bookingsResponse.ok) {
        const bookingsMap: { [date: string]: DayBookings } = {};
        bookingsData.bookings.forEach((booking: Booking) => {
          const dateStr = new Date(booking.date).toISOString().split("T")[0];
          if (!bookingsMap[dateStr]) {
            bookingsMap[dateStr] = {};
          }
          if (!bookingsMap[dateStr][booking.hour]) {
            bookingsMap[dateStr][booking.hour] = { bookings: 0, users: [] };
          }
          bookingsMap[dateStr][booking.hour].bookings++;
          bookingsMap[dateStr][booking.hour].users.push(booking.user.name);
        });
        setBookings(bookingsMap);
        setStats((prev) => ({
          ...prev,
          activeBookings: bookingsData.bookings.length,
        }));
      }

      // Fetch users
      const usersResponse = await fetch("/api/admin/users");
      const usersData = await usersResponse.json();

      if (usersResponse.ok) {
        setUsers(usersData.users);
        setStats((prev) => ({ ...prev, totalUsers: usersData.users.length }));
      }

      // Calculate total revenue (this is a placeholder - implement actual revenue calculation)
      const totalRevenue = users.reduce(
        (sum, user) => sum + (user.credits || 0) * 50,
        0
      );
      setStats((prev) => ({ ...prev, totalRevenue }));
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const getSlotColor = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split("T")[0];
    const slot = bookings[dateStr]?.[hour];

    if (!slot) return "bg-white";
    if (slot.bookings >= 4) return "bg-red-200";
    if (slot.bookings > 0) return "bg-green-200";
    return "bg-white";
  };

  const renderTimeSlots = (date: Date) => {
    const hours = Array.from({ length: 8 }, (_, i) => i + 9); // 9 AM to 4 PM
    const dateStr = date.toISOString().split("T")[0];

    return (
      <div className="grid grid-cols-1 gap-1 mt-2">
        {hours.map((hour) => {
          const slot = bookings[dateStr]?.[hour];
          return (
            <div
              key={hour}
              className={`p-2 rounded ${getSlotColor(
                date,
                hour
              )} hover:opacity-80 cursor-pointer`}
              title={slot?.users.join(", ") || "No bookings"}
            >
              {hour}:00 - {slot?.bookings || 0}/4 slots
            </div>
          );
        })}
      </div>
    );
  };

  const statCards: StatCard[] = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      Icon: Users,
      description: "Active registered users",
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings,
      Icon: CalendarDays,
      description: "Current month bookings",
    },
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      Icon: CreditCard,
      description: "Based on credit purchases",
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Dashboard Overview
      </h1>

      {error && (
        <div className="mt-4 bg-red-50 text-red-800 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden rounded-lg shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <card.Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.title}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {card.title === "Total Revenue"
                        ? `$${card.value}`
                        : card.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">{card.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Booking Calendar
          </h2>
          <div className="calendar-container">
            <Calendar
              onChange={(value: any) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                }
              }}
              value={selectedDate}
              className="w-full"
            />
            {renderTimeSlots(selectedDate)}
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Fully Booked</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Available Slots</span>
            </div>
          </div>
        </div>

        {/* Recent Users Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Users
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || "No name"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.packageType === "Premium"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.packageType}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {user.credits}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
