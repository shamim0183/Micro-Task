"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaCheckCircle, FaDollarSign, FaTimesCircle } from "react-icons/fa"

interface Withdrawal {
  _id: string
  workerName: string
  workerEmail: string
  amount: number
  paymentMethod: string
  paymentDetails: string
  status: "pending" | "approved" | "rejected"
  adminNote?: string
  createdAt: string
}

export default function AdminWithdrawalsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [adminNote, setAdminNote] = useState("")

  // Role-based access control
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied. Admin only.")
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const fetchWithdrawals = async () => {
    try {
      const response = await apiClient.get("/withdrawals/all")
      if (response.data.success) {
        setWithdrawals(response.data.data.withdrawals)
      }
    } catch (error) {
      console.error("Fetch withdrawals error:", error)
      toast.error("Failed to load withdrawals")
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    try {
      const response = await apiClient.patch(`/withdrawals/${id}/review`, {
        status,
        adminNote: adminNote || undefined,
      })

      if (response.data.success) {
        toast.success(`Withdrawal ${status} successfully!`)
        setReviewingId(null)
        setAdminNote("")
        fetchWithdrawals()
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to review withdrawal"
      toast.error(message)
    }
  }

  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending")
  const reviewedWithdrawals = withdrawals.filter((w) => w.status !== "pending")

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
          Withdrawal Requests
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Requests</p>
            <p className="text-2xl font-bold text-gray-800">
              {withdrawals.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {pendingWithdrawals.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Reviewed</p>
            <p className="text-2xl font-bold text-green-600">
              {reviewedWithdrawals.length}
            </p>
          </div>
        </div>

        {/* Pending Withdrawals */}
        {pendingWithdrawals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Pending Requests
            </h2>
            <div className="space-y-4">
              {pendingWithdrawals.map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {withdrawal.workerName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {withdrawal.workerEmail}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Requested on{" "}
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                        <FaDollarSign /> {withdrawal.amount} coins
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold text-gray-800 capitalize">
                        {withdrawal.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Details</p>
                      <p className="font-semibold text-gray-800">
                        {withdrawal.paymentDetails}
                      </p>
                    </div>
                  </div>

                  {reviewingId === withdrawal._id ? (
                    <div className="space-y-3">
                      <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Add admin note (optional)..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={2}
                      ></textarea>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleReview(withdrawal._id, "approved")
                          }
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          <FaCheckCircle /> Approve & Process
                        </button>
                        <button
                          onClick={() =>
                            handleReview(withdrawal._id, "rejected")
                          }
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                        >
                          <FaTimesCircle /> Reject & Refund
                        </button>
                        <button
                          onClick={() => {
                            setReviewingId(null)
                            setAdminNote("")
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReviewingId(withdrawal._id)}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                    >
                      Review Request
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviewed Withdrawals */}
        {reviewedWithdrawals.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Reviewed Requests
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Worker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviewedWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal._id}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {withdrawal.workerName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {withdrawal.workerEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-semibold">
                          {withdrawal.amount} coins
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm capitalize">
                        {withdrawal.paymentMethod}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            withdrawal.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {withdrawal.status === "approved" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaTimesCircle />
                          )}
                          {withdrawal.status.charAt(0).toUpperCase() +
                            withdrawal.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {withdrawal.adminNote || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {withdrawals.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600">No withdrawal requests yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
