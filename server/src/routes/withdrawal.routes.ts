import { Router } from "express"
import {
  createWithdrawal,
  getAllWithdrawals,
  getMyWithdrawals,
  reviewWithdrawal,
} from "../controllers/withdrawal.controller"
import { verifyToken } from "../middleware/auth.middleware"
import { isAdmin, isWorker } from "../middleware/roleCheck.middleware"

const router = Router()

// Worker routes
router.post("/", verifyToken, isWorker, createWithdrawal)
router.get("/", verifyToken, isWorker, getMyWithdrawals)

// Admin routes
router.get("/all", verifyToken, isAdmin, getAllWithdrawals)
router.patch("/:id/review", verifyToken, isAdmin, reviewWithdrawal)

export default router
