import { Response } from "express"
import Stripe from "stripe"
import { AuthRequest } from "../middleware/auth.middleware"
import Payment from "../models/payment.model"
import User from "../models/User.model"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

// Create payment intent for coin purchase
export const createPaymentIntent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!stripe) {
      res.status(500).json({
        success: false,
        message: "Payment system not configured. Please contact administrator.",
      })
      return
    }

    const { coins, amount } = req.body
    const userId = req.user?.uid

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" })
      return
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${coins} Coins`,
              description: `Purchase ${coins} coins for TaskEarn platform`,
            },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/dashboard/buyer/purchase-coin/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/buyer/purchase-coin`,
      client_reference_id: userId,
      metadata: {
        userId,
        coins: coins.toString(),
      },
    })

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
      },
    })
  } catch (error: any) {
    console.error("Create payment intent error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create payment session",
      error: error.message,
    })
  }
}

// Handle successful payment (webhook or manual verification)
export const handlePaymentSuccess = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!stripe) {
      res.status(500).json({
        success: false,
        message: "Payment system not configured",
      })
      return
    }

    const { sessionId } = req.body

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      const userId = session.metadata?.userId
      const coinsStr = session.metadata?.coins

      if (!userId || !coinsStr) {
        res.status(400).json({
          success: false,
          message: "Invalid session metadata",
        })
        return
      }

      const coins = parseInt(coinsStr)
      const amount = (session.amount_total || 0) / 100 // Convert back to dollars

      // Update user coins
      const user = await User.findById(userId)
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" })
        return
      }

      user.coins += coins
      await user.save()

      // Save payment record
      const payment = new Payment({
        userId,
        amount,
        coins,
        paymentMethod: "stripe",
        transactionId: session.id,
        status: "completed",
      })
      await payment.save()

      res.status(200).json({
        success: true,
        message: "Payment successful",
        data: {
          coins: user.coins,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not completed",
      })
    }
  } catch (error: any) {
    console.error("Payment success handler error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: error.message,
    })
  }
}

// Get payment history for user
export const getPaymentHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.uid

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)

    res.status(200).json({
      success: true,
      data: { payments },
    })
  } catch (error: any) {
    console.error("Get payment history error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message,
    })
  }
}
