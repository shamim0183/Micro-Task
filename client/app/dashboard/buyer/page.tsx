"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaClock, FaDollarSign, FaTasks } from "react-icons/fa"

export default function BuyerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    totalPayments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const tasksResponse = await apiClient.get("/tasks/my-tasks")
      const tasks = tasksResponse.data.data.tasks || []

      const totalTasks = tasks.length
      const pendingTasks = tasks.filter(
        (task: any) => task.submissions?.length > 0
      ).length

      // Calculate total payments (coins spent on tasks)
      const totalPayments = tasks.reduce((sum: number, task: any) => {
        return sum + (task.payableAmount || 0) * (task.taskQuantity || 0)
      }, 0)

      setStats({ totalTasks, pendingTasks, totalPayments })
    } catch (error) {
      console.error("Fetch stats error:", error)
      toast.error("Failed to load dashboard stats")
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    {
      label: "Total Tasks",
      value: loading ? "..." : stats.totalTasks.toString(),
      icon: FaTasks,
      color: "bg-purple-500",
    },
    {
      label: "Pending Tasks",
      value: loading ? "..." : stats.pendingTasks.toString(),
      icon: FaClock,
      color: "bg-yellow-500",
    },
    {
      label: "Total Payments",
      value: loading ? "..." : `${stats.totalPayments} coins`,
      icon: FaDollarSign,
      color: "bg-green-500",
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Buyer Dashboard
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

        {/* Tasks to Review */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Tasks to Review
          </h2>
          <div className="text-center py-12 text-gray-500">
            <p>No pending submissions to review.</p>
            <p className="text-sm mt-2">Create tasks to get started!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
