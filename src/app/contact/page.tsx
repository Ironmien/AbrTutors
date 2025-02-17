"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Message sent successfully! We'll get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-4 text-xl text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {status.message && (
                  <div
                    className={`p-4 rounded-md ${
                      status.type === "success"
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

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
                    value={formData.name}
                    onChange={handleChange}
                    required
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
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                    value={formData.message}
                    onChange={handleChange}
                    required
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

            {/* Contact Information */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Our Location
                </h3>
                <div className="mt-4">
                  <p className="text-gray-600">
                    Southend
                    <br />
                    Port Elizabeth
                    <br />
                    South Africa
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Contact Information
                </h3>
                <dl className="mt-2 text-base text-gray-500">
                  <div className="mt-1">
                    <dt className="sr-only">Email</dt>
                    <dd>info@abrtutors.co.za</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="sr-only">Phone number</dt>
                    <dd>+27 075 1499977</dd>
                  </div>
                </dl>
              </div>

              {/* Services Information */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Our Services
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-amber-700">
                      Online Group Sessions
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Single sessions: R200 per session Monthly packages from
                      R700 (4 sessions) to R1300 (8 sessions)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-700">
                      Private Sessions
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Contact us for personalized one-on-one tutoring rates
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-700">
                      Home Tutoring
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Special rates for in-home tutoring - Contact for quotes
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-amber-50 p-4 rounded-md">
                  <p className="text-sm text-amber-800">
                    <strong>Special Offer:</strong> First lesson FREE for new
                    signups! Currently specializing in Pure Mathematics.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Business Hours
                </h3>
                <dl className="mt-2 text-base text-gray-500">
                  <div className="mt-1">
                    <dt className="font-medium">Monday - Friday</dt>
                    <dd>9:00 AM - 5:00 PM</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="font-medium">Saturday</dt>
                    <dd>9:00 AM - 1:00 PM</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="font-medium">Sunday</dt>
                    <dd>Closed</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
