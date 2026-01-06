import { Router } from "express"
import {
  deleteTask,
  deleteUser,
  getAdminStats,
  getAllUsers,
  updateTaskStatus,
  updateUserCoins,
  updateUserRole,
} from "../controllers/admin.controller"
import { verifyToken } from "../middleware/auth.middleware"
import { isAdmin } from "../middleware/roleCheck.middleware"

const router = Router()

router.get("/users", verifyToken, isAdmin, getAllUsers)
router.get("/stats", verifyToken, isAdmin, getAdminStats)

// User management
router.patch("/users/:id/coins", verifyToken, isAdmin, updateUserCoins)
router.patch("/users/:id/role", verifyToken, isAdmin, updateUserRole)
router.delete("/users/:id", verifyToken, isAdmin, deleteUser)

// Task management
router.delete("/tasks/:id", verifyToken, isAdmin, deleteTask)
router.patch("/tasks/:id/status", verifyToken, isAdmin, updateTaskStatus)

export default router
