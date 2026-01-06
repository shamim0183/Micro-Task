import { NextFunction, Response } from "express"
import { AuthRequest } from "../middleware/auth.middleware"
import Payment from "../models/Payment.model"
import Submission from "../models/Submission.model"
import Task from "../models/Task.model"
import User from "../models/User.model"
import Withdrawal from "../models/Withdrawal.model"
import { createNotification } from "./notification.controller"

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find()
      .select("-firebaseUid")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: { users, count: users.length },
    })
  } catch (error: any) {
    console.error("Get users error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    })
  }
}

export const getAdminStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments()
    const totalWorkers = await User.countDocuments({ role: "worker" })
    const totalBuyers = await User.countDocuments({ role: "buyer" })
    const totalTasks = await Task.countDocuments()
    const totalSubmissions = await Submission.countDocuments()
    const pendingWithdrawals = await Withdrawal.countDocuments({
      status: "pending",
    })

    const allUsers = await User.find()
    const totalCoins = allUsers.reduce((sum, user) => sum + user.coins, 0)

    // Calculate total revenue from payments
    const payments = await Payment.find({ status: "completed" })
    const totalRevenue = payments.reduce(
      (sum: number, payment: any) => sum + payment.amount,
      0
    )

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          workers: totalWorkers,
          buyers: totalBuyers,
        },
        tasks: totalTasks,
        submissions: totalSubmissions,
        coins: totalCoins,
        payments: totalPayments,
        pendingWithdrawals,
      },
    })
  } catch (error: any) {
    console.error("Get stats error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message,
    })
  }
}

// Update user coins
export const updateUserCoins = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { amount, operation } = req.body

    if (!amount || !operation) {
      res.status(400).json({
        success: false,
        message: "Amount and operation are required",
      })
      return
    }

    const user = await User.findById(id)
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      })
      return
    }

    if (operation === "add") {
      user.coins += amount
    } else if (operation === "deduct") {
      user.coins = Math.max(0, user.coins - amount)
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid operation. Use 'add' or 'deduct'",
      })
      return
    }

    await user.save()

    // Send notification
    await createNotification(
      user._id.toString(),
      "admin",
      "Coin Balance Updated",
      `Your coin balance has been ${
        operation === "add" ? "increased" : "decreased"
      } by ${amount} coins. New balance: ${user.coins} coins.`
    )

    res.status(200).json({
      success: true,
      message: "User coins updated successfully",
      data: { user },
    })
  } catch (error: any) {
    console.error("Update coins error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update coins",
      error: error.message,
    })
  }
}

// Update user role
export const updateUserRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!role || !["worker", "buyer", "admin"].includes(role)) {
      res.status(400).json({
        success: false,
        message: "Invalid role. Must be worker, buyer, or admin",
      })
      return
    }

    const user = await User.findById(id)
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      })
      return
    }

    const oldRole = user.role
    user.role = role
    await user.save()

    // Send notification
    await createNotification(
      user._id.toString(),
      "admin",
      "Role Updated",
      `Your account role has been changed from ${oldRole} to ${role}.`
    )

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: { user },
    })
  } catch (error: any) {
    console.error("Update role error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update role",
      error: error.message,
    })
  }
}

// Delete user
export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      })
      return
    }

    // Prevent deleting admins
    if (user.role === "admin") {
      res.status(403).json({
        success: false,
        message: "Cannot delete admin users",
      })
      return
    }

    await User.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete user error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    })
  }
}

// Delete task
export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const task = await Task.findById(id).populate("creatorId")
    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      })
      return
    }

    await Task.findByIdAndDelete(id)

    // Notify task creator
    if (task.creatorId) {
      await createNotification(
        (task.creatorId as any)._id.toString(),
        "admin",
        "Task Deleted",
        `Your task "${task.title}" has been deleted by an administrator.`
      )
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete task error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    })
  }
}

// Update task status
export const updateTaskStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status || !["active", "inactive"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status. Must be active or inactive",
      })
      return
    }

    const task = await Task.findById(id)
    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      })
      return
    }

    task.status = status
    await task.save()

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: { task },
    })
  } catch (error: any) {
    console.error("Update task status error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update task status",
      error: error.message,
    })
  }
}
