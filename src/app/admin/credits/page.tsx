"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Gift,
  Award,
  AlertCircle,
  Heart,
  Star,
  Search,
  LucideIcon,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  packageType: string;
}

type CreditCategory = {
  id: string;
  name: string;
  Icon: LucideIcon;
  description: string;
  defaultAmount: number;
};

const creditCategories: CreditCategory[] = [
  {
    id: "sponsor",
    name: "Sponsorship",
    Icon: Gift,
    description: "Credits provided through sponsorship or promotional offers",
    defaultAmount: 5,
  },
  {
    id: "reward",
    name: "Achievement Reward",
    Icon: Award,
    description: "Rewards for completing milestones or exceptional performance",
    defaultAmount: 3,
  },
  {
    id: "cancellation",
    name: "Cancellation Compensation",
    Icon: AlertCircle,
    description: "Compensation for cancelled sessions",
    defaultAmount: 1,
  },
  {
    id: "loyalty",
    name: "Loyalty Bonus",
    Icon: Heart,
    description: "Bonus credits for long-term students",
    defaultAmount: 2,
  },
  {
    id: "special",
    name: "Special Consideration",
    Icon: Star,
    description: "Special circumstances or administrative decisions",
    defaultAmount: 1,
  },
];

export default function CreditsManagement() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CreditCategory | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (error) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: CreditCategory) => {
    setSelectedCategory(category);
    setCreditAmount(category.defaultAmount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedCategory) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          credits: creditAmount,
          category: selectedCategory.id,
          reason,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          `Successfully added ${creditAmount} credits to ${selectedUser.name}`
        );
        fetchUsers(); // Refresh user list
        // Reset form
        setSelectedUser(null);
        setSelectedCategory(null);
        setCreditAmount(0);
        setReason("");
      } else {
        throw new Error(data.error || "Failed to add credits");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add credits");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Credits Management
        </h1>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Selection Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Select Student
            </h2>

            {/* Search Box */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="overflow-y-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Credits
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedUser?.id === user.id ? "bg-amber-50" : ""
                      }`}
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "No name"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {user.credits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Credits Assignment Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Assign Credits
            </h2>

            {selectedUser ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Student
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedUser.name || "No name"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Credit Category
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {creditCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className={`flex items-center p-3 rounded-md border ${
                          selectedCategory?.id === category.id
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:border-amber-500"
                        }`}
                      >
                        <category.Icon className="h-5 w-5 text-amber-600 mr-2" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {category.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {category.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="credits"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of Credits
                  </label>
                  <input
                    type="number"
                    id="credits"
                    min="1"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Specific Reason
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedCategory}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                >
                  {loading ? "Adding Credits..." : "Add Credits"}
                </button>
              </form>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Please select a student from the list
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
