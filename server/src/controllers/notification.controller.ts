import { Response } from "express"
import { AuthRequest } from "../middleware/auth.middleware"
import Notification from "../models/Notification.model"
import User from "../models/User.model"

// Get user's notifications
export const getUserNotifications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      })
      return
    }

    const user = await User.findOne({ firebaseUid: req.user.uid })
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      })
      return
    }

    const notifications = await Notification.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50)

    const unreadCount = await Notification.countDocuments({
      userId: user._id,
      read: false,
    })

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    })
  } catch (error: any) {
    console.error("Get notifications error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    })
  }
}

// Mark notification as read
export const markAsRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      })
      return
    }

    const { id } = req.params

    const notification = await Notification.findById(id)
    if (!notification) {
      res.status(404).json({
        success: false,
        message: "Notification not found",
      })
      return
    }

    notification.read = true
    await notification.save()

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: { notification },
    })
  } catch (error: any) {
    console.error("Mark as read error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    })
  }
}

// Mark all notifications as read
export const markAllAsRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      })
      return
    }

    const user = await User.findOne({ firebaseUid: req.user.uid })
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      })
      return
    }

    await Notification.updateMany(
      { userId: user._id, read: false },
      { read: true }
    )

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    })
  } catch (error: any) {
    console.error("Mark all as read error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    })
  }
}

// Create notification (helper function)
export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string
): Promise<void> => {
  try {
    await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      read: false,
    })
  } catch (error) {
    console.error("Create notification error:", error)
  }
}

// Admin: Broadcast notification to all users
export const broadcastNotification = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, message, type, link } = req.body

    if (!title || !message) {
      res.status(400).json({
        success: false,
        message: "Title and message are required",
      })
      return
    }

    // Get all users
    const users = await User.find({})

    // Create notification for each user
    const notificationPromises = users.map((user) =>
      Notification.create({
        userId: user._id,
        type: type || "system",
        title,
        message,
        link,
        read: false,
      })
    )

    await Promise.all(notificationPromises)

    res.status(200).json({
      success: true,
      message: `Broadcast sent to ${users.length} users`,
    })
  } catch (error: any) {
    console.error("Broadcast notification error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to broadcast notification",
      error: error.message,
    })
  }
}

// Admin: Send notification to specific user
export const sendNotificationToUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId, title, message, type, link } = req.body

    if (!userId || !title || !message) {
      res.status(400).json({
        success: false,
        message: "UserId, title, and message are required",
      })
      return
    }

    const notification = await Notification.create({
      userId,
      type: type || "admin",
      title,
      message,
      link,
      read: false,
    })

    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: { notification },
    })
  } catch (error: any) {
    console.error("Send notification error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
    })
  }
}
