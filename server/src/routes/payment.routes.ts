import { Router } from "express"
import {
  createPaymentIntent,
  getPaymentHistory,
  handlePaymentSuccess,
} from "../controllers/payment.controller"
import { verifyToken } from "../middleware/auth.middleware"

const router = Router()

// Create payment intent
router.post("/create-payment-intent", verifyToken, createPaymentIntent)

// Handle payment success
router.post("/success", verifyToken, handlePaymentSuccess)

// Get payment history
router.get("/history", verifyToken, getPaymentHistory)

export default router
