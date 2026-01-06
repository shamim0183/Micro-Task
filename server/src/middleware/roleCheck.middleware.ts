import { NextFunction, Response } from "express"
import { AuthRequest } from "./auth.middleware"

export const checkRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      })
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      })
      return
    }

    next()
  }
}

// Specific role checkers
export const isWorker = checkRole("worker")
export const isBuyer = checkRole("buyer")
export const isAdmin = checkRole("admin")
export const isBuyerOrAdmin = checkRole("buyer", "admin")
export const isWorkerOrAdmin = checkRole("worker", "admin")
