"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">AbrTutors</h3>
            <p className="text-gray-400 mt-2">Quality tutoring for everyone</p>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <p className="text-gray-400">Email: contact@abrtutors.com</p>
              <p className="text-gray-400">Phone: (123) 456-7890</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} AbrTutors. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
