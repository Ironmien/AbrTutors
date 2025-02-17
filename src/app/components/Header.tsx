"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const baseClass = "text-gray-700 hover:text-amber-800";
    const activeClass = "border-b-2 border-amber-700";
    return `${baseClass} ${pathname === path ? activeClass : ""}`;
  };

  return (
    <header className="bg-amber-50 shadow-sm fixed w-full top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/mathslogo.png"
                alt="ABR TUTORS Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-xl font-bold text-amber-800">
                ABR TUTORS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:space-x-8 sm:items-center">
            <Link href="/" className={getLinkClass("/")}>
              Home
            </Link>
            <Link href="/services" className={getLinkClass("/services")}>
              Services
            </Link>
            <Link href="/about" className={getLinkClass("/about")}>
              About
            </Link>
            <Link
              href="/testimonials"
              className={getLinkClass("/testimonials")}
            >
              Testimonials
            </Link>
            <Link href="/contact" className={getLinkClass("/contact")}>
              Contact
            </Link>
            {session ? (
              <>
                <Link
                  href="/book"
                  className="bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800"
                >
                  Book a Session
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-gray-700 hover:text-amber-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-amber-800"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-amber-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu Icon */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close Icon */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className={`block px-3 py-2 ${getLinkClass("/")}`}>
              Home
            </Link>
            <Link
              href="/services"
              className={`block px-3 py-2 ${getLinkClass("/services")}`}
            >
              Services
            </Link>
            <Link
              href="/about"
              className={`block px-3 py-2 ${getLinkClass("/about")}`}
            >
              About
            </Link>
            <Link
              href="/testimonials"
              className={`block px-3 py-2 ${getLinkClass("/testimonials")}`}
            >
              Testimonials
            </Link>
            <Link
              href="/contact"
              className={`block px-3 py-2 ${getLinkClass("/contact")}`}
            >
              Contact
            </Link>
            {session ? (
              <>
                <Link
                  href="/book"
                  className="block px-3 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800"
                >
                  Book a Session
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block px-3 py-2 text-gray-700 hover:text-amber-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 text-gray-700 hover:text-amber-800"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
