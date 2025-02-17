"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Users } from "lucide-react";

export default function UserTypePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUserTypeSelect = async (
    type: "parent" | "independent_learner"
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType: type }),
      });

      if (!response.ok) throw new Error("Failed to update user type");

      // Redirect based on user type
      if (type === "parent") {
        router.push("/register-learners");
      } else {
        router.push("/credits");
      }
    } catch (error) {
      console.error("Error updating user type:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to ABR Tutors
          </h1>
          <p className="mt-2 text-gray-600">
            Please select your user type to continue
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleUserTypeSelect("parent")}
            disabled={loading}
            className="w-full flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 text-amber-600 mr-4" />
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-900">Parent</h2>
                <p className="text-sm text-gray-500">
                  Register and manage multiple learners
                </p>
              </div>
            </div>
            <div className="text-amber-600">→</div>
          </button>

          <button
            onClick={() => handleUserTypeSelect("independent_learner")}
            disabled={loading}
            className="w-full flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-amber-600 mr-4" />
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-900">
                  Independent Learner
                </h2>
                <p className="text-sm text-gray-500">Register for yourself</p>
              </div>
            </div>
            <div className="text-amber-600">→</div>
          </button>
        </div>
      </div>
    </div>
  );
}
