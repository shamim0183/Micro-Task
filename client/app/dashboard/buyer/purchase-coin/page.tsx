"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"
import { loadStripe } from "@stripe/stripe-js"
import { useState } from "react"
import toast from "react-hot-toast"
import { FaCoins, FaCreditCard, FaInfoCircle } from "react-icons/fa"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
)

export default function PurchaseCoinPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const packages = [
    { id: "pkg_1", coins: 10, price: 1, popular: false },
    { id: "pkg_2", coins: 150, price: 10, popular: true },
    { id: "pkg_3", coins: 500, price: 20, popular: false },
    { id: "pkg_4", coins: 1000, price: 35, popular: false },
  ]

  const handlePurchase = async (
    packageId: string,
    coins: number,
    price: number
  ) => {
    setLoading(packageId)
    try {
      const response = await apiClient.post("/payments/create-payment-intent", {
        coins,
        amount: price * 100, // Convert to cents
      })

      if (response.data.success) {
        const stripe = await stripePromise
        if (!stripe) {
          toast.error("Payment system unavailable")
          return
        }

        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.data.sessionId,
        })

        if (error) {
          toast.error(error.message || "Payment failed")
        }
      }
    } catch (error: any) {
      console.error("Purchase error:", error)
      toast.error(error.response?.data?.message || "Failed to process purchase")
    } finally {
      setLoading(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Purchase Coins
        </h1>

        {/* Current Balance */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 mb-2">Your Current Balance</p>
              <p className="text-4xl font-bold flex items-center gap-2">
                <FaCoins /> {user?.coins || 0} Coins
              </p>
            </div>
            <FaCreditCard className="text-6xl text-amber-200 opacity-50" />
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <FaInfoCircle className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900 font-medium">How it works</p>
            <p className="text-blue-700 text-sm mt-1">
              Purchase coins to create tasks and pay workers. Coins are used to
              set payouts for each task submission. Unused coins can be refunded
              when you delete tasks.
            </p>
          </div>
        </div>

        {/* Coin Packages */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Choose a Package
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                pkg.popular ? "ring-2 ring-primary-500" : ""
              }`}
            >
              {pkg.popular && (
                <div className="bg-gradient-primary text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <FaCoins className="text-5xl text-amber-500" />
                </div>
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-2">
                  {pkg.coins} Coins
                </h3>
                <p className="text-4xl font-bold text-center text-primary-600 mb-6">
                  ${pkg.price}
                </p>
                <p className="text-center text-sm text-gray-600 mb-4">
                  ${(pkg.price / pkg.coins).toFixed(2)} per coin
                </p>
                <button
                  onClick={() => handlePurchase(pkg.id, pkg.coins, pkg.price)}
                  disabled={loading === pkg.id}
                  className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === pkg.id ? "Processing..." : "Purchase Now"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Secure Payment Methods
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800">Visa</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800">Mastercard</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800">American Express</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800">Stripe</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-6">
            🔒 All transactions are secured with 256-bit SSL encryption via
            Stripe
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
