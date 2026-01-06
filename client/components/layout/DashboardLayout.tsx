"use client"

import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  FaBars,
  FaBell,
  FaCoins,
  FaDollarSign,
  FaFileAlt,
  FaHistory,
  FaHome,
  FaPlus,
  FaTasks,
  FaTimes,
  FaUsers,
} from "react-icons/fa"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const workerLinks = [
    { href: "/dashboard/worker", icon: FaHome, label: "Home" },
    { href: "/dashboard/worker/tasks", icon: FaTasks, label: "Task List" },
    {
      href: "/dashboard/worker/submissions",
      icon: FaFileAlt,
      label: "My Submissions",
    },
    {
      href: "/dashboard/worker/withdrawals",
      icon: FaDollarSign,
      label: "Withdrawals",
    },
  ]

  const buyerLinks = [
    { href: "/dashboard/buyer", icon: FaHome, label: "Home" },
    { href: "/dashboard/buyer/add-task", icon: FaPlus, label: "Add New Task" },
    { href: "/dashboard/buyer/my-tasks", icon: FaTasks, label: "My Tasks" },
    {
      href: "/dashboard/buyer/purchase-coin",
      icon: FaCoins,
      label: "Purchase Coin",
    },
    {
      href: "/dashboard/buyer/payment-history",
      icon: FaHistory,
      label: "Payment History",
    },
  ]

  const adminLinks = [
    { href: "/dashboard/admin", icon: FaHome, label: "Home" },
    { href: "/dashboard/admin/users", icon: FaUsers, label: "Manage Users" },
    { href: "/dashboard/admin/tasks", icon: FaTasks, label: "Manage Tasks" },
    {
      href: "/dashboard/admin/withdrawals",
      icon: FaDollarSign,
      label: "Withdraw Requests",
    },
  ]

  const links =
    user.role === "worker"
      ? workerLinks
      : user.role === "buyer"
      ? buyerLinks
      : adminLinks

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen bg-white shadow-lg z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
      >
        <div className="p-6 border-b">
          <div className="mt-4 flex items-center space-x-3">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt={user.name}
              className="w-12 h-12 rounded-full border-2 border-primary-500"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">
                {user.name}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {user.role}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg">
            <FaCoins className="text-amber-600" />
            <span className="font-bold text-gray-800">{user.coins} Coins</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <link.icon className="text-lg" />
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Link
            href="/dashboard/notifications"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <FaBell />
            <span className="text-sm font-medium">Notifications</span>
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              3
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-700 hover:text-primary-600"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <div className="font-bold text-primary-600">TaskEarn</div>
          <div className="flex items-center space-x-1 text-amber-600">
            <FaCoins />
            <span className="font-semibold text-sm">{user.coins}</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t p-4 text-center text-sm text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} TaskEarn. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}
