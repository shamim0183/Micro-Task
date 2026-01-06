import cors from "cors"
import express from "express"
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

const app = express()

// Database connection
connectDB()

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:3000"],
    credentials: true,
  })
)

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use("/api", limiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/submissions", submissionRoutes)
app.use("/api/withdrawals", withdrawalRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/payments", paymentRoutes)

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", message: "Server is running" })
})

// For Vercel serverless
export default app
