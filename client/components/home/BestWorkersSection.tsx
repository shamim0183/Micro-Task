"use client"

import apiClient from "@/lib/axios"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { FaCoins, FaMedal } from "react-icons/fa"

interface TopWorker {
  _id: string
  name: string
  photoURL: string
  coins: number
  email: string
}

export default function BestWorkersSection() {
  const [workers, setWorkers] = useState<TopWorker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopWorkers()
  }, [])

  const fetchTopWorkers = async () => {
    try {
      const response = await apiClient.get("/admin/users")
      if (response.data.success) {
        const allUsers = response.data.data.users || []
        // Filter workers and sort by coins (descending)
        const topWorkers = allUsers
          .filter((user: any) => user.role === "worker")
          .sort((a: any, b: any) => b.coins - a.coins)
          .slice(0, 6)
        setWorkers(topWorkers)
      }
    } catch (error) {
      console.error("Failed to fetch top workers:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMedalColor = (index: number) => {
    if (index === 0) return "text-yellow-500" // Gold
    if (index === 1) return "text-gray-400" // Silver
    if (index === 2) return "text-amber-600" // Bronze
    return "text-blue-600"
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            🌟 Top Workers of the Month
          </h2>
          <p className="text-xl text-gray-600">
            Meet our highest earning workers who completed the most tasks
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workers.map((worker, index) => (
              <motion.div
                key={worker._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="relative">
                  {index < 3 && (
                    <FaMedal
                      className={`absolute -top-2 -right-2 text-3xl ${getMedalColor(
                        index
                      )}`}
                    />
                  )}
                  <img
                    src={worker.photoURL || "/default-avatar.png"}
                    alt={worker.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-500"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                  {worker.name}
                </h3>
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-lg">
                  <FaCoins className="text-amber-600 text-xl" />
                  <span className="font-bold text-gray-800">
                    {worker.coins.toLocaleString()} Coins
                  </span>
                </div>
                {index < 3 && (
                  <div className="text-center mt-3">
                    <span className="inline-block px-3 py-1 bg-gradient-primary text-white text-sm font-semibold rounded-full">
                      #{index + 1} Top Worker
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
