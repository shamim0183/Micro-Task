"use client"

import Link from "next/link"
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
              TaskEarn
            </div>
            <p className="text-gray-400 text-sm">
              Complete micro-tasks and earn money. A platform connecting workers
              with buyers for efficient task completion.
            </p>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Developers
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/yourusername/taskearn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FaGithub /> Join as Developer
                </a>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-primary-400 transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-primary-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/shamim0183"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary-600 flex items-center justify-center transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linkedin.com/in/shamim0183"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary-600 flex items-center justify-center transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://facebook.com/shamim0183"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary-600 flex items-center justify-center transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com/shamim0183"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary-600 flex items-center justify-center transition-colors"
              >
                <FaTwitter size={20} />
              </a>
            </div>
            <p className="text-gray-400 text-xs mt-4">
              Developed by{" "}
              <span className="text-primary-400 font-semibold">
                Shamim Hossain
              </span>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} TaskEarn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
