"use client";

import { useState } from "react";
import { toast } from "sonner";
import UserSearch from "@/components/admin/UserSearch";

interface User {
  id: string;
  name: string;
  email: string;
  availableSessions: number;
}

interface SessionHistory {
  id: string;
  date: string;
  type: "ADD" | "DEDUCT";
  amount: number;
  category: string;
  reason: string;
}

export default function SessionsManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    try {
      const response = await fetch(
        `/api/admin/sessions/history?userId=${user.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch session history");
      const data = await response.json();
      setSessionHistory(data.sessionHistory);
    } catch (error) {
      console.error("Error fetching session history:", error);
      toast.error("Failed to fetch session history");
    }
  };

  const handleSessionUpdate = async (type: "ADD" | "DEDUCT") => {
    if (!selectedUser || !amount || !reason) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: parseInt(amount),
          category: "manual_adjustment",
          reason,
          type,
        }),
      });

      if (!response.ok) throw new Error("Failed to update sessions");

      const data = await response.json();
      setSelectedUser({
        ...selectedUser,
        availableSessions: data.updatedUser.availableSessions,
      });
      setSessionHistory([data.sessionHistory, ...sessionHistory]);
      setAmount("");
      setReason("");
      toast.success(
        `Sessions ${type === "ADD" ? "added" : "deducted"} successfully`
      );
    } catch (error) {
      console.error("Error updating sessions:", error);
      toast.error("Failed to update sessions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sessions Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Search Users</h2>
          <UserSearch onSelect={handleUserSelect} />

          {selectedUser && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold">{selectedUser.name}</h3>
              <p className="text-gray-600">{selectedUser.email}</p>
              <p className="mt-2">
                Available Sessions:{" "}
                <span className="font-semibold">
                  {selectedUser.availableSessions}
                </span>
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Sessions
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reason
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleSessionUpdate("ADD")}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Add Sessions
                  </button>
                  <button
                    onClick={() => handleSessionUpdate("DEDUCT")}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Deduct Sessions
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedUser && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Session History</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessionHistory.map((history) => (
                      <tr key={history.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(history.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              history.type === "ADD"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {history.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {history.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {history.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
