"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import {
  FaCheckCircle,
  FaDollarSign,
  FaMobileAlt,
  FaUniversity,
} from "react-icons/fa"

export default function WorkerWithdrawalsPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "bkash",
    paymentDetails: "",
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [withdrawalData, setWithdrawalData] = useState<{
    amount: number
    oldBalance: number
    newBalance: number
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.paymentDetails) {
      toast.error("Please fill in all fields")
      return
    }

    const amount = parseInt(formData.amount)
    if (amount < 1) {
      toast.error("Minimum withdrawal is 1 coin")
      return
    }

    if (user && user.coins < amount) {
      toast.error(`Insufficient coins. You have ${user.coins} coins.`)
      return
    }

    setLoading(true)

    try {
      const response = await apiClient.post("/withdrawals", {
        amount,
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentDetails,
      })

      if (response.data.success) {
        const withdrawalAmount = parseInt(formData.amount)
        const oldBalance = user?.coins || 0

        // Store withdrawal data for modal
        setWithdrawalData({
          amount: withdrawalAmount,
          oldBalance,
          newBalance: oldBalance - withdrawalAmount,
        })

        toast.success("Withdrawal request created successfully!")
        setFormData({ amount: "", paymentMethod: "bkash", paymentDetails: "" })

        // Show success modal
        setShowSuccessModal(true)

        // Refresh user data to update coin balance immediately
        await refreshUser()
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create withdrawal request"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Request Withdrawal
        </h1>

        {/* Current Balance */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-2">Available Balance</p>
              <p className="text-4xl font-bold">{user?.coins || 0} Coins</p>
            </div>
            <FaDollarSign className="text-6xl text-green-200 opacity-50" />
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount (Coins) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                min="1"
                max={user?.coins || 0}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter amount"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum: 1 coin | Maximum: {user?.coins || 0} coins
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "bkash", label: "bKash", icon: FaMobileAlt },
                  { value: "nagad", label: "Nagad", icon: FaMobileAlt },
                  { value: "rocket", label: "Rocket", icon: FaMobileAlt },
                  { value: "bank", label: "Bank", icon: FaUniversity },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: method.value })
                    }
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                      formData.paymentMethod === method.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <method.icon className="text-2xl" />
                    <span className="font-medium text-sm">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.paymentMethod === "bank"
                  ? "Account Number"
                  : "Mobile Number"}{" "}
                *
              </label>
              <input
                type="text"
                value={formData.paymentDetails}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDetails: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={
                  formData.paymentMethod === "bank"
                    ? "Enter your bank account number"
                    : "Enter your mobile number (e.g., 01XXXXXXXXX)"
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !user || user.coins < 1}
              className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Submit Withdrawal Request"}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Withdrawal requests are processed within
              24-48 hours. Coins will be deducted immediately and refunded if
              the request is rejected.
            </p>
          </div>
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && withdrawalData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                >
                  <FaCheckCircle className="text-5xl text-green-600" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-800 mb-2"
                >
                  Withdrawal Requested!
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 mb-6"
                >
                  Your withdrawal request has been submitted successfully.
                </motion.p>

                {/* Withdrawal Details */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Withdrawn Amount:</span>
                    <span className="font-bold text-red-600 text-lg">
                      -{withdrawalData.amount} coins
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-gray-600">New Balance:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {withdrawalData.newBalance} coins
                    </span>
                  </div>
                </motion.div>

                {/* Info */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-gray-500 mb-6"
                >
                  Processing time: 24-48 hours. You'll be notified once
                  approved.
                </motion.p>

                {/* Close Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Got it!
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
