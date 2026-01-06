"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FaCheckCircle, FaCoins, FaSpinner } from "react-icons/fa"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  )
  const [coinsAdded, setCoinsAdded] = useState(0)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (sessionId) {
      verifyPayment(sessionId)
    } else {
      setStatus("error")
    }
  }, [searchParams])

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await apiClient.post("/payments/success", { sessionId })

      if (response.data.success) {
        setCoinsAdded(response.data.data.coins)
        setStatus("success")
        // Refresh user data to update coin balance
        await refreshUser()
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      setStatus("error")
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {status === "loading" && (
          <div className="text-center py-20">
            <FaSpinner className="text-6xl text-primary-600 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verifying Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-6xl text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Payment Successful!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your coins have been added to your account
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-8 mb-8 border-2 border-amber-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <FaCoins className="text-4xl text-amber-600" />
                <span className="text-5xl font-bold text-gray-800">
                  +{coinsAdded}
                </span>
                <span className="text-2xl text-gray-600">coins</span>
              </div>
              <p className="text-gray-700 font-medium">Added to your balance</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard/buyer"
                className="px-8 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/dashboard/buyer/create-task"
                className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-all"
              >
                Create Task
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">❌</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Payment Verification Failed
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We couldn't verify your payment. Please contact support if you
              were charged.
            </p>
            <Link
              href="/dashboard/buyer/purchase-coin"
              className="inline-block px-8 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Try Again
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
