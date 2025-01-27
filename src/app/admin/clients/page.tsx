"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Search, Users, CalendarDays, CreditCard, Package } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  packageType: string;
  credits: number;
  bookings: {
    id: string;
    date: string;
    status: string;
  }[];
  payments: {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }[];
}

export default function ClientsPage() {
  const { data: session } = useSession();
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchClients();
    }
  }, [session]);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (response.ok) {
        setClients(data.users);
      } else {
        setError(data.error || "Failed to fetch clients");
      }
    } catch (error) {
      setError("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Client Management
          </h1>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-gray-600">
              Total Clients: {clients.length}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client List Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="text-center py-4">Loading clients...</div>
              ) : (
                <div className="space-y-2">
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        selectedClient?.id === client.id
                          ? "bg-amber-50 border border-amber-200"
                          : "hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {client.name || "No name"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.email}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Client Details Section */}
          <div className="lg:col-span-2">
            {selectedClient ? (
              <div className="space-y-6">
                {/* Basic Info Card */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Client Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="font-medium">
                        {selectedClient.name || "No name"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{selectedClient.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Package Type</div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-amber-600" />
                        <span className="font-medium">
                          {selectedClient.packageType}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Credits</div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-amber-600" />
                        <span className="font-medium">
                          {selectedClient.credits} credits
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bookings Card */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-amber-600" />
                    Recent Bookings
                  </h2>
                  {selectedClient.bookings?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedClient.bookings.map((booking) => (
                            <tr key={booking.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(booking.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    booking.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No bookings found
                    </div>
                  )}
                </div>

                {/* Payments Card */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-amber-600" />
                    Recent Payments
                  </h2>
                  {selectedClient.payments?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedClient.payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(payment.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${payment.amount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    payment.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : payment.status === "failed"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No payments found
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                Select a client to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
