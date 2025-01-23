"use client";

import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Services() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <div className="bg-amber-700">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                Our Tutoring Services
              </h1>
              <p className="mt-5 max-w-xl mx-auto text-xl text-amber-100">
                Personalized math tutoring tailored to your learning style and
                goals
              </p>
            </div>
          </div>
        </div>

        {/* Service Types */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* In-Person Tutoring */}
              <div className="bg-amber-50 rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900">
                    In-Person Tutoring
                  </h3>
                  <p className="mt-4 text-lg text-gray-600">
                    Join us at our modern learning facility for face-to-face
                    tutoring sessions.
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
                        Direct interaction with experienced tutors
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
                        Access to physical learning materials and resources
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
                        Distraction-free learning environment
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Online Tutoring */}
              <div className="bg-amber-50 rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Online Tutoring
                  </h3>
                  <p className="mt-4 text-lg text-gray-600">
                    Learn from the comfort of your home with our virtual
                    tutoring sessions.
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
                        Flexible scheduling options
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
                        Interactive digital whiteboard and tools
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
                        Recorded sessions for review
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
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Primary School
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Basic arithmetic and number sense</li>
                  <li>• Introduction to fractions and decimals</li>
                  <li>• Basic geometry and measurements</li>
                  <li>• Problem-solving skills</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Middle School
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Pre-algebra fundamentals</li>
                  <li>• Advanced fractions and ratios</li>
                  <li>• Geometry and spatial reasoning</li>
                  <li>• Introduction to statistics</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  High School
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Algebra I and II</li>
                  <li>• Advanced geometry</li>
                  <li>• Trigonometry</li>
                  <li>• Preparation for matric exams</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Tutoring Packages
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Choose the package that best fits your learning needs
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-12">
              {/* Basic Package */}
              <div className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Basic
                  </h3>
                  <p className="mt-4 text-gray-600">
                    Perfect for occasional help with specific topics
                  </p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">
                      R200
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      /session
                    </span>
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <svg
                        className="h-5 w-5 text-amber-700"
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
                      <span className="text-gray-600">1-hour session</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg
                        className="h-5 w-5 text-amber-700"
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
                      <span className="text-gray-600">Homework assistance</span>
                    </li>
                  </ul>
                </div>
                <div className="px-6 py-4">
                  <Link
                    href="/book?package=basic"
                    className="block w-full text-center rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* Standard Package */}
              <div className="bg-white rounded-lg shadow-lg divide-y divide-gray-200 border-2 border-amber-700">
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Standard
                  </h3>
                  <p className="mt-4 text-gray-600">
                    Ideal for regular weekly sessions
                  </p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">
                      R600
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      /month
                    </span>
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <svg
                        className="h-5 w-5 text-amber-700"
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
                      <span className="text-gray-600">
                        4 sessions per month
                      </span>
                    </li>
                    <li className="flex space-x-3">
                      <svg
                        className="h-5 w-5 text-amber-700"
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
                      <span className="text-gray-600">Progress tracking</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg
                        className="h-5 w-5 text-amber-700"
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
                      <span className="text-gray-600">
                        Study materials included
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="px-6 py-4">
                  <Link
                    href="/book?package=standard"
                    className="block w-full text-center rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
                  >
                    Get Standard
                  </Link>
                </div>
              </div>

              {/* Premium Package */}
              <div className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Premium
                  </h3>
                  <p className="mt-4 text-gray-600">
                    Comprehensive support for optimal results
                  </p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">
                      R1000
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      /month
                    </span>
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <svg
                        className="h-5 w-5 text-amber-700"
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
                      <span className="text-gray-600">
                        8 sessions per month
                      </span>
                    </li>
                    <li className="flex space-x-3">
                      <svg
                        className="h-5 w-5 text-amber-700"
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
                      <span className="text-gray-600">Priority scheduling</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg
                        className="h-5 w-5 text-amber-700"
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
                      <span className="text-gray-600">
                        Exam preparation support
                      </span>
                    </li>
                    <li className="flex space-x-3">
                      <svg
                        className="h-5 w-5 text-amber-700"
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
                      <span className="text-gray-600">
                        WhatsApp support between sessions
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="px-6 py-4">
                  <Link
                    href="/book?package=premium"
                    className="block w-full text-center rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
                  >
                    Get Premium
                  </Link>
                </div>
              </div>
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
