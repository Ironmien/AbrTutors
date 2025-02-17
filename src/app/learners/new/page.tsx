"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AddLearnerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableSubjects = [
    "Mathematics",
    "English",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
  ];

  const handleSubjectToggle = (subject: string) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/learners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dateOfBirth,
          schoolYear: parseInt(schoolYear),
          subjects,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/book");
      } else {
        setError(data.error || "Failed to add learner");
      }
    } catch (error) {
      setError("Failed to add learner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Add a Learner</h1>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Learner&apos;s Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter learner's name"
              />
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="schoolYear"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                School Year
              </label>
              <input
                id="schoolYear"
                type="number"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                required
                min="1"
                max="13"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter school year (1-13)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects
              </label>
              <div className="grid grid-cols-2 gap-4">
                {availableSubjects.map((subject) => (
                  <label
                    key={subject}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={subjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Adding Learner..." : "Add Learner"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
