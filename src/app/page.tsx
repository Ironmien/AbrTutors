import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
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
                        <Link
                          href="/book"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 md:py-4 md:text-lg md:px-10"
                        >
                          Book a Session
                        </Link>
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
                mathematics. With tailored tutoring sessions, we empower
                learners to achieve their academic goals and build confidence.
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="text-lg leading-6 font-medium text-gray-900">
                    Physical Location
                  </div>
                  <p className="mt-2 text-base text-gray-500">
                    Visit us at 142 Govan Mbeki Avenue, Qgebera for in-person
                    sessions in our modern learning environment.
                  </p>
                </div>
                <div className="relative">
                  <div className="text-lg leading-6 font-medium text-gray-900">
                    Online Sessions
                  </div>
                  <p className="mt-2 text-base text-gray-500">
                    Can't make it in person? Join us online for the same quality
                    tutoring experience from the comfort of your home.
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
                Comprehensive math tutoring tailored to your needs
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="text-lg leading-6 font-medium text-gray-900">
                    One-on-One Tutoring
                  </div>
                  <p className="mt-2 text-base text-gray-500">
                    Personalized attention and customized learning plans for
                    optimal progress.
                  </p>
                </div>

                <div className="relative">
                  <div className="text-lg leading-6 font-medium text-gray-900">
                    All Grade Levels
                  </div>
                  <p className="mt-2 text-base text-gray-500">
                    From primary school basics to advanced high school
                    mathematics.
                  </p>
                </div>

                <div className="relative">
                  <div className="text-lg leading-6 font-medium text-gray-900">
                    Flexible Scheduling
                  </div>
                  <p className="mt-2 text-base text-gray-500">
                    Book sessions at times that work best for you, both online
                    and in-person.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 md:py-4 md:text-lg md:px-10"
              >
                Book Your First Session
              </Link>
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
                  <p className="mt-2 text-base text-gray-500">
                    142 Govan Mbeki Avenue
                    <br />
                    Qgebera
                    <br />
                    South Africa
                  </p>
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
