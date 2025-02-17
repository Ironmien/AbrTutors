"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Calendar from "react-calendar";
import { toast } from "sonner";
import "react-calendar/dist/Calendar.css";

interface Learner {
  id: string;
  name: string;
  email: string | null;
  isAdult: boolean;
}

export default function BookingForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [learners, setLearners] = useState<Learner[]>([]);
  const [selectedLearner, setSelectedLearner] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [sessionType, setSessionType] = useState("online");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      fetchLearners();
    }
  }, [session]);

  const fetchLearners = async () => {
    try {
      const response = await fetch("/api/learners");
      if (!response.ok) throw new Error("Failed to fetch learners");
      const data = await response.json();
      setLearners(data);

      // If user is an independent learner, auto-select themselves
      if (
        session?.user?.userType === "independent_learner" &&
        data.length === 1
      ) {
        setSelectedLearner(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to fetch learners");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!selectedLearner) {
      setError("Please select a learner");
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
          learnerId: selectedLearner,
          package: selectedPackage,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {session?.user?.userType === "parent" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Learner
          </label>
          <select
            value={selectedLearner}
            onChange={(e) => setSelectedLearner(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Select a learner</option>
            {learners.map((learner) => (
              <option key={learner.id} value={learner.id}>
                {learner.name}
              </option>
            ))}
          </select>
          {learners.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              Please add learners first in your profile
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Type
        </label>
        <select
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="online">Online</option>
          <option value="inPerson">In Person</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Package
        </label>
        <select
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="">Select a package</option>
          <option value="single">Single Session (R200)</option>
          <option value="standard">Monthly Standard - 4 Sessions (R700)</option>
          <option value="premium">Monthly Premium - 8 Sessions (R1300)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date
        </label>
        <input
          type="date"
          value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
          onChange={(e) =>
            setSelectedDate(e.target.value ? new Date(e.target.value) : null)
          }
          required
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-3 py-2 border rounded-md focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading || learners.length === 0}
        className={`w-full py-3 px-4 rounded-md text-white font-medium ${
          loading || learners.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-amber-600 hover:bg-amber-700"
        }`}
      >
        {loading ? "Booking..." : "Book Session"}
      </button>
    </form>
  );
}
