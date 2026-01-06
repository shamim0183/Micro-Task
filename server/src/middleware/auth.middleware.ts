import { NextFunction, Request, Response } from "express"
import { auth as firebaseAuth } from "../config/firebase"
import User from "../models/User.model"

export interface AuthRequest extends Request {
  user?: {
    uid: string
    email: string
    role: string
  }
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      })
      return
    }

    // Verify Firebase token
    const decodedToken = await firebaseAuth.verifyIdToken(token)

    // Get user from database to get actual role
    const user = await User.findOne({ firebaseUid: decodedToken.uid })

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      })
      return
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      role: user.role, // Get role from database
    }

    next()
  } catch (error) {
    console.error("Token verification error:", error)
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    })
  }
}

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (token) {
      const decodedToken = await firebaseAuth.verifyIdToken(token)

      // Get user from database
      const user = await User.findOne({ firebaseUid: decodedToken.uid })

      if (user) {
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email || "",
          role: user.role,
        }
      }
    }

    next()
  } catch (error) {
    next()
  }
}
