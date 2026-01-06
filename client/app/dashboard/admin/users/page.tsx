"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaEnvelope, FaUser, FaUserCircle } from "react-icons/fa"

interface User {
  _id: string
  name: string
  email: string
  role: string
  coins: number
  photoURL?: string
  createdAt: string
}

export default function ManageUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "worker" | "buyer" | "admin">(
    "all"
  )

  // Role-based access control
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied. Admin only.")
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get("/admin/users")
      if (response.data.success) {
        setUsers(response.data.data.users)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveUser = async (userId: string, userName: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${userName}? This action cannot be undone.`
      )
    ) {
      try {
        await apiClient.delete(`/admin/users/${userId}`)
        toast.success(`${userName} has been removed successfully`)
        fetchUsers()
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to remove user")
      }
    }
  }

  const handleRoleUpdate = async (
    userId: string,
    newRole: string,
    userName: string
  ) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole })
      toast.success(`${userName}'s role updated to ${newRole}`)
      fetchUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update role")
    }
  }

  const handleCoinUpdate = async (
    userId: string,
    coins: number,
    userName: string
  ) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/coins`, { coins })
      toast.success(`Updated ${userName}'s coins to ${coins}`)
      fetchUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update coins")
    }
  }

  const filteredUsers = users.filter((user) =>
    filter === "all" ? true : user.role === filter
  )

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "buyer":
        return "bg-purple-100 text-purple-800"
      case "worker":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setFilter("worker")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "worker"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Workers ({users.filter((u) => u.role === "worker").length})
            </button>
            <button
              onClick={() => setFilter("buyer")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "buyer"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Buyers ({users.filter((u) => u.role === "buyer").length})
            </button>
            <button
              onClick={() => setFilter("admin")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "admin"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Admins ({users.filter((u) => u.role === "admin").length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center text-gray-500">
            <FaUserCircle className="text-6xl mx-auto mb-4 text-gray-300" />
            <p>No users found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coins
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.name}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <FaUser className="text-primary-600" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaEnvelope className="mr-2" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={user.coins}
                            onBlur={(e) => {
                              const newCoins = parseInt(e.target.value)
                              if (newCoins !== user.coins && !isNaN(newCoins)) {
                                handleCoinUpdate(user._id, newCoins, user.name)
                              }
                            }}
                            className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <span className="text-gray-600">coins</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleUpdate(
                                user._id,
                                e.target.value,
                                user.name
                              )
                            }
                            disabled={user.role === "admin"}
                            className={`px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              user.role === "admin"
                                ? "bg-gray-100 cursor-not-allowed"
                                : ""
                            }`}
                            title={
                              user.role === "admin"
                                ? "Admin roles cannot be changed"
                                : "Change user role"
                            }
                          >
                            <option value="worker">Worker</option>
                            <option value="buyer">Buyer</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() =>
                              handleRemoveUser(user._id, user.name)
                            }
                            disabled={user.role === "admin"}
                            className={`px-3 py-1 rounded-md transition-colors text-sm ${
                              user.role === "admin"
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                            title={
                              user.role === "admin"
                                ? "Cannot remove admin users"
                                : "Remove user"
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
