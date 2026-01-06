"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import apiClient from "@/lib/axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaBell, FaCheckCircle, FaClock, FaEnvelope } from "react-icons/fa"

interface Notification {
  _id: string
  type: string
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get("/notifications")
      if (response.data.success) {
        setNotifications(response.data.data.notifications)
        setUnreadCount(response.data.data.unreadCount)
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch notifications"
      )
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await apiClient.patch(`/notifications/${id}/read`)
      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === id ? { ...notif, read: true } : notif
          )
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error: any) {
      toast.error("Failed to mark as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await apiClient.patch("/notifications/read-all")
      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        )
        setUnreadCount(0)
        toast.success("All notifications marked as read")
      }
    } catch (error: any) {
      toast.error("Failed to mark all as read")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return <FaClock className="text-blue-500" />
      case "submission":
        return <FaCheckCircle className="text-green-500" />
      case "withdrawal":
        return <FaEnvelope className="text-purple-500" />
      case "admin":
        return <FaBell className="text-red-500" />
      default:
        return <FaBell className="text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "task":
        return "bg-blue-100 text-blue-800"
      case "submission":
        return "bg-green-100 text-green-800"
      case "withdrawal":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                You have {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center text-gray-500">
            <FaBell className="text-6xl mx-auto mb-4 text-gray-300" />
            <p>No notifications yet.</p>
            <p className="text-sm mt-2">
              We'll notify you when something important happens!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow-md p-4 transition-all ${
                  !notification.read ? "border-l-4 border-primary-600" : ""
                } hover:shadow-lg cursor-pointer`}
                onClick={() =>
                  !notification.read && markAsRead(notification._id)
                }
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className={`font-semibold ${
                          !notification.read ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        {notification.type}
                      </span>
                    </div>
                    <p
                      className={`text-sm mb-2 ${
                        !notification.read ? "text-gray-700" : "text-gray-500"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
