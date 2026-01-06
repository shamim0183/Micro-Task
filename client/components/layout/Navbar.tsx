"use client"

import { useAuth } from "@/contexts/AuthContext"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { FaBars, FaBell, FaCoins, FaTimes } from "react-icons/fa"

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    // Clear user state immediately for instant feedback
    logout()
    // Use replace for instant navigation without waiting for Firebase
    window.location.replace("/")
  }

  // Show full-screen loading during logout
  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Logging out...</p>
      </div>
    )
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TaskEarn
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {loading ? (
              // Loading skeleton
              <div className="flex items-center space-x-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ) : !user ? (
              <>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg">
                  <FaCoins className="text-amber-600" />
                  <span className="font-semibold text-gray-800">
                    {user.coins}
                  </span>
                </div>
                <Link
                  href="/dashboard/notifications"
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <FaBell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>
                <div className="flex items-center space-x-3">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-primary-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="py-4 space-y-3">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 flex items-center space-x-3 border-b">
                      <img
                        src={user.photoURL || "/default-avatar.png"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {user.role}
                        </div>
                        <div className="flex items-center space-x-1 text-amber-600">
                          <FaCoins />
                          <span className="font-semibold">{user.coins}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
