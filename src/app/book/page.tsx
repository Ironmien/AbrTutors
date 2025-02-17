"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Clock, GraduationCap, CreditCard } from "lucide-react";

interface Learner {
  id: string;
  name: string;
  subjects: string[];
}

interface TimeSlot {
  hour: number;
  availableSlots: number;
  availableSlotNumbers: number[];
}

interface BookingFormData {
  date: Date | undefined;
  hour: number | null;
  slotNumber: number | null;
  learnerId: string;
  sessionType: string;
  subject: string;
}

export default function BookingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [learners, setLearners] = useState<Learner[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [sessions, setSessions] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    date: undefined,
    hour: null,
    slotNumber: null,
    learnerId: "",
    sessionType: "",
    subject: "",
  });

  useEffect(() => {
    if (session) {
      fetchLearners();
      fetchUserCredits();
    }
  }, [session]);

  useEffect(() => {
    if (formData.date) {
      fetchAvailability();
    }
  }, [formData.date]);

  const fetchLearners = async () => {
    try {
      const response = await fetch("/api/learners");
      if (!response.ok) throw new Error("Failed to fetch learners");
      const data = await response.json();
      setLearners(data);
    } catch (error) {
      toast.error("Failed to fetch learners");
    }
  };

  const fetchUserCredits = async () => {
    try {
      const response = await fetch("/api/user/sessions");
      if (!response.ok) throw new Error("Failed to fetch credits");
      const data = await response.json();
      setSessions(data.sessions);
    } catch (error) {
      toast.error("Failed to fetch credits");
    }
  };

  const fetchAvailability = async () => {
    if (!formData.date) return;
    try {
      const response = await fetch(
        `/api/availability?date=${formData.date.toISOString().split("T")[0]}`
      );
      if (!response.ok) throw new Error("Failed to fetch availability");
      const data = await response.json();
      setTimeSlots(data.availability);
    } catch (error) {
      toast.error("Failed to fetch availability");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.date ||
      !formData.hour ||
      !formData.learnerId ||
      !formData.sessionType
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create booking");

      toast.success("Booking created successfully");
      router.push("/sessions");
    } catch (error) {
      toast.error("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (sessions <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            Insufficient Sessions
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            You currently have no available sessions. Please purchase additional
            sessions to book a tutoring appointment.
          </p>
          <button
            onClick={() => router.push("/sessions")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
          >
            Purchase Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book a Session</h1>
          <p className="mt-2 text-gray-600">Available Sessions: {sessions}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-6 rounded-lg shadow"
        >
          {/* Date Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Select Date</h2>
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => setFormData({ ...formData, date })}
              disabled={(date) => date < new Date() || date.getDay() === 0}
              className="rounded-md border"
            />
          </div>

          {/* Time Slot Selection */}
          {formData.date && timeSlots.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">2. Select Time</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {timeSlots.map(
                  (slot) =>
                    slot.availableSlots > 0 && (
                      <button
                        key={slot.hour}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, hour: slot.hour })
                        }
                        className={`p-4 rounded-lg border text-center ${
                          formData.hour === slot.hour
                            ? "border-amber-600 bg-amber-50"
                            : "border-gray-200 hover:border-amber-600"
                        }`}
                      >
                        <Clock className="h-5 w-5 mx-auto mb-2" />
                        {slot.hour}:00
                      </button>
                    )
                )}
              </div>
            </div>
          )}

          {/* Learner Selection */}
          {session?.user?.userType === "parent" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">3. Select Learner</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learners.map((learner) => (
                  <button
                    key={learner.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, learnerId: learner.id })
                    }
                    className={`p-4 rounded-lg border text-left ${
                      formData.learnerId === learner.id
                        ? "border-amber-600 bg-amber-50"
                        : "border-gray-200 hover:border-amber-600"
                    }`}
                  >
                    <GraduationCap className="h-5 w-5 mb-2" />
                    <div className="font-medium">{learner.name}</div>
                    <div className="text-sm text-gray-500">
                      {learner.subjects.join(", ")}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Session Type */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {session?.user?.userType === "parent" ? "4" : "3"}. Select Session
              Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Online", "In-Person", "Group"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, sessionType: type })
                  }
                  className={`p-4 rounded-lg border text-center ${
                    formData.sessionType === type
                      ? "border-amber-600 bg-amber-50"
                      : "border-gray-200 hover:border-amber-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {loading ? "Creating Booking..." : "Book Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
