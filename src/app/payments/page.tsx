"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
}

const packages: Package[] = [
  {
    id: "single",
    name: "Single Session",
    credits: 1,
    price: 50,
    description: "Perfect for trying out our tutoring service",
  },
  {
    id: "package5",
    name: "5 Sessions Package",
    credits: 5,
    price: 225,
    description: "Save 10% on regular session price",
  },
  {
    id: "package10",
    name: "10 Sessions Package",
    credits: 10,
    price: 400,
    description: "Best value! Save 20% on regular session price",
  },
];

const PaymentsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setError("");
  };

  const handlePayment = async () => {
    if (!selectedPackage) {
      setError("Please select a package");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          amount: selectedPackage.price,
          credits: selectedPackage.credits,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to success page or show success message
        router.push("/dashboard?payment=success");
      } else {
        setError(data.error || "Failed to process payment");
      }
    } catch (error) {
      setError("Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    router.push("/login?callbackUrl=/payments");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Purchase Credits</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all ${
                selectedPackage?.id === pkg.id
                  ? "ring-2 ring-blue-500"
                  : "hover:shadow-lg"
              }`}
              onClick={() => handlePackageSelect(pkg)}
            >
              <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">
                ${pkg.price}
              </p>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {pkg.credits} Credits
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Valid for 12 months
                </li>
              </ul>
            </div>
          ))}
        </div>

        {error && <div className="text-red-500 mt-6">{error}</div>}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handlePayment}
            disabled={!selectedPackage || loading}
            className={`px-8 py-3 rounded-md text-white font-medium ${
              !selectedPackage || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading
              ? "Processing..."
              : selectedPackage
              ? `Pay $${selectedPackage.price}`
              : "Select a Package"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentsPage;
