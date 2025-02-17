"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreditCard, Check, ArrowLeft } from "lucide-react";

const PayFastForm = ({
  amount,
  itemName,
  description,
}: {
  amount: number;
  itemName: string;
  description: string;
}) => {
  return (
    <form
      name="PayFastPayNowForm"
      action="https://payment.payfast.io/eng/process"
      method="post"
    >
      <input required type="hidden" name="cmd" value="_paynow" />
      <input
        required
        type="hidden"
        name="receiver"
        pattern="[0-9]"
        value="20736437"
      />
      <input required type="hidden" name="amount" value={amount.toString()} />
      <input
        required
        type="hidden"
        name="item_name"
        maxLength={255}
        value={itemName}
      />
      <input
        type="hidden"
        name="item_description"
        maxLength={255}
        value={description}
      />
      <table>
        <tr>
          <td colSpan={2} align="center">
            <input
              type="image"
              src="https://my.payfast.io/images/buttons/PayNow/Primary-Large-PayNow.png"
              alt="Pay Now"
              title="Pay Now with Payfast"
            />
          </td>
        </tr>
      </table>
    </form>
  );
};

export default function Credits() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Current Sessions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <CreditCard className="h-8 w-8 text-amber-600" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Sessions
              </h2>
              <p className="text-gray-600">
                Available sessions: {session?.user?.credits || 0}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Purchase Tutoring Sessions
        </h2>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Package */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-transparent hover:border-amber-500 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900">
              Basic Package
            </h3>
            <div className="mt-4">
              <p className="text-4xl font-bold text-amber-600">R200</p>
              <p className="text-gray-600">Single Session</p>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center text-gray-600">
                <Check className="h-5 w-5 text-green-500 mr-2" />1 Online
                tutoring session
              </li>
              <li className="flex items-center text-gray-600">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                60 minutes per session
              </li>
              <li className="flex items-center text-gray-600">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                One-on-one attention
              </li>
            </ul>
            <div className="mt-8">
              <PayFastForm
                amount={200}
                itemName="One Session"
                description="Basic Package of one hour session"
              />
            </div>
          </div>

          {/* Standard Package */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-amber-500 relative">
            <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm">
              Popular
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Standard Package
            </h3>
            <div className="mt-4">
              <p className="text-4xl font-bold text-amber-600">R700</p>
              <p className="text-gray-600">4 Sessions</p>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center text-gray-600">
                <Check className="h-5 w-5 text-green-500 mr-2" />4 Online
                tutoring sessions
              </li>
              <li className="flex items-center text-gray-600">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                60 minutes per session
              </li>
              <li className="flex items-center text-gray-600">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Save R100 on sessions
              </li>
            </ul>
            <div className="mt-8">
              <PayFastForm
                amount={700}
                itemName="Standard Package"
                description="Standard Package of 4 sessions of one hour each"
              />
            </div>
          </div>

          {/* Premium Package */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-transparent hover:border-amber-500 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900">
              Premium Package
            </h3>
            <div className="mt-4">
              <p className="text-4xl font-bold text-amber-600">R1300</p>
              <p className="text-gray-600">8 Sessions</p>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center text-gray-600">
                <Check className="h-5 w-5 text-green-500 mr-2" />8 Online
                tutoring sessions
              </li>
              <li className="flex items-center text-gray-600">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                60 minutes per session
              </li>
              <li className="flex items-center text-gray-600">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Save R300 on sessions
              </li>
            </ul>
            <div className="mt-8">
              <PayFastForm
                amount={1300}
                itemName="Premium Package"
                description="Premium Package of 8 sessions of one hour each"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
