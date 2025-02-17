"use client";

import { useState } from "react";
import {
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Send,
  HelpCircle,
} from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const faqs: FAQ[] = [
    {
      question: "How do I book a tutoring session?",
      answer:
        "To book a tutoring session, navigate to the 'Book a Session' page from your dashboard. Select your preferred date, time, and subject. You'll need to have sufficient credits in your account to complete the booking.",
    },
    {
      question: "What happens if I need to cancel a session?",
      answer:
        "You can cancel a session up to 24 hours before the scheduled time without penalty. For cancellations within 24 hours, you may be charged one credit. To cancel, go to 'My Sessions' and click the cancel button on the relevant session.",
    },
    {
      question: "How do credits work?",
      answer:
        "Credits are used to book tutoring sessions. One credit typically equals one hour of tutoring. You can purchase credits in bundles through the 'Credits' page. Some packages offer bonus credits at better rates.",
    },
    {
      question: "What subjects are available for tutoring?",
      answer:
        "We currently offer tutoring in Pure Mathematics and Mathematics Literacy. Each subject has specialized tutors who are experts in their field.",
    },
    {
      question: "How do I contact my tutor?",
      answer:
        "Once your session is confirmed, you can message your tutor through the platform's messaging system. This ensures all communication is tracked and secure.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubject("");
    setMessage("");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - FAQs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <HelpCircle className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <button
                      onClick={() =>
                        setActiveQuestion(
                          activeQuestion === index ? null : index
                        )
                      }
                      className="w-full flex justify-between items-center text-left"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        {faq.question}
                      </h3>
                      {activeQuestion === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {activeQuestion === index && (
                      <p className="mt-2 text-gray-600">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Support */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Phone className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Contact Us
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">support@abrtutors.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">+27 075 1499977</span>
                </div>
              </div>
            </div>

            {/* Support Ticket */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <MessageSquare className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Send a Message
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    required
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
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
