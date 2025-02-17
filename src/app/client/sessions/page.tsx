"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

interface PayFastFormProps {
  amount: number;
  itemName: string;
  description: string;
  sessions: number;
}

const PayFastForm = ({
  amount,
  itemName,
  description,
  sessions,
}: PayFastFormProps) => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <form
      action="https://sandbox.payfast.co.za/eng/process"
      method="post"
      className="space-y-4 bg-white p-6 rounded-lg shadow-md"
    >
      <input
        type="hidden"
        name="merchant_id"
        value={process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}
      />
      <input
        type="hidden"
        name="merchant_key"
        value={process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY}
      />
      <input
        type="hidden"
        name="return_url"
        value={`${baseUrl}/client/dashboard?status=success`}
      />
      <input
        type="hidden"
        name="cancel_url"
        value={`${baseUrl}/client/dashboard?status=cancelled`}
      />
      <input
        type="hidden"
        name="notify_url"
        value={`${baseUrl}/api/payments/notify`}
      />

      <input type="hidden" name="amount" value={amount.toFixed(2)} />
      <input type="hidden" name="item_name" value={itemName} />
      <input type="hidden" name="item_description" value={description} />
      <input type="hidden" name="custom_str1" value={sessions.toString()} />

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">{itemName}</h3>
        <p className="text-gray-600">{description}</p>
        <p className="text-2xl font-bold text-amber-600">
          R{amount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">
          {sessions} {sessions === 1 ? "Session" : "Sessions"}
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition-colors"
      >
        Purchase Now
      </button>
    </form>
  );
};

const SessionsPage = () => {
  const router = useRouter();

  const packages = [
    {
      name: "Single Session",
      description: "Perfect for a trial or one-time tutoring need",
      price: 250,
      sessions: 1,
    },
    {
      name: "Standard Package",
      description: "Most popular choice for regular tutoring",
      price: 1000,
      sessions: 5,
      savings: "Save R250",
    },
    {
      name: "Premium Package",
      description: "Best value for committed learners",
      price: 2000,
      sessions: 12,
      savings: "Save R1000",
    },
  ];

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Purchase Sessions
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose the package that best suits your tutoring needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.name} className="flex flex-col">
              <PayFastForm
                amount={pkg.price}
                itemName={pkg.name}
                description={pkg.description}
                sessions={pkg.sessions}
              />
              {pkg.savings && (
                <p className="mt-2 text-center text-green-600 font-medium">
                  {pkg.savings}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-amber-800 mb-4">
            Why Choose Our Tutoring Sessions?
          </h2>
          <ul className="space-y-2 text-amber-700">
            <li>✓ One-on-one personalized attention</li>
            <li>✓ Flexible scheduling options</li>
            <li>✓ Expert tutors in Pure Mathematics</li>
            <li>✓ Progress tracking and regular feedback</li>
            <li>✓ Sessions never expire</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;
