import { Router } from "express"
import {
  createTask,
  deleteTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
} from "../controllers/task.controller"
import { verifyToken } from "../middleware/auth.middleware"
import { isBuyerOrAdmin } from "../middleware/roleCheck.middleware"

const router = Router()

// Public routes
router.get("/", getAllTasks)
router.get("/:id", getTaskById)

// Buyer routes
router.post("/", verifyToken, isBuyerOrAdmin, createTask)
router.get("/buyer/my-tasks", verifyToken, isBuyerOrAdmin, getMyTasks)
router.put("/:id", verifyToken, isBuyerOrAdmin, updateTask)
router.delete("/:id", verifyToken, isBuyerOrAdmin, deleteTask)

export default router
