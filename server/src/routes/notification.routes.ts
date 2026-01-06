import { Router } from "express"
import {
  broadcastNotification,
  getUserNotifications,
  markAllAsRead,
  markAsRead,
  sendNotificationToUser,
} from "../controllers/notification.controller"
import { verifyToken } from "../middleware/auth.middleware"
import { isAdmin } from "../middleware/roleCheck.middleware"

const router = Router()

// User routes
router.get("/", verifyToken, getUserNotifications)
router.patch("/:id/read", verifyToken, markAsRead)
router.patch("/read-all", verifyToken, markAllAsRead)

// Admin routes
router.post("/send", verifyToken, isAdmin, sendNotificationToUser)
router.post("/broadcast", verifyToken, isAdmin, broadcastNotification)

export default router
