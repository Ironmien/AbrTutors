"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";

interface LearnerInfo {
  name: string;
  dateOfBirth: string;
  grade: string;
}

export default function RegisterLearners() {
  const [learners, setLearners] = useState<LearnerInfo[]>([
    { name: "", dateOfBirth: "", grade: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddLearner = () => {
    setLearners([...learners, { name: "", dateOfBirth: "", grade: "" }]);
  };

  const handleRemoveLearner = (index: number) => {
    if (learners.length === 1) {
      toast.error("You must register at least one learner");
      return;
    }
    const newLearners = learners.filter((_, i) => i !== index);
    setLearners(newLearners);
  };

  const handleChange = (
    index: number,
    field: keyof LearnerInfo,
    value: string
  ) => {
    const newLearners = [...learners];
    newLearners[index] = { ...newLearners[index], [field]: value };
    setLearners(newLearners);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields are filled
    const isValid = learners.every(
      (learner) => learner.name && learner.dateOfBirth && learner.grade
    );

    if (!isValid) {
      toast.error("Please fill in all fields for each learner");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/learners/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learners }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register learners");
      }

      toast.success("Learners registered successfully!");
      router.push("/profile");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to register learners"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Your Learners
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please provide information about your children
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {learners.map((learner, index) => (
              <div
                key={index}
                className="space-y-4 p-4 border border-gray-200 rounded-md relative"
              >
                {learners.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLearner(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}

                <div>
                  <label
                    htmlFor={`name-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id={`name-${index}`}
                      value={learner.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`dob-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      id={`dob-${index}`}
                      value={learner.dateOfBirth}
                      onChange={(e) =>
                        handleChange(index, "dateOfBirth", e.target.value)
                      }
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`grade-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Grade
                  </label>
                  <div className="mt-1">
                    <select
                      id={`grade-${index}`}
                      value={learner.grade}
                      onChange={(e) =>
                        handleChange(index, "grade", e.target.value)
                      }
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select grade</option>
                      <option value="R">Grade R</option>
                      <option value="1">Grade 1</option>
                      <option value="2">Grade 2</option>
                      <option value="3">Grade 3</option>
                      <option value="4">Grade 4</option>
                      <option value="5">Grade 5</option>
                      <option value="6">Grade 6</option>
                      <option value="7">Grade 7</option>
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddLearner}
              className="w-full flex justify-center items-center py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-amber-500 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Another Learner
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Registering learners...
                </>
              ) : (
                "Register Learners"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
