"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import apiClient from "@/lib/axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaCheckCircle, FaCoins, FaEye, FaTimesCircle } from "react-icons/fa"

interface Submission {
  _id: string
  workerName: string
  workerEmail: string
  submissionDetails: string
  submissionFileURL?: string
  status: "pending" | "approved" | "rejected"
  reviewNote?: string
  payableAmount: number
  createdAt: string
}

export default function TaskSubmissionsPage() {
  const params = useParams()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [reviewNote, setReviewNote] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchSubmissions()
    }
  }, [params.id])

  const fetchSubmissions = async () => {
    try {
      const response = await apiClient.get(`/submissions/task/${params.id}`)
      if (response.data.success) {
        setSubmissions(response.data.data.submissions)
      }
    } catch (error) {
      console.error("Fetch submissions error:", error)
      toast.error("Failed to load submissions")
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (
    submissionId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const response = await apiClient.patch(
        `/submissions/${submissionId}/review`,
        {
          status,
          reviewNote: reviewNote || undefined,
        }
      )

      if (response.data.success) {
        toast.success(`Submission ${status} successfully!`)
        setReviewingId(null)
        setReviewNote("")
        fetchSubmissions()
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to review submission"
      toast.error(message)
    }
  }

  const pendingSubmissions = submissions.filter((s) => s.status === "pending")
  const reviewedSubmissions = submissions.filter((s) => s.status !== "pending")

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
          Task Submissions
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Submissions</p>
            <p className="text-2xl font-bold text-gray-800">
              {submissions.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">
              {pendingSubmissions.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Reviewed</p>
            <p className="text-2xl font-bold text-green-600">
              {reviewedSubmissions.length}
            </p>
          </div>
        </div>

        {/* Pending Submissions */}
        {pendingSubmissions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Pending Review
            </h2>
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <div
                  key={submission._id}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {submission.workerName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {submission.workerEmail}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted on{" "}
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-600 font-semibold">
                      <FaCoins /> {submission.payableAmount} coins
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Submission Details:
                    </h4>
                    <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                      {submission.submissionDetails}
                    </p>
                  </div>

                  {submission.submissionFileURL && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Submitted File:
                      </h4>
                      <a
                        href={submission.submissionFileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
                      >
                        <FaEye /> View File
                      </a>
                    </div>
                  )}

                  {reviewingId === submission._id ? (
                    <div className="space-y-3">
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder="Add review note (optional)..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                      ></textarea>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleReview(submission._id, "approved")
                          }
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          <FaCheckCircle /> Approve
                        </button>
                        <button
                          onClick={() =>
                            handleReview(submission._id, "rejected")
                          }
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                        >
                          <FaTimesCircle /> Reject
                        </button>
                        <button
                          onClick={() => {
                            setReviewingId(null)
                            setReviewNote("")
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReviewingId(submission._id)}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                    >
                      Review Submission
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviewed Submissions */}
        {reviewedSubmissions.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Reviewed Submissions
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Worker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Payout
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Review Note
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviewedSubmissions.map((submission) => (
                    <tr key={submission._id}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {submission.workerName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            submission.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {submission.status === "approved" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaTimesCircle />
                          )}
                          {submission.status.charAt(0).toUpperCase() +
                            submission.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <FaCoins /> {submission.payableAmount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {submission.reviewNote || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {submissions.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600">No submissions yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Check back later for worker submissions!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
