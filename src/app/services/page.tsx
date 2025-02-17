"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Services() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleBookSession = () => {
    if (!session) {
      // If not signed in, redirect to sign in page with callback to /book
      signIn(undefined, { callbackUrl: "/book" });
      return;
    }

    // If signed in, redirect to booking page
    // The middleware will handle all the necessary checks
    router.push("/book");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <div className="relative bg-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Expert Mathematics Tutoring
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Personalized online tutoring sessions to help you excel in
                mathematics. From basic concepts to advanced problem-solving.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <button
                    onClick={handleBookSession}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 md:py-4 md:text-lg md:px-10"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Types */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Video Call Sessions */}
              <div className="bg-amber-50 rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Video Call Sessions
                  </h3>
                  <p className="mt-4 text-lg text-gray-600">
                    Interactive online learning through video calls with screen
                    sharing
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-amber-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-600">
                        Real-time interaction with experienced tutors
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-amber-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-600">
                        Interactive digital whiteboard and screen sharing
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-amber-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-600">
                        Recorded sessions available for review
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Telephone Consultations */}
              <div className="bg-amber-50 rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Telephone Consultations
                  </h3>
                  <p className="mt-4 text-lg text-gray-600">
                    Initial consultation and support through telephone calls
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-amber-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-600">
                        Discuss learning needs and goals
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-amber-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-600">
                        Personalized learning plan development
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-amber-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-600">
                        WhatsApp support available
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Levels */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
              Grade Levels We Support
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {/* Senior Phase */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Senior Phase (Grade 8-9)
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Foundation of Pure Mathematics</li>
                  <li>• Algebra fundamentals</li>
                  <li>• Geometry and spatial reasoning</li>
                  <li>• Number patterns and sequences</li>
                  <li>• Introduction to trigonometry</li>
                </ul>
              </div>

              {/* FET Phase */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  FET Phase (Grade 10-12)
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Advanced Pure Mathematics</li>
                  <li>• Complex algebra and functions</li>
                  <li>• Advanced trigonometry</li>
                  <li>• Calculus fundamentals</li>
                  <li>• Matric exam preparation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Tutoring Packages
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Choose the package that best fits your learning needs
              </p>
              <div className="mt-4 text-amber-700 font-semibold">
                Sign up now and get your first lesson FREE!
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-12">
              {/* Basic Package */}
              <div className="relative bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">
                  Single Session
                </h3>
                <p className="mt-4 text-lg text-amber-700 font-bold">
                  R200 per session
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Group sessions (max 3 learners)</li>
                  <li>• Pay as you go</li>
                  <li>• Online interactive learning</li>
                  <li>• Basic homework support</li>
                  <li>• Flexible scheduling</li>
                </ul>
                <button
                  onClick={handleBookSession}
                  className="mt-8 w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors"
                >
                  Get Started
                </button>
              </div>

              {/* Standard Package */}
              <div className="relative bg-white p-6 rounded-lg shadow-md border-2 border-amber-500">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Monthly Standard
                </h3>
                <p className="mt-4 text-lg text-amber-700 font-bold">
                  R700 per month
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Group sessions (max 3 learners)</li>
                  <li>• 4 sessions per month</li>
                  <li>• Online interactive learning</li>
                  <li>• Extended homework support</li>
                  <li>• WhatsApp support</li>
                  <li>• Save on per-session cost</li>
                </ul>
                <button
                  onClick={handleBookSession}
                  className="mt-8 w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors"
                >
                  Choose Standard
                </button>
              </div>

              {/* Premium Package */}
              <div className="relative bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">
                  Monthly Premium
                </h3>
                <p className="mt-4 text-lg text-amber-700 font-bold">
                  R1300 per month
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Group sessions (max 3 learners)</li>
                  <li>• 8 sessions per month</li>
                  <li>• Online interactive learning</li>
                  <li>• Priority homework support</li>
                  <li>• 24/7 WhatsApp support</li>
                  <li>• Best value per session</li>
                  <li>• Monthly progress reports</li>
                </ul>
                <button
                  onClick={handleBookSession}
                  className="mt-8 w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors"
                >
                  Choose Premium
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-12 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Additional Services & Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-amber-700">
                    Private Sessions
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Looking for one-on-one attention? Contact us for private
                    tutoring rates and availability.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-700">
                    Home Tutoring
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Special rates available for in-home tutoring services.
                    Contact us for a personalized quote based on your location.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-8 text-gray-600">
              <h4 className="font-semibold text-amber-700 mb-2">
                Important Notes:
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  All regular sessions are conducted online through our
                  interactive learning platform
                </li>
                <li>
                  Currently specializing in Pure Mathematics only - more
                  subjects coming soon!
                </li>
                <li>First lesson is FREE for new signups</li>
                <li>
                  Group sessions are limited to 3 learners for optimal attention
                </li>
                <li>Contact us for custom packages or special requirements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-amber-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to excel in mathematics?</span>
              <span className="block text-amber-100">
                Book your first session today.
              </span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-amber-700 bg-white hover:bg-amber-50"
                >
                  Book Now
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-500"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
