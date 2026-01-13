'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription for:', email);
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900 bg-opacity-50 rounded-lg border border-gray-800 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-4xl font-bold mb-2">
                Get the Halo <span className="blue-gradient-text">newsletter</span>
              </h2>
              <p className="text-gray-400">
                Subscribe to get the latest updates on AI into your inbox every month.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                required
                className="w-full md:w-64 bg-black bg-opacity-50 border border-gray-700 rounded-l-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#5DAFF0] focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-[#5DAFF0] text-black px-4 py-2 rounded-r-md font-medium hover:bg-[#8CC8FF] transition-colors"
              >
                subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo */}
            <div className="col-span-1">
              <a href="#home" className="inline-block mb-6">
                <span className="text-3xl font-bold flex items-center">
                  <span className="text-[#5DAFF0] mr-2">★</span>
                  <span className="text-white">Halo</span>
                </span>
              </a>
            </div>

            {/* Socials */}
            <div className="col-span-1">
              <h3 className="text-lg font-medium mb-4">Socials</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>

            {/* Links */}
            <div className="col-span-1">
              <h3 className="text-lg font-medium mb-4">Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#services" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#process" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    Process
                  </a>
                </li>
                <li>
                  <a href="#team" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    Terms & conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#5DAFF0] transition-colors">
                    404
                  </a>
                </li>
              </ul>
            </div>

            {/* Credits */}
            <div className="col-span-1">
              <h3 className="text-lg font-medium mb-4">Credits</h3>
              <p className="text-gray-400">
                Template by<br />
                Tibor Bregman<br />
                BlueStar Supply
              </p>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400">
              © {new Date().getFullYear()}, Halo Inc - All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}