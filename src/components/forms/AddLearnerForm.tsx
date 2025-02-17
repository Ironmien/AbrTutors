"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function AddLearnerForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name"),
        dateOfBirth: formData.get("dateOfBirth"),
        schoolYear: parseInt(formData.get("schoolYear") as string),
        subjects: formData.getAll("subjects"),
      };

      const response = await fetch("/api/learners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add learner");
      }

      toast.success("Learner added successfully");
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add learner"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <div>Please sign in to add a learner.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Learner's Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="dateOfBirth"
          className="block text-sm font-medium text-gray-700"
        >
          Date of Birth
        </label>
        <input
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="schoolYear"
          className="block text-sm font-medium text-gray-700"
        >
          School Year
        </label>
        <select
          name="schoolYear"
          id="schoolYear"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select Year</option>
          {Array.from({ length: 13 }, (_, i) => i + 1).map((year) => (
            <option key={year} value={year}>
              Year {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Subjects
        </label>
        <div className="mt-2 space-y-2">
          {[
            "Mathematics",
            "English",
            "Science",
            "History",
            "Geography",
            "Languages",
          ].map((subject) => (
            <div key={subject} className="flex items-center">
              <input
                type="checkbox"
                name="subjects"
                value={subject}
                id={`subject-${subject}`}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`subject-${subject}`}
                className="ml-2 text-sm text-gray-700"
              >
                {subject}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Learner"}
        </button>
      </div>
    </form>
  );
}
