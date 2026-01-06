import { Router } from "express"
import { getCurrentUser, login, register } from "../controllers/auth.controller"
import { verifyToken } from "../middleware/auth.middleware"

const router = Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.get("/me", verifyToken, getCurrentUser)

export default router
