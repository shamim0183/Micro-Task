"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export default function AddTaskPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskImageURL: "",
    submissionInfo: "",
    payableAmount: 1,
    completionTime: "",
    taskQuantity: 1,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const formDataImg = new FormData()
    formDataImg.append("image", file)

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        formDataImg
      )

      if (response.data.success) {
        setFormData({ ...formData, taskImageURL: response.data.data.url })
        toast.success("Image uploaded successfully!")
      }
    } catch (error) {
      console.error("Image upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const totalCost = formData.payableAmount * formData.taskQuantity
    if (user && user.coins < totalCost) {
      toast.error(
        `Insufficient coins. Need ${totalCost} coins, but you have ${user.coins} coins.`
      )
      return
    }

    setLoading(true)

    try {
      const response = await apiClient.post("/tasks", formData)
      if (response.data.success) {
        toast.success("Task created successfully!")
        router.push("/dashboard/buyer/my-tasks")
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create task"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const totalCost = formData.payableAmount * formData.taskQuantity

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create New Task
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Like and share my Facebook post"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe the task in detail..."
              ></textarea>
            </div>

            {/* Task Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {uploadingImage && (
                <p className="text-sm text-primary-500 mt-1">Uploading...</p>
              )}
              {formData.taskImageURL && (
                <div className="mt-2">
                  <img
                    src={formData.taskImageURL}
                    alt="Task preview"
                    className="h-32 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Submission Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Requirements *
              </label>
              <textarea
                name="submissionInfo"
                value={formData.submissionInfo}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="What do workers need to submit? (e.g., Screenshot of like, share link, etc.)"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Payable Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout per Task *
                </label>
                <input
                  type="number"
                  name="payableAmount"
                  value={formData.payableAmount}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Task Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Needed *
                </label>
                <input
                  type="number"
                  name="taskQuantity"
                  value={formData.taskQuantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Completion Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline *
                </label>
                <input
                  type="datetime-local"
                  name="completionTime"
                  value={formData.completionTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Total Cost</p>
                  <p className="text-xs text-gray-600">
                    {formData.payableAmount} coins × {formData.taskQuantity}{" "}
                    tasks
                  </p>
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  {totalCost} coins
                </p>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Your current balance: {user?.coins || 0} coins
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading || uploadingImage || !!(user && user.coins < totalCost)
              }
              className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating Task..."
                : `Create Task (${totalCost} coins)`}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
