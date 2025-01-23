"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";

export default function About() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-12 md:px-12 text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="md:flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  ABR TUTORS
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Founded by Armien Abrahams
                </p>
                <p className="text-gray-600">
                  Expert Mathematics Education with Over 25 Years of Experience
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:ml-12">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg">
                  <Image
                    src="/images/mathslogo.png"
                    alt="ABR TUTORS"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Experience & Qualifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Experience
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-500"
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
                  <p className="ml-3 text-gray-600">
                    Over 25 years of teaching experience in England and South
                    Africa
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-500"
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
                  <p className="ml-3 text-gray-600">
                    Currently freelancing as a mathematics teacher at a private
                    school
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-500"
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
                  <p className="ml-3 text-gray-600">
                    Extensive experience in private tutoring
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Qualifications
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-500"
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
                  <p className="ml-3 text-gray-600">
                    Graduate from University of Western Cape
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-500"
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
                  <p className="ml-3 text-gray-600">
                    Specialized in Mathematics Education
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Outstanding Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  100%
                </div>
                <p className="text-gray-600">Pass Rate in 2023</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-5xl font-bold text-blue-600 mb-2">91%</div>
                <p className="text-gray-600">Pass Rate in 2024</p>
              </div>
            </div>
          </div>

          {/* Teaching Philosophy */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Teaching Philosophy
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                At ABR TUTORS, with over two and a half decades of experience in
                mathematics education, we believe in creating a supportive and
                engaging learning environment where students can develop both
                their mathematical skills and confidence.
              </p>
              <p className="mb-4">
                Our approach combines traditional teaching methods with modern
                techniques, ensuring that students not only understand
                mathematical concepts but also their practical applications in
                the real world.
              </p>
              <p>
                The consistent achievement of excellent results, including a
                100% pass rate in 2023 and 91% in 2024, reflects our commitment
                to helping each student reach their full potential in
                mathematics.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
