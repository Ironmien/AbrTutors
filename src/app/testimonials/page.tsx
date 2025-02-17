"use client";

import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

const testimonials = [
  {
    name: "Thembekile Maswana",
    grade: "Grade 12",
    achievement: "Achieved 82% in Pure Mathematics",
    quote:
      "ABR Tutors helped me achieve my academic goals through their dedicated support and excellent teaching methods. The personalized attention in small group sessions made a huge difference in my understanding of mathematics.",
    image: "/images/avatars/Person1.png",
    improvement: "Final Grade: 82%",
    year: "2023",
  },
  {
    name: "Bathabile Mkhize",
    grade: "Grade 8",
    achievement: "Improved from 38% to 55%",
    quote:
      "When I started with ABR Tutors, I was struggling with mathematics. Their patient approach and structured learning methods helped me improve significantly. The small group sessions allowed me to learn from other students' questions too.",
    image: "/images/avatars/Person2.png",
    improvement: "Improvement: +17%",
    year: "2023",
  },
  {
    name: "Nhlanhla Phakathi",
    grade: "Grade 11",
    achievement: "Improved from 40% to 66%",
    quote:
      "The transformation in my mathematics performance has been incredible. ABR Tutors' teaching methods made complex concepts easy to understand. The regular practice and support helped me gain confidence in my abilities.",
    image: "/images/avatars/Person3.png",
    improvement: "Improvement: +26%",
    year: "2023",
  },
];

export default function Testimonials() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <div className="bg-amber-700">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                Student Success Stories
              </h1>
              <p className="mt-5 max-w-xl mx-auto text-xl text-amber-100">
                See how our dedicated tutoring has helped students achieve
                remarkable improvements in Pure Mathematics
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-gray-600">{testimonial.grade}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 mb-6">
                      <p className="text-amber-800 font-semibold text-center">
                        {testimonial.achievement}
                      </p>
                      <p className="text-amber-700 text-sm text-center mt-2">
                        {testimonial.improvement}
                      </p>
                    </div>
                    <blockquote className="text-gray-600 italic text-center">
                      "{testimonial.quote}"
                    </blockquote>
                    <p className="text-gray-500 text-sm text-center mt-4">
                      Class of {testimonial.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Join Our Success Stories
              </h2>
              <p className="text-gray-600 mb-6">
                Start your journey to better grades with ABR Tutors. First
                lesson is FREE!
              </p>
              <div className="space-x-4">
                <a
                  href="/contact"
                  className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="/book"
                  className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Book a Session
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
