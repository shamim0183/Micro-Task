"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaClipboardList, FaClock, FaCoins } from "react-icons/fa"

export default function WorkerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalEarnings: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await apiClient.get("/submissions/my-submissions")
      if (response.data.success) {
        const submissions = response.data.data.submissions || []

        const totalSubmissions = submissions.length
        const pendingSubmissions = submissions.filter(
          (s: any) => s.status === "pending"
        ).length
        const approvedSubmissions = submissions.filter(
          (s: any) => s.status === "approved"
        )
        const totalEarnings = approvedSubmissions.reduce(
          (sum: any, s: any) => sum + (s.payment || 0),
          0
        )

        setStats({ totalSubmissions, pendingSubmissions, totalEarnings })
      }
    } catch (error) {
      console.error("Fetch stats error:", error)
      toast.error("Failed to load dashboard stats")
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    {
      label: "Total Submissions",
      value: loading ? "..." : stats.totalSubmissions.toString(),
      icon: FaClipboardList,
      color: "bg-blue-500",
    },
    {
      label: "Pending Submissions",
      value: loading ? "..." : stats.pendingSubmissions.toString(),
      icon: FaClock,
      color: "bg-yellow-500",
    },
    {
      label: "Total Earnings",
      value: loading ? "..." : `${stats.totalEarnings} coins`,
      icon: FaCoins,
      color: "bg-green-500",
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Worker Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Approved Submissions Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Approved Submissions
          </h2>
          <div className="text-center py-12 text-gray-500">
            <p>No approved submissions yet.</p>
            <p className="text-sm mt-2">Complete tasks to start earning!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
