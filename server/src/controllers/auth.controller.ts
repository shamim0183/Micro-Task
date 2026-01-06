import { NextFunction, Response } from "express"
import { firebaseAdmin } from "../config/firebase"
import { AuthRequest } from "../middleware/auth.middleware"
import User from "../models/User.model"

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, photoURL, role, firebaseUid } = req.body

    // Validation
    if (!name || !email || !photoURL || !role || !firebaseUid) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      })
      return
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { firebaseUid }],
    })

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      })
      return
    }

    // Determine initial coins based on role
    const initialCoins = role === "worker" ? 10 : role === "buyer" ? 50 : 0

    // Create new user
    const user = await User.create({
      name,
      email,
      photoURL,
      role,
      firebaseUid,
      coins: initialCoins,
      hasReceivedInitialCoins: true,
    })

    // Set custom claims in Firebase
    await firebaseAdmin.auth().setCustomUserClaims(firebaseUid, { role })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
          role: user.role,
          coins: user.coins,
        },
      },
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    })
  }
}

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firebaseUid, email } = req.body

    if (!firebaseUid || !email) {
      res.status(400).json({
        success: false,
        message: "Firebase UID and email are required",
      })
      return
    }

    // Find user
    const user = await User.findOne({ firebaseUid })

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
          role: user.role,
          coins: user.coins,
        },
      },
    })
  } catch (error: any) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    })
  }
}

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      })
      return
    }

    const user = await User.findOne({ firebaseUid: req.user.uid })

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      })
      return
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
          role: user.role,
          coins: user.coins,
        },
      },
    })
  } catch (error: any) {
    console.error("Get current user error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get user data",
      error: error.message,
    })
  }
}
