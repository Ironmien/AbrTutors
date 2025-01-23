"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export default function Calendar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch(
          `/api/timeslots?date=${selectedDate.toISOString()}`
        );
        if (response.ok) {
          const data = await response.json();
          setTimeSlots(data.timeSlots);
        }
      } catch (error) {
        console.error("Error fetching time slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate]);

  const generateCalendarDays = () => {
    const days = [];
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDate.getDay(); i++) {
      days.push(<td key={`empty-${i}`} className="p-2 border bg-gray-50"></td>);
    }

    // Add cells for each day of the month
    for (let date = 1; date <= endDate.getDate(); date++) {
      const currentDateToCheck = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        date
      );
      const isSelected =
        selectedDate.toDateString() === currentDateToCheck.toDateString();
      const isPast =
        currentDateToCheck < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <td
          key={date}
          className={`p-2 border text-center cursor-pointer transition-colors
            ${
              isPast
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-50"
            }
            ${isSelected ? "bg-blue-100" : ""}`}
          onClick={() => !isPast && setSelectedDate(currentDateToCheck)}
        >
          {date}
        </td>
      );
    }

    return days;
  };

  const renderTimeSlots = () => {
    if (loading) {
      return (
        <div className="text-center py-4">Loading available time slots...</div>
      );
    }

    if (timeSlots.length === 0) {
      return (
        <div className="text-center py-4">
          No available time slots for this date.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-4">
        {timeSlots.map((slot) => (
          <button
            key={slot.id}
            onClick={() =>
              router.push(
                `/book?date=${selectedDate.toISOString().split("T")[0]}&time=${
                  slot.time
                }`
              )
            }
            disabled={!slot.available}
            className={`p-4 rounded-lg text-center transition-colors
              ${
                slot.available
                  ? "bg-white border border-blue-200 hover:border-blue-400"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            {slot.time}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Available Time Slots
            </h1>
            <p className="mt-2 text-gray-600">
              Select a date to view available tutoring sessions
            </p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Calendar */}
            <div className="p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <th
                          key={day}
                          className="p-2 border bg-gray-50 text-gray-600"
                        >
                          {day}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }, (_, weekIndex) => (
                    <tr key={weekIndex}>
                      {generateCalendarDays().slice(
                        weekIndex * 7,
                        (weekIndex + 1) * 7
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Time Slots */}
            <div className="border-t border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Times for {selectedDate.toLocaleDateString()}
              </h3>
              {renderTimeSlots()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
