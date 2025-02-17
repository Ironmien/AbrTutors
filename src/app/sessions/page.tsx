"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

interface Session {
  id: string;
  date: string;
  time: string;
  subject: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  tutor?: string;
  learner: string;
  notes?: string;
}

export default function SessionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - replace with API call
  const [sessions] = useState<Session[]>([
    {
      id: "1",
      date: "2024-02-20",
      time: "14:00",
      subject: "Pure Mathematics",
      status: "confirmed",
      tutor: "Mr. Smith",
      learner: "John Doe",
      notes: "Chapter 3: Trigonometry",
    },
    {
      id: "2",
      date: "2024-02-22",
      time: "15:00",
      subject: "Mathematics Literacy",
      status: "pending",
      learner: "Jane Doe",
    },
    {
      id: "3",
      date: "2024-02-18",
      time: "10:00",
      subject: "Pure Mathematics",
      status: "completed",
      tutor: "Mrs. Johnson",
      learner: "John Doe",
      notes: "Chapter 2: Algebra Review",
    },
  ]);

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case "upcoming":
        return sessionDate >= today;
      case "past":
        return sessionDate < today;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Your Sessions</h1>
            <button
              onClick={() => router.push("/book")}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book New Session
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex space-x-2">
              {["all", "upcoming", "past"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as typeof filter)}
                  className={`px-4 py-2 rounded-lg ${
                    filter === f
                      ? "bg-amber-100 text-amber-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <GraduationCap className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{s.subject}</h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(s.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {s.time}
                      </p>
                      {s.tutor && (
                        <p className="text-sm text-gray-600">
                          Tutor: {s.tutor}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Learner: {s.learner}
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    s.status
                  )}`}
                >
                  {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                </span>
              </div>
              {s.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">{s.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-lg hover:bg-gray-100"
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-gray-600">Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-2 rounded-lg hover:bg-gray-100"
            disabled={filteredSessions.length < 10}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </main>
    </div>
  );
}
