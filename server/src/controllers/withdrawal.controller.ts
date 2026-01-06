import { NextFunction, Response } from "express"
import { AuthRequest } from "../middleware/auth.middleware"
import User from "../models/User.model"
import Withdrawal from "../models/Withdrawal.model"

export const createWithdrawal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" })
      return
    }

    const { amount, paymentMethod, paymentDetails } = req.body

    if (!amount || !paymentMethod || !paymentDetails) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" })
      return
    }

    const user = await User.findOne({ firebaseUid: req.user.uid })
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" })
      return
    }

    // Check if user has enough coins
    if (user.coins < amount) {
      res.status(400).json({
        success: false,
        message: `Insufficient coins. You have ${user.coins} coins but requested ${amount} coins.`,
      })
      return
    }

    // Deduct coins immediately
    user.coins -= amount
    await user.save()

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      workerId: user._id,
      workerName: user.name,
      workerEmail: user.email,
      amount,
      paymentMethod,
      paymentDetails,
      status: "pending",
    })

    res.status(201).json({
      success: true,
      message: "Withdrawal request created successfully",
      data: { withdrawal },
    })
  } catch (error: any) {
    console.error("Create withdrawal error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create withdrawal",
        error: error.message,
      })
  }
}

export const getMyWithdrawals = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" })
      return
    }

    const user = await User.findOne({ firebaseUid: req.user.uid })
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" })
      return
    }

    const withdrawals = await Withdrawal.find({ workerId: user._id }).sort({
      createdAt: -1,
    })

    res.status(200).json({
      success: true,
      data: { withdrawals, count: withdrawals.length },
    })
  } catch (error: any) {
    console.error("Get withdrawals error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch withdrawals",
        error: error.message,
      })
  }
}

export const getAllWithdrawals = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: { withdrawals, count: withdrawals.length },
    })
  } catch (error: any) {
    console.error("Get all withdrawals error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch withdrawals",
        error: error.message,
      })
  }
}

export const reviewWithdrawal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { status, adminNote } = req.body

    if (!status || !["approved", "rejected"].includes(status)) {
      res
        .status(400)
        .json({
          success: false,
          message: "Valid status (approved/rejected) is required",
        })
      return
    }

    const withdrawal = await Withdrawal.findById(id)
    if (!withdrawal) {
      res.status(404).json({ success: false, message: "Withdrawal not found" })
      return
    }

    if (withdrawal.status !== "pending") {
      res
        .status(400)
        .json({ success: false, message: "Withdrawal already reviewed" })
      return
    }

    // If rejected, refund coins to worker
    if (status === "rejected") {
      const worker = await User.findById(withdrawal.workerId)
      if (worker) {
        worker.coins += withdrawal.amount
        await worker.save()
      }
    }

    withdrawal.status = status
    withdrawal.adminNote = adminNote
    await withdrawal.save()

    res.status(200).json({
      success: true,
      message: `Withdrawal ${status} successfully`,
      data: { withdrawal },
    })
  } catch (error: any) {
    console.error("Review withdrawal error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to review withdrawal",
        error: error.message,
      })
  }
}
