import { Router } from "express"
import {
  createSubmission,
  getMySubmissions,
  getSubmissionsForTask,
  reviewSubmission,
} from "../controllers/submission.controller"
import { verifyToken } from "../middleware/auth.middleware"
import { isBuyerOrAdmin, isWorker } from "../middleware/roleCheck.middleware"

const router = Router()

// Worker routes
router.post("/", verifyToken, isWorker, createSubmission)
router.get("/my-submissions", verifyToken, isWorker, getMySubmissions)

// Buyer routes
router.get("/task/:taskId", verifyToken, isBuyerOrAdmin, getSubmissionsForTask)
router.patch("/:id/review", verifyToken, isBuyerOrAdmin, reviewSubmission)

export default router
