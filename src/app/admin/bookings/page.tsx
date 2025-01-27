"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Calendar from "react-calendar";
import { CheckCircle2, XCircle, Clock, CalendarDays } from "lucide-react";
import "react-calendar/dist/Calendar.css";

interface Booking {
  id: string;
  userId: string;
  date: Date;
  hour: number;
  slotNumber: number;
  status: BookingStatus;
  user: {
    name: string;
    email: string;
    packageType: string;
    sessionType: string;
  };
}

type BookingStatus = "pending" | "completed" | "cancelled" | "no-show";

export default function BookingsPage() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchBookings();
    }
  }, [selectedDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/admin/bookings?date=${selectedDate.toISOString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: BookingStatus
  ) => {
    try {
      setError(null);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      setSuccess("Booking status updated successfully");
      fetchBookings();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update booking status"
      );
    }
  };

  if (!session) {
    return <div>Access denied. Please sign in as an admin.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="w-full bg-white rounded-lg shadow p-4"
          />
        </div>

        <div>
          {loading && <div>Loading bookings...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarDays className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{`${booking.hour}:${
                          booking.slotNumber === 1
                            ? "00"
                            : ((booking.slotNumber - 1) * 15)
                                .toString()
                                .padStart(2, "0")
                        }`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.user.packageType}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.user.sessionType}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : booking.status === "no-show"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {booking.status === "pending" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking.id, "completed")
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking.id, "no-show")
                            }
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      )}
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
