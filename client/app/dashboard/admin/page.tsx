"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import apiClient from "@/lib/axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaCoins, FaDollarSign, FaShoppingCart, FaUsers } from "react-icons/fa"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await apiClient.get("/admin/stats")
      if (response.data.success) {
        const apiData = response.data.data
        // The API returns { success, data: { users: { workers, buyers }, coins, payments } }
        setStats({
          totalWorkers: apiData.users?.workers || 0,
          totalBuyers: apiData.users?.buyers || 0,
          totalCoins: apiData.coins || 0,
          totalPayments: apiData.payments || 0,
        })
      }
    } catch (error) {
      console.error("Fetch stats error:", error)
      toast.error("Failed to load dashboard statistics")
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    {
      label: "Total Workers",
      value: loading ? "..." : stats.totalWorkers.toString(),
      icon: FaUsers,
      color: "bg-blue-500",
    },
    {
      label: "Total Buyers",
      value: loading ? "..." : stats.totalBuyers.toString(),
      icon: FaShoppingCart,
      color: "bg-purple-500",
    },
    {
      label: "Total Coins",
      value: loading ? "..." : stats.totalCoins.toString(),
      icon: FaCoins,
      color: "bg-amber-500",
    },
    {
      label: "Total Payments",
      value: loading ? "..." : `$${stats.totalPayments}`,
      icon: FaDollarSign,
      color: "bg-green-500",
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col items-center text-center">
                <div className={`${stat.color} p-4 rounded-lg mb-3`}>
                  <stat.icon className="text-white text-3xl" />
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Withdraw Requests */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Pending Withdraw Requests
          </h2>
          <div className="text-center py-12 text-gray-500">
            <p>No pending withdrawal requests.</p>
            <p className="text-sm mt-2">Check back later!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
