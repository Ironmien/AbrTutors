"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Plus, X } from "lucide-react";

interface SessionTime {
  startTime: number;
  endTime: number;
}

interface DaySchedule {
  dayOfWeek: number;
  sessions: SessionTime[];
}

const defaultSchedule: DaySchedule[] = [
  // Monday (0)
  {
    dayOfWeek: 0,
    sessions: [
      { startTime: 15, endTime: 16 }, // 3-4
      { startTime: 16, endTime: 17 }, // 4-5
      { startTime: 17, endTime: 18 }, // 5-6
      { startTime: 19, endTime: 20 }, // 7-8
    ],
  },
  // Tuesday (1)
  {
    dayOfWeek: 1,
    sessions: [
      { startTime: 15, endTime: 16 },
      { startTime: 16, endTime: 17 },
      { startTime: 17, endTime: 18 },
      { startTime: 19, endTime: 20 },
    ],
  },
  // Wednesday (2)
  {
    dayOfWeek: 2,
    sessions: [
      { startTime: 15, endTime: 16 },
      { startTime: 16, endTime: 17 },
      { startTime: 17, endTime: 18 },
      { startTime: 19, endTime: 20 },
    ],
  },
  // Thursday (3)
  {
    dayOfWeek: 3,
    sessions: [
      { startTime: 15, endTime: 16 },
      { startTime: 16, endTime: 17 },
      { startTime: 17, endTime: 18 },
      { startTime: 19, endTime: 20 },
    ],
  },
  // Friday (4)
  {
    dayOfWeek: 4,
    sessions: [
      { startTime: 15, endTime: 16 },
      { startTime: 16, endTime: 17 },
      { startTime: 17, endTime: 18 },
    ],
  },
  // Saturday (5)
  {
    dayOfWeek: 5,
    sessions: [
      { startTime: 9, endTime: 10 },
      { startTime: 10, endTime: 11 },
      { startTime: 11, endTime: 12 },
    ],
  },
  // Sunday (6)
  {
    dayOfWeek: 6,
    sessions: [
      { startTime: 18, endTime: 19 }, // 6-7
      { startTime: 19, endTime: 20 }, // 7-8
    ],
  },
];

interface BookingInfo {
  date: string;
  startTime: number;
  bookings: number;
}

export default function AvailabilityManagement() {
  const [date, setDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<BookingInfo[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [customSessions, setCustomSessions] = useState<any[]>([]);
  const [isAddingCustomSession, setIsAddingCustomSession] = useState(false);
  const [newCustomSession, setNewCustomSession] = useState({
    startTime: 9,
    endTime: 10,
    maxSlots: 3,
  });

  useEffect(() => {
    fetchBookings();
    fetchBlockedDates();
    fetchCustomSessions();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    }
  };

  const fetchBlockedDates = async () => {
    try {
      const response = await fetch("/api/admin/blocked-dates");
      if (!response.ok) throw new Error("Failed to fetch blocked dates");
      const data = await response.json();
      setBlockedDates(data.blockedDates.map((d: string) => new Date(d)));
    } catch (error) {
      toast.error("Failed to fetch blocked dates");
    }
  };

  const fetchCustomSessions = async () => {
    try {
      const response = await fetch("/api/admin/custom-sessions");
      if (!response.ok) throw new Error("Failed to fetch custom sessions");
      const data = await response.json();
      setCustomSessions(data.customSessions);
    } catch (error) {
      toast.error("Failed to fetch custom sessions");
    }
  };

  const handleBlockDate = async (date: Date) => {
    try {
      const response = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });

      if (!response.ok) throw new Error("Failed to block date");

      toast.success("Date blocked successfully");
      fetchBlockedDates();
    } catch (error) {
      toast.error("Failed to block date");
    }
  };

  const handleUnblockDate = async (date: Date) => {
    try {
      const response = await fetch("/api/admin/blocked-dates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });

      if (!response.ok) throw new Error("Failed to unblock date");

      toast.success("Date unblocked successfully");
      fetchBlockedDates();
    } catch (error) {
      toast.error("Failed to unblock date");
    }
  };

  const handleAddCustomSession = async () => {
    try {
      const response = await fetch("/api/admin/custom-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          ...newCustomSession,
        }),
      });

      if (!response.ok) throw new Error("Failed to add custom session");

      toast.success("Custom session added successfully");
      setIsAddingCustomSession(false);
      fetchCustomSessions();
    } catch (error) {
      toast.error("Failed to add custom session");
    }
  };

  const getDaySchedule = (date: Date) => {
    const dayOfWeek = date.getDay();
    return defaultSchedule.find((schedule) => schedule.dayOfWeek === dayOfWeek);
  };

  const getBookingsForDateAndTime = (date: string, startTime: number) => {
    return (
      bookings.find((b) => b.date === date && b.startTime === startTime)
        ?.bookings || 0
    );
  };

  const formatTime = (hour: number) => {
    return `${hour}:00`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Session Availability Management
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your tutoring session availability and view bookings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="rounded-md border"
            modifiers={{
              blocked: blockedDates,
            }}
            modifiersStyles={{
              blocked: { backgroundColor: "#FEE2E2", color: "#991B1B" },
            }}
          />

          <div className="mt-4 space-y-2">
            <Button
              onClick={() => handleBlockDate(date)}
              variant="destructive"
              className="w-full"
            >
              Block Selected Date
            </Button>
            <Button
              onClick={() => handleUnblockDate(date)}
              variant="outline"
              className="w-full"
            >
              Unblock Selected Date
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Sessions for {date.toLocaleDateString()}
            </h3>
            <Dialog
              open={isAddingCustomSession}
              onOpenChange={setIsAddingCustomSession}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Session</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <select
                      value={newCustomSession.startTime}
                      onChange={(e) =>
                        setNewCustomSession({
                          ...newCustomSession,
                          startTime: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {formatTime(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <select
                      value={newCustomSession.endTime}
                      onChange={(e) =>
                        setNewCustomSession({
                          ...newCustomSession,
                          endTime: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {formatTime(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max Slots
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="3"
                      value={newCustomSession.maxSlots}
                      onChange={(e) =>
                        setNewCustomSession({
                          ...newCustomSession,
                          maxSlots: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <Button onClick={handleAddCustomSession} className="w-full">
                    Add Session
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {getDaySchedule(date)?.sessions.map((session, index) => {
              const bookingCount = getBookingsForDateAndTime(
                date.toISOString().split("T")[0],
                session.startTime
              );
              const isFullyBooked = bookingCount >= 3;
              const hasBookings = bookingCount > 0;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isFullyBooked
                      ? "bg-red-50 border-red-200"
                      : hasBookings
                      ? "bg-amber-50 border-amber-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatTime(session.startTime)} -{" "}
                        {formatTime(session.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isFullyBooked
                            ? "bg-red-100 text-red-800"
                            : hasBookings
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {bookingCount}/3 booked
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
