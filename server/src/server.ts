import cors from "cors"
import dotenv from "dotenv"
import express, { Application, NextFunction, Request, Response } from "express"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import connectDB from "./config/db"
import adminRoutes from "./routes/admin.routes"
import authRoutes from "./routes/auth.routes"
import notificationRoutes from "./routes/notification.routes"
import paymentRoutes from "./routes/payment.routes"
import submissionRoutes from "./routes/submission.routes"
import taskRoutes from "./routes/task.routes"
import withdrawalRoutes from "./routes/withdrawal.routes"

// Load environment variables
dotenv.config()

// Create Express app
const app: Application = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(helmet()) // Security headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
)
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "🚀 TaskEarn API Server is running!",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      tasks: "/api/tasks",
      submissions: "/api/submissions",
      payments: "/api/payments",
      withdrawals: "/api/withdrawals",
      notifications: "/api/notifications",
      admin: "/api/admin",
    },
  })
})

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "✅ Server is healthy",
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/submissions", submissionRoutes)
app.use("/api/withdrawals", withdrawalRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/payments", paymentRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err.message)
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(
    `🌐 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`
  )
})

export default app
