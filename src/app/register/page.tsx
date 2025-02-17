"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"parent" | "independent_learner">(
    "parent"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to profile completion
        router.push("/login?registered=true");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Create Account
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am registering as:
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="parent"
                    checked={userType === "parent"}
                    onChange={(e) =>
                      setUserType(
                        e.target.value as "parent" | "independent_learner"
                      )
                    }
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span>Parent/Guardian (registering for my children)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="independent_learner"
                    checked={userType === "independent_learner"}
                    onChange={(e) =>
                      setUserType(
                        e.target.value as "parent" | "independent_learner"
                      )
                    }
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span>Independent Learner (18+ years old)</span>
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a password"
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
