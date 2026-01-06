"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import apiClient from "@/lib/axios"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaClock, FaCoins, FaUser } from "react-icons/fa"

interface Task {
  _id: string
  title: string
  description: string
  taskImageURL?: string
  submissionInfo: string
  payableAmount: number
  completionTime: string
  creatorName: string
  creatorEmail: string
  taskQuantity: number
  currentSubmissions: number
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [formData, setFormData] = useState({
    submissionDetails: "",
    submissionFileURL: "",
  })

  useEffect(() => {
    if (params.id) {
      fetchTask()
    }
  }, [params.id])

  const fetchTask = async () => {
    try {
      const response = await apiClient.get(`/tasks/${params.id}`)
      if (response.data.success) {
        setTask(response.data.data.task)
      }
    } catch (error) {
      console.error("Fetch task error:", error)
      toast.error("Failed to load task")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    const formDataImg = new FormData()
    formDataImg.append("image", file)

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        formDataImg
      )

      if (response.data.success) {
        setFormData({ ...formData, submissionFileURL: response.data.data.url })
        toast.success("File uploaded successfully!")
      }
    } catch (error) {
      console.error("Image upload error:", error)
      toast.error("Failed to upload file")
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.submissionDetails.trim()) {
      toast.error("Please provide submission details")
      return
    }

    setSubmitting(true)

    try {
      const response = await apiClient.post("/submissions", {
        taskId: params.id,
        submissionDetails: formData.submissionDetails,
        submissionFileURL: formData.submissionFileURL,
      })

      if (response.data.success) {
        toast.success("Submission created successfully!")
        router.push("/dashboard/worker/submissions")
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to submit task"
      toast.error(message)
    } finally {
      setSubmitting(false)
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

  if (!task) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Task not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {task.taskImageURL && (
            <img
              src={task.taskImageURL}
              alt={task.title}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {task.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-amber-600">
                <FaCoins className="text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Payout</p>
                  <p className="font-semibold">{task.payableAmount} coins</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <FaClock className="text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="font-semibold">
                    {task.taskQuantity - task.currentSubmissions} /{" "}
                    {task.taskQuantity}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <FaUser className="text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Creator</p>
                  <p className="font-semibold">{task.creatorName}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Description
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Submission Requirements
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {task.submissionInfo}
              </p>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Submit Your Work
              </h2>

              {task.currentSubmissions >= task.taskQuantity ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-800 font-medium">
                    This task has reached its submission limit
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submission Details *
                    </label>
                    <textarea
                      value={formData.submissionDetails}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          submissionDetails: e.target.value,
                        })
                      }
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe your work and provide any necessary details..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload File (Optional)
                    </label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {uploadingFile && (
                      <p className="text-sm text-primary-500 mt-1">
                        Uploading...
                      </p>
                    )}
                    {formData.submissionFileURL && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ File uploaded successfully
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || uploadingFile}
                    className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Task"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
