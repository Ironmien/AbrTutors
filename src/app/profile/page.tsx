"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Building,
  Hash,
  Save,
  Loader2,
  BookOpen,
} from "lucide-react";

interface ProfileFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  schoolYear?: number;
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
  });
  const [learnerData, setLearnerData] = useState<{
    id: string;
    schoolYear: number | null;
  }>();

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
        address: (session.user as any).address || "",
        city: (session.user as any).city || "",
        postcode: (session.user as any).postcode || "",
      });
    }
  }, [session]);

  useEffect(() => {
    // Fetch learner data for independent learner
    const fetchLearnerData = async () => {
      if (session?.user?.userType === "independent_learner") {
        const response = await fetch("/api/learner");
        if (response.ok) {
          const data = await response.json();
          setLearnerData(data);
        }
      }
    };
    fetchLearnerData();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update profile
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const data = await response.json();
      await updateSession(data.user);

      // Update learner data if independent learner
      if (
        session?.user?.userType === "independent_learner" &&
        learnerData?.id
      ) {
        const learnerResponse = await fetch(`/api/learner/${learnerData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schoolYear: formData.schoolYear }),
        });

        if (!learnerResponse.ok)
          throw new Error("Failed to update learner data");
      }

      toast.success("Profile updated successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please sign in to access your profile
          </h1>
        </div>
      </div>
    );
  }

  // Add schoolYear field for independent learners
  const showSchoolYearField = session?.user?.userType === "independent_learner";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            {!session.user.profileComplete
              ? "Please complete your profile to continue"
              : "Update your personal information"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-6 rounded-lg shadow"
        >
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                Street Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your street address"
              />
            </div>

            {/* City */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building className="h-4 w-4 mr-2" />
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your city"
              />
            </div>

            {/* Postcode */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Hash className="h-4 w-4 mr-2" />
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) =>
                  setFormData({ ...formData, postcode: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your postal code"
              />
            </div>

            {/* School Year Field - Only show for independent learners */}
            {showSchoolYearField && (
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="h-4 w-4 mr-2" />
                  School Year
                </label>
                <select
                  value={formData.schoolYear || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schoolYear: Number(e.target.value),
                    })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select your school year</option>
                  {[7, 8, 9, 10, 11, 12, 13].map((year) => (
                    <option key={year} value={year}>
                      Year {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Email (Read-only) */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={session.user.email || ""}
                readOnly
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Email cannot be changed
              </p>
            </div>
          </div>

          <div className="pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
