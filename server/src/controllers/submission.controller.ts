import { NextFunction, Response } from "express"
import { AuthRequest } from "../middleware/auth.middleware"
import Submission from "../models/Submission.model"
import Task from "../models/Task.model"
import User from "../models/User.model"

export const createSubmission = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" })
      return
    }

    const { taskId, submissionDetails, submissionFileURL } = req.body

    if (!taskId || !submissionDetails) {
      res
        .status(400)
        .json({
          success: false,
          message: "Task ID and submission details are required",
        })
      return
    }

    // Get user
    const user = await User.findOne({ firebaseUid: req.user.uid })
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" })
      return
    }

    // Get task
    const task = await Task.findById(taskId)
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" })
      return
    }

    // Check if task is still active
    if (!task.isActive) {
      res
        .status(400)
        .json({ success: false, message: "This task is no longer active" })
      return
    }

    // Check if task has reached submission limit
    if (task.currentSubmissions >= task.taskQuantity) {
      res
        .status(400)
        .json({ success: false, message: "Task submission limit reached" })
      return
    }

    // Check if user already submitted for this task
    const existingSubmission = await Submission.findOne({
      taskId,
      workerId: user._id,
    })
    if (existingSubmission) {
      res
        .status(400)
        .json({
          success: false,
          message: "You have already submitted for this task",
        })
      return
    }

    // Create submission
    const submission = await Submission.create({
      taskId,
      workerId: user._id,
      workerName: user.name,
      workerEmail: user.email,
      submissionDetails,
      submissionFileURL,
      payableAmount: task.payableAmount,
      status: "pending",
    })

    // Increment task submission count
    task.currentSubmissions += 1
    await task.save()

    res.status(201).json({
      success: true,
      message: "Submission created successfully",
      data: { submission },
    })
  } catch (error: any) {
    console.error("Create submission error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create submission",
        error: error.message,
      })
  }
}

export const getMySubmissions = async (
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

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const submissions = await Submission.find({ workerId: user._id })
      .populate("taskId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Submission.countDocuments({ workerId: user._id })

    res.status(200).json({
      success: true,
      data: {
        submissions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error: any) {
    console.error("Get submissions error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch submissions",
        error: error.message,
      })
  }
}

export const getSubmissionsForTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskId } = req.params

    const submissions = await Submission.find({ taskId }).sort({
      createdAt: -1,
    })

    res.status(200).json({
      success: true,
      data: { submissions, count: submissions.length },
    })
  } catch (error: any) {
    console.error("Get task submissions error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch submissions",
        error: error.message,
      })
  }
}

export const reviewSubmission = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { status, reviewNote } = req.body

    if (!status || !["approved", "rejected"].includes(status)) {
      res
        .status(400)
        .json({
          success: false,
          message: "Valid status (approved/rejected) is required",
        })
      return
    }

    const submission = await Submission.findById(id)
    if (!submission) {
      res.status(404).json({ success: false, message: "Submission not found" })
      return
    }

    // Update submission status
    submission.status = status
    submission.reviewNote = reviewNote
    await submission.save()

    // If approved, add coins to worker
    if (status === "approved") {
      const worker = await User.findById(submission.workerId)
      if (worker) {
        worker.coins += submission.payableAmount
        await worker.save()
      }
    }

    res.status(200).json({
      success: true,
      message: `Submission ${status} successfully`,
      data: { submission },
    })
  } catch (error: any) {
    console.error("Review submission error:", error)
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to review submission",
        error: error.message,
      })
  }
}
