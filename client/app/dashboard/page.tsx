"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Auto-redirect to role-specific dashboard
  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case "worker":
          router.replace("/dashboard/worker")
          break
        case "buyer":
          router.replace("/dashboard/buyer")
          break
        case "admin":
          router.replace("/dashboard/admin")
          break
        default:
          router.replace("/")
      }
    }
  }, [user, loading, router])

  // Show loading while redirecting
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    </DashboardLayout>
  )
}
