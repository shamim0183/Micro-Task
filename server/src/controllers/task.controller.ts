import { NextFunction, Response } from "express"
import { AuthRequest } from "../middleware/auth.middleware"
import Task from "../models/Task.model"
import User from "../models/User.model"

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" })
      return
    }

    const {
      title,
      description,
      taskImageURL,
      submissionInfo,
      payableAmount,
      completionTime,
      taskQuantity,
    } = req.body

    // Validation
    if (
      !title ||
      !description ||
      !submissionInfo ||
      !payableAmount ||
      !completionTime ||
      !taskQuantity
    ) {
      res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be provided",
        })
      return
    }

    // Get user details
    const user = await User.findOne({ firebaseUid: req.user.uid })
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" })
      return
    }

    // Check if user has enough coins
    const totalCost = payableAmount * taskQuantity
    if (user.coins < totalCost) {
      res.status(400).json({
        success: false,
        message: `Insufficient coins. Need ${totalCost} coins, but you have ${user.coins} coins.`,
      })
      return
    }

    // Deduct coins from user
    user.coins -= totalCost
    await user.save()

    // Create task
    const task = await Task.create({
      title,
      description,
      taskImageURL,
      submissionInfo,
      payableAmount,
      completionTime: new Date(completionTime),
      taskQuantity,
      creatorId: user._id,
      creatorName: user.name,
      creatorEmail: user.email,
      currentSubmissions: 0,
      isActive: true,
    })

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task },
    })
  } catch (error: any) {
    console.error("Create task error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create task",
        error: error.message,
      })
  }
}

export const getAllTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tasks = await Task.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(100)

    res.status(200).json({
      success: true,
      data: { tasks, count: tasks.length },
    })
  } catch (error: any) {
    console.error("Get tasks error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch tasks",
        error: error.message,
      })
  }
}

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const task = await Task.findById(id)
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" })
      return
    }

    res.status(200).json({
      success: true,
      data: { task },
    })
  } catch (error: any) {
    console.error("Get task error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch task",
        error: error.message,
      })
  }
}

export const getMyTasks = async (
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

    const tasks = await Task.find({ creatorId: user._id }).sort({
      createdAt: -1,
    })

    res.status(200).json({
      success: true,
      data: { tasks, count: tasks.length },
    })
  } catch (error: any) {
    console.error("Get my tasks error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch tasks",
        error: error.message,
      })
  }
}

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { title, description, taskImageURL, submissionInfo, completionTime } =
      req.body

    const task = await Task.findById(id)
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" })
      return
    }

    // Update allowed fields
    if (title) task.title = title
    if (description) task.description = description
    if (taskImageURL !== undefined) task.taskImageURL = taskImageURL
    if (submissionInfo) task.submissionInfo = submissionInfo
    if (completionTime) task.completionTime = new Date(completionTime)

    await task.save()

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: { task },
    })
  } catch (error: any) {
    console.error("Update task error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update task",
        error: error.message,
      })
  }
}

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" })
      return
    }

    const { id } = req.params

    const task = await Task.findById(id)
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" })
      return
    }

    const user = await User.findOne({ firebaseUid: req.user.uid })
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" })
      return
    }

    // Refund coins for incomplete tasks
    const remainingQuantity = task.taskQuantity - task.currentSubmissions
    const refundAmount = remainingQuantity * task.payableAmount

    user.coins += refundAmount
    await user.save()

    await Task.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: `Task deleted successfully. ${refundAmount} coins refunded.`,
      data: { refundedCoins: refundAmount },
    })
  } catch (error: any) {
    console.error("Delete task error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete task",
        error: error.message,
      })
  }
}
