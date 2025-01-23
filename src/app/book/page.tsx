"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BookSession() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    package: searchParams.get("package") || "single",
    sessionType: "in-person",
    preferredDate: searchParams.get("date") || "",
    preferredTime: searchParams.get("time") || "",
    studentName: session?.user?.name || "",
    additionalNotes: "",
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const packages = [
    {
      id: "single",
      name: "Single Session",
      description: "One-time tutoring session (R200)",
    },
    {
      id: "weekly",
      name: "Weekly Package",
      description: "Regular weekly sessions (R600/month)",
    },
    {
      id: "monthly",
      name: "Monthly Package",
      description: "Comprehensive monthly package (R1000/month)",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Booking successful! Redirecting to dashboard...",
        });
        // Redirect to dashboard after successful booking
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to create booking. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Book a Session</h1>
            <p className="mt-2 text-gray-600">
              Schedule your tutoring session with Math Mastery
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {status.message && (
                <div
                  className={`p-4 rounded-md ${
                    status.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {status.message}
                </div>
              )}

              {/* Package Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select Package
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {packages.map((pkg) => (
                    <div key={pkg.id}>
                      <input
                        type="radio"
                        name="package"
                        id={pkg.id}
                        value={pkg.id}
                        checked={formData.package === pkg.id}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <label
                        htmlFor={pkg.id}
                        className="flex flex-col p-4 border rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-900">
                          {pkg.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {pkg.description}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Type */}
              <div>
                <label
                  htmlFor="sessionType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Session Type
                </label>
                <select
                  id="sessionType"
                  name="sessionType"
                  value={formData.sessionType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="in-person">In-Person</option>
                  <option value="online">Online</option>
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="preferredDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    id="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="preferredTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    name="preferredTime"
                    id="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    min="09:00"
                    max="17:00"
                    step="1800"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label
                  htmlFor="additionalNotes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="additionalNotes"
                  id="additionalNotes"
                  rows={3}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Any specific topics you'd like to cover or other requirements"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
