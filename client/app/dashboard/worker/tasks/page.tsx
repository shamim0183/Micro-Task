"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import apiClient from "@/lib/axios"
import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaCoins, FaSearch } from "react-icons/fa"

interface Task {
  _id: string
  title: string
  description: string
  taskImageURL?: string
  payableAmount: number
  completionTime: string
  creatorName: string
  taskQuantity: number
  currentSubmissions: number
}

export default function WorkerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get("/tasks")
      if (response.data.success) {
        setTasks(response.data.data.tasks)
      }
    } catch (error) {
      console.error("Fetch tasks error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const availableTasks = filteredTasks.filter(
    (task) => task.currentSubmissions < task.taskQuantity
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Available Tasks
        </h1>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Available Tasks</p>
            <p className="text-2xl font-bold text-green-600">
              {availableTasks.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Earnings Potential</p>
            <p className="text-2xl font-bold text-amber-600">
              {availableTasks.reduce(
                (sum, task) => sum + task.payableAmount,
                0
              )}{" "}
              coins
            </p>
          </div>
        </div>

        {/* Tasks Grid */}
        {availableTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600">No available tasks found.</p>
            <p className="text-sm text-gray-500 mt-2">
              Check back later for new opportunities!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {task.taskImageURL && (
                  <img
                    src={task.taskImageURL}
                    alt={task.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {task.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Payout:</span>
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <FaCoins /> {task.payableAmount} coins
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available:</span>
                      <span className="text-green-600 font-semibold">
                        {task.taskQuantity - task.currentSubmissions} /{" "}
                        {task.taskQuantity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Creator:</span>
                      <span className="text-gray-800">{task.creatorName}</span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/worker/tasks/${task._id}`}
                    className="block w-full text-center px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
