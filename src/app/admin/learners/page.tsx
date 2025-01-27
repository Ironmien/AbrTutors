"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  GraduationCap,
  CalendarDays,
  Package,
  Star,
  Clock,
  TrendingUp,
} from "lucide-react";

interface Learner {
  id: string;
  name: string;
  email: string;
  packageType: string;
  credits: number;
  bookings: {
    id: string;
    date: string;
    status: string;
    sessionType: string;
  }[];
  completedSessions: number;
  upcomingSessions: number;
  progress: number;
}

export default function LearnersPage() {
  const { data: session } = useSession();
  const [learners, setLearners] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchLearners();
    }
  }, [session]);

  const fetchLearners = async () => {
    try {
      const response = await fetch("/api/admin/learners");
      const data = await response.json();

      if (response.ok) {
        setLearners(data.learners);
      } else {
        setError(data.error || "Failed to fetch learners");
      }
    } catch (error) {
      setError("Failed to fetch learners");
    } finally {
      setLoading(false);
    }
  };

  const filteredLearners = learners.filter(
    (learner) =>
      learner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "text-green-600";
    if (progress >= 50) return "text-amber-600";
    return "text-gray-600";
  };

  const getSessionTypeIcon = (sessionType: string) => {
    switch (sessionType.toLowerCase()) {
      case "homework help":
        return "📚";
      case "exam prep":
        return "📝";
      case "concept review":
        return "🔍";
      default:
        return "📖";
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Learners Management
          </h1>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-gray-600">
              Total Learners: {learners.length}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Learner List Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="text-center py-4">Loading learners...</div>
              ) : (
                <div className="space-y-2">
                  {filteredLearners.map((learner) => (
                    <button
                      key={learner.id}
                      onClick={() => setSelectedLearner(learner)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        selectedLearner?.id === learner.id
                          ? "bg-amber-50 border border-amber-200"
                          : "hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {learner.name || "No name"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {learner.email}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                          {learner.packageType}
                        </div>
                        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {learner.completedSessions} Sessions
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Learner Details Section */}
          <div className="lg:col-span-2">
            {selectedLearner ? (
              <div className="space-y-6">
                {/* Progress Overview Card */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Learning Progress
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-amber-600" />
                        <span className="text-sm font-medium text-gray-900">
                          Package Type
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-amber-700">
                        {selectedLearner.packageType}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">
                          Completed Sessions
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {selectedLearner.completedSessions}
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">
                          Progress
                        </span>
                      </div>
                      <div
                        className={`text-2xl font-bold ${getProgressColor(
                          selectedLearner.progress
                        )}`}
                      >
                        {selectedLearner.progress}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session History Card */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-amber-600" />
                    Session History
                  </h2>
                  {selectedLearner.bookings?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedLearner.bookings.map((booking) => (
                            <tr key={booking.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(booking.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">
                                    {getSessionTypeIcon(booking.sessionType)}
                                  </span>
                                  <span className="text-sm text-gray-900">
                                    {booking.sessionType}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    booking.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No sessions found
                    </div>
                  )}
                </div>

                {/* Upcoming Sessions Card */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Learning Stats
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Upcoming Sessions
                      </div>
                      <div className="text-xl font-medium text-amber-600">
                        {selectedLearner.upcomingSessions} sessions scheduled
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Available Credits
                      </div>
                      <div className="text-xl font-medium text-green-600">
                        {selectedLearner.credits} credits remaining
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                Select a learner to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
