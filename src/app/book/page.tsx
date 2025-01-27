"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface TimeSlot {
  hour: number;
  availableSlots: number;
  availableSlotNumbers: number[];
}

interface AvailabilityResponse {
  availability: TimeSlot[];
  error?: string;
}

const BookingPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [credits, setCredits] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [studentName, setStudentName] = useState("");
  const [package_, setPackage] = useState("single");
  const [sessionType, setSessionType] = useState("online");

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserCredits();
    }
  }, [session]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const fetchUserCredits = async () => {
    try {
      const response = await fetch("/api/credits");
      const data = await response.json();

      if (response.ok) {
        setCredits(data.credits);
      } else {
        setError(data.error || "Failed to fetch credits");
      }
    } catch (error) {
      setError("Failed to fetch credits");
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`/api/availability?date=${selectedDate}`);
      const data: AvailabilityResponse = await response.json();

      if (response.ok) {
        setAvailability(data.availability);
      } else {
        setError(data.error || "Failed to fetch availability");
      }
    } catch (error) {
      setError("Failed to fetch availability");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (credits < 1) {
      setError("You don't have enough credits to book a session");
      setLoading(false);
      return;
    }

    if (!selectedDate || !selectedHour || !selectedSlot) {
      setError("Please select a date and time slot");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          hour: selectedHour,
          slotNumber: selectedSlot,
          studentName,
          package: package_,
          sessionType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard?booking=success");
      } else {
        setError(data.error || "Failed to book session");
      }
    } catch (error) {
      setError("Failed to book session");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    router.push("/login?callbackUrl=/book");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Book a Session</h1>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <div className="mb-6">
            <p className="text-lg">
              Available Credits: <span className="font-bold">{credits}</span>
            </p>
            {credits < 1 && (
              <p className="text-red-500 mt-2">
                You need at least 1 credit to book a session. Please purchase
                credits first.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter student name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package
              </label>
              <select
                value={package_}
                onChange={(e) => setPackage(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="single">Single Session</option>
                <option value="package5">5 Sessions Package</option>
                <option value="package10">10 Sessions Package</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="online">Online</option>
                <option value="inPerson">In Person</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {selectedDate && availability.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {availability.map((slot) => (
                    <div key={slot.hour} className="border rounded-md p-4">
                      <p className="font-medium mb-2">
                        {slot.hour}:00 - {slot.availableSlots} slots available
                      </p>
                      <div className="flex gap-2">
                        {slot.availableSlotNumbers.map((slotNum) => (
                          <button
                            key={slotNum}
                            type="button"
                            onClick={() => {
                              setSelectedHour(slot.hour);
                              setSelectedSlot(slotNum);
                            }}
                            className={`px-3 py-1 rounded-md ${
                              selectedHour === slot.hour &&
                              selectedSlot === slotNum
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                          >
                            Slot {slotNum}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <div className="text-red-500">{error}</div>}

            <button
              type="submit"
              disabled={loading || credits < 1}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                loading || credits < 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Booking..." : "Book Session"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
