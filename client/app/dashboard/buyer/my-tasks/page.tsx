"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import apiClient from "@/lib/axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaCoins, FaEye, FaTrash } from "react-icons/fa"

interface Task {
  _id: string
  title: string
  description: string
  taskImageURL?: string
  payableAmount: number
  taskQuantity: number
  currentSubmissions: number
  isActive: boolean
  createdAt: string
}

export default function BuyerMyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyTasks()
  }, [])

  const fetchMyTasks = async () => {
    try {
      const response = await apiClient.get("/tasks/buyer/my-tasks")
      if (response.data.success) {
        setTasks(response.data.data.tasks)
      }
    } catch (error) {
      console.error("Fetch tasks error:", error)
      toast.error("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (taskId: string) => {
    // Show deletion confirmation toast
    const confirmed = await new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-semibold text-gray-800">Delete Task?</p>
              <p className="text-sm text-gray-600 mt-1">
                Are you sure? Remaining coins will be refunded.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id)
                  resolve(true)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id)
                  resolve(false)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          position: "top-center",
        }
      )
    })

    if (!confirmed) return

    try {
      const response = await apiClient.delete(`/tasks/${taskId}`)
      if (response.data.success) {
        toast.success(response.data.message)
        fetchMyTasks()
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete task"
      toast.error(message)
    }
  }

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <Link
            href="/dashboard/buyer/add-task"
            className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            + Create New Task
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Active Tasks</p>
            <p className="text-2xl font-bold text-green-600">
              {tasks.filter((t) => t.isActive).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Submissions</p>
            <p className="text-2xl font-bold text-purple-600">
              {tasks.reduce((sum, t) => sum + t.currentSubmissions, 0)}
            </p>
          </div>
        </div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600">No tasks created yet.</p>
            <Link
              href="/dashboard/buyer/add-task"
              className="inline-block mt-4 px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90"
            >
              Create Your First Task
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {task.title}
                      </h3>
                      {task.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Payout</p>
                        <p className="font-semibold text-amber-600 flex items-center gap-1">
                          <FaCoins /> {task.payableAmount} coins
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Quantity</p>
                        <p className="font-semibold text-gray-800">
                          {task.taskQuantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Submissions</p>
                        <p className="font-semibold text-purple-600">
                          {task.currentSubmissions} / {task.taskQuantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Created</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Link
                      href={`/dashboard/buyer/my-tasks/${task._id}`}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                    >
                      <FaEye /> View
                    </Link>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                    >
                      <FaTrash /> Delete
                    </button>
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
