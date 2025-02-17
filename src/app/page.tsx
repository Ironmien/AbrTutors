"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { User } from "@/types";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleBookSession = () => {
    if (!session) {
      // If not signed in, redirect to sign in page
      signIn(undefined, { callbackUrl: "/client/dashboard" });
      return;
    }
    // If already signed in, redirect to dashboard
    router.push("/client/dashboard");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left lg:flex lg:items-center lg:justify-between">
                  <div className="lg:max-w-2xl">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                      <span className="block">Welcome to</span>
                      <span className="block text-amber-700">ABR TUTORS</span>
                    </h1>
                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                      Expert Guidance | Flexible Scheduling | Proven Results
                    </p>
                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                      <div className="rounded-md shadow">
                        <Link
                          href="/services"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 md:py-4 md:text-lg md:px-10"
                        >
                          Explore Services
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <button
                          onClick={handleBookSession}
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 md:py-4 md:text-lg md:px-10"
                        >
                          Book a Session
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 lg:mt-0 lg:ml-8">
                    <Image
                      src="/images/mathslogo.png"
                      alt="ABR TUTORS Logo"
                      width={400}
                      height={400}
                      priority
                      className="w-full max-w-md mx-auto lg:max-w-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                About Us
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                At ABR TUTORS, we're passionate about helping students excel in
                mathematics. With tailored online tutoring sessions, we empower
                learners to achieve their academic goals and build confidence.
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="text-lg leading-6 font-medium text-gray-900">
                    Video Call Sessions
                  </div>
                  <p className="mt-2 text-base text-gray-500">
                    Join our interactive video sessions for a personalized
                    learning experience with real-time collaboration and screen
                    sharing.
                  </p>
                </div>
                <div className="relative">
                  <div className="text-lg leading-6 font-medium text-gray-900">
                    Telephone Consultations
                  </div>
                  <p className="mt-2 text-base text-gray-500">
                    Schedule a telephone consultation to discuss your learning
                    needs and get started with our personalized tutoring
                    programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Services
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Specializing in Pure Mathematics for:
                <br />
                <span className="font-medium">
                  Senior Phase (Grade 8-9)
                </span>{" "}
                and <span className="font-medium">FET Phase (Grade 10-12)</span>
              </p>
              <div className="mt-4 text-amber-700 font-semibold">
                Sign up now and get your first lesson FREE!
              </div>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
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
                      Private Online Sessions
                    </h4>
                    <p className="text-gray-600 mt-2">
                      Looking for one-on-one attention? Our private online
                      sessions offer personalized attention and flexible
                      scheduling.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-700">
                      Interactive Learning
                    </h4>
                    <p className="text-gray-600 mt-2">
                      Experience engaging online tutoring with our interactive
                      digital whiteboard and screen sharing capabilities.
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
                    All sessions are conducted online through our interactive
                    learning platform
                  </li>
                  <li>
                    Initial consultation via telephone or video call to assess
                    your needs
                  </li>
                  <li>
                    We offer Pure Mathematics tutoring for:
                    <ul className="pl-5 mt-2 space-y-1">
                      <li>Senior Phase: Grade 8-9</li>
                      <li>FET Phase: Grade 10-12</li>
                    </ul>
                  </li>
                  <li>First lesson is FREE for new signups</li>
                  <li>
                    Group sessions are limited to 3 learners for optimal
                    attention
                  </li>
                  <li>
                    Use our chatbot to schedule a consultation or book a session
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Contact Us
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Have questions? We're here to help!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Map and Contact Info */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Our Location
                  </h3>
                  <div className="text-gray-600">
                    <p>
                      Southend
                      <br />
                      Port Elizabeth
                      <br />
                      South Africa
                    </p>
                  </div>
                  <div className="mt-4">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=142+Govan+Mbeki+Avenue+Qgebera"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-700 hover:text-amber-800"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Contact Information
                  </h3>
                  <dl className="mt-2 text-base text-gray-500">
                    <div className="mt-1">
                      <dt className="sr-only">Email</dt>
                      <dd>admin@abrtutors.co.za</dd>
                    </div>
                    <div className="mt-1">
                      <dt className="sr-only">Phone number</dt>
                      <dd>+27 075 1499977</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
