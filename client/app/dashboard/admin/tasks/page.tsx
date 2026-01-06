"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaCoins, FaEye, FaTasks } from "react-icons/fa"

interface Task {
  _id: string
  title: string
  description: string
  coinsRequired: number
  submissionsRequired: number
  completedSubmissions: number
  status: string
  creatorId: {
    name: string
    email: string
  }
  createdAt: string
}

export default function ManageTasksPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  // Role-based access control
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied. Admin only.")
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get("/tasks")
      if (response.data.success) {
        setTasks(response.data.data.tasks || [])
      }
    } catch (error: any) {
      console.error("Fetch tasks error:", error)
      toast.error("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`
      )
    ) {
      try {
        await apiClient.delete(`/admin/tasks/${taskId}`)
        toast.success("Task deleted successfully")
        fetchTasks()
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete task")
      }
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "active") return task.status === "active"
    if (filter === "completed")
      return task.completedSubmissions >= task.submissionsRequired
    return true
  })

  const getStatusBadge = (task: Task) => {
    if (task.completedSubmissions >= task.submissionsRequired) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
          Completed
        </span>
      )
    }
    if (task.status === "active") {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
          Active
        </span>
      )
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
        Inactive
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Tasks</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "active"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Active ({tasks.filter((t) => t.status === "active").length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "completed"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Completed (
              {
                tasks.filter(
                  (t) => t.completedSubmissions >= t.submissionsRequired
                ).length
              }
              )
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center text-gray-500">
            <FaTasks className="text-6xl mx-auto mb-4 text-gray-300" />
            <p>No tasks found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {task.title}
                      </h3>
                      {getStatusBadge(task)}
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaCoins className="text-amber-500" />
                      <span className="font-medium">
                        {task.coinsRequired} coins per submission
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/buyer/my-tasks/${task._id}`}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                    >
                      <FaEye />
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDeleteTask(task._id, task.title)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Budget</p>
                      <p className="font-semibold text-green-600">
                        {task.coinsRequired * task.submissionsRequired || 0}{" "}
                        coins
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold">
                        {task.submissionsRequired}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Payout</p>
                      <p className="font-semibold text-primary-600">
                        {task.coinsRequired} coins
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Progress</p>
                      <p className="font-semibold">
                        {task.completedSubmissions || 0} /{" "}
                        {task.submissionsRequired}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Created</p>
                    <p className="text-xs text-gray-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
