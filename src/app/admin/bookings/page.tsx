"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Calendar from "react-calendar";
import { toast } from "sonner";
import "react-calendar/dist/Calendar.css";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface Learner {
  id: string;
  name: string;
  schoolYear: number | null;
  subjects: string[];
}

interface Booking {
  id: string;
  date: string;
  hour: number;
  slotNumber: number;
  studentName: string;
  package: string;
  sessionType: string;
  status: BookingStatus;
  userEmail: string;
  learner: Learner | null;
  createdAt: string;
}

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
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}

          {!loading && !error && bookings.length === 0 && (
            <div>No bookings found for this date.</div>
          )}

          {bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {booking.hour}:00 - Slot {booking.slotNumber}
                      </h3>
                      <p className="text-gray-600">
                        Student: {booking.studentName}
                      </p>
                      {booking.learner && (
                        <>
                          <p className="text-gray-600">
                            Year: {booking.learner.schoolYear}
                          </p>
                          <div className="mt-1">
                            <p className="text-sm text-gray-600">Subjects:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {booking.learner.subjects.map((subject) => (
                                <span
                                  key={subject}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {subject}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      <p className="text-gray-600">
                        Package: {booking.package}
                      </p>
                      <p className="text-gray-600">
                        Session: {booking.sessionType}
                      </p>
                      <p className="text-gray-600">
                        Parent Email: {booking.userEmail}
                      </p>
                    </div>
                    <div>
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            booking.id,
                            e.target.value as BookingStatus
                          )
                        }
                        className={`rounded-md border px-2 py-1 text-sm ${
                          booking.status === "confirmed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : booking.status === "cancelled"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : booking.status === "completed"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
