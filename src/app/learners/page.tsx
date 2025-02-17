"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddLearnerForm from "@/components/forms/AddLearnerForm";
import { toast } from "sonner";

interface Learner {
  id: string;
  name: string;
  dateOfBirth: string | null;
  schoolYear: number | null;
  subjects: string[];
  createdAt: string;
}

export default function LearnersPage() {
  const { data: session } = useSession();
  const [learners, setLearners] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const response = await fetch("/api/learners");
        if (!response.ok) {
          throw new Error("Failed to fetch learners");
        }
        const data = await response.json();
        setLearners(data.learners);
      } catch (error) {
        toast.error("Failed to fetch learners");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchLearners();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Learners</h1>
        <div>Please sign in to manage learners.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Learners</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Learner</h2>
          <AddLearnerForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your Learners</h2>
          {loading ? (
            <div>Loading learners...</div>
          ) : learners.length === 0 ? (
            <div>No learners added yet.</div>
          ) : (
            <div className="space-y-4">
              {learners.map((learner) => (
                <div
                  key={learner.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <h3 className="font-semibold text-lg">{learner.name}</h3>
                  {learner.schoolYear && (
                    <p className="text-gray-600">Year {learner.schoolYear}</p>
                  )}
                  {learner.dateOfBirth && (
                    <p className="text-gray-600">
                      DOB: {new Date(learner.dateOfBirth).toLocaleDateString()}
                    </p>
                  )}
                  {learner.subjects.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Subjects:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {learner.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
