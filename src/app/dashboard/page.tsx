"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface Booking {
  id: string;
  date: string;
  hour: number;
  slotNumber: number;
  studentName: string;
  package: string;
  sessionType: string;
  status: string;
}

const DashboardPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (session?.user?.email) {
      fetchBookings();
      fetchCredits();
    }
  }, [session]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      const data = await response.json();

      if (response.ok) {
        setBookings(data.bookings);
      } else {
        setError(data.error || "Failed to fetch bookings");
      }
    } catch (error) {
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits");
      const data = await response.json();

      if (response.ok) {
        setCredits(data.credits);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh bookings and credits after cancellation
        fetchBookings();
        fetchCredits();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      setError("Failed to cancel booking");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (hour: number, slotNumber: number) => {
    return `${hour}:${slotNumber === 1 ? "00" : (slotNumber - 1) * 15} ${
      hour >= 12 ? "PM" : "AM"
    }`;
  };

  if (!session) {
    router.push("/login?callbackUrl=/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <div className="text-lg">
            Available Credits: <span className="font-bold">{credits}</span>
          </div>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You have no bookings yet.</p>
            <button
              onClick={() => router.push("/book")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              Book a Session
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {booking.studentName}
                    </h3>
                    <p className="text-gray-600">
                      {formatDate(booking.date)} at{" "}
                      {formatTime(booking.hour, booking.slotNumber)}
                    </p>
                    <p className="text-gray-600">
                      Package: {booking.package} | Type: {booking.sessionType}
                    </p>
                    <p
                      className={`mt-2 font-medium ${
                        booking.status === "confirmed"
                          ? "text-green-600"
                          : booking.status === "cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      Status: {booking.status}
                    </p>
                  </div>
                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
