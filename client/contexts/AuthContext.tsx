"use client"

import apiClient from "@/lib/axios"
import { auth } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import React, { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"

interface User {
  id: string
  name: string
  email: string
  photoURL: string
  role: "worker" | "buyer" | "admin"
  coins: number
}

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  register: (
    email: string,
    password: string,
    name: string,
    photoURL: string,
    role: "worker" | "buyer"
  ) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (role: "worker" | "buyer") => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user data from backend
  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken()
      localStorage.setItem("accessToken", token)

      const response = await apiClient.get("/auth/me")
      if (response.data.success) {
        setUser(response.data.data.user)
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error)
      // If user not found in backend, they might need to register
      if (error.response?.status === 404) {
        setUser(null)
      }
    }
  }

  // Register new user
  const register = async (
    email: string,
    password: string,
    name: string,
    photoURL: string,
    role: "worker" | "buyer"
  ) => {
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const token = await userCredential.user.getIdToken()
      localStorage.setItem("accessToken", token)

      // Register in backend
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        photoURL,
        role,
        firebaseUid: userCredential.user.uid,
      })

      if (response.data.success) {
        setUser(response.data.data.user)
        toast.success(
          `Welcome! You received ${role === "worker" ? "10" : "50"} coins!`
        )
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      const message =
        error.response?.data?.message || error.message || "Registration failed"
      toast.error(message)
      throw error
    }
  }

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const token = await userCredential.user.getIdToken()
      localStorage.setItem("accessToken", token)

      // Get user data from backend
      const response = await apiClient.post("/auth/login", {
        email,
        firebaseUid: userCredential.user.uid,
      })

      if (response.data.success) {
        setUser(response.data.data.user)
        toast.success("Login successful!")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      const message =
        error.response?.data?.message || error.message || "Login failed"
      toast.error(message)
      throw error
    }
  }

  // Login with Google
  const loginWithGoogle = async (role: "worker" | "buyer") => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const token = await userCredential.user.getIdToken()
      localStorage.setItem("accessToken", token)

      // Try to login first
      try {
        const response = await apiClient.post("/auth/login", {
          email: userCredential.user.email,
          firebaseUid: userCredential.user.uid,
        })

        if (response.data.success) {
          setUser(response.data.data.user)
          toast.success("Login successful!")
          return
        }
      } catch (loginError: any) {
        // If user doesn't exist, register them
        if (loginError.response?.status === 404) {
          const response = await apiClient.post("/auth/register", {
            name: userCredential.user.displayName || "User",
            email: userCredential.user.email,
            photoURL: userCredential.user.photoURL || "",
            role,
            firebaseUid: userCredential.user.uid,
          })

          if (response.data.success) {
            setUser(response.data.data.user)
            toast.success(
              `Welcome! You received ${role === "worker" ? "10" : "50"} coins!`
            )
          }
        } else {
          throw loginError
        }
      }
    } catch (error: any) {
      console.error("Google login error:", error)
      const message =
        error.response?.data?.message || error.message || "Google login failed"
      toast.error(message)
      throw error
    }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("accessToken")
      setUser(null)
      setFirebaseUser(null)
      toast.success("Logged out successfully")
    } catch (error: any) {
      console.error("Logout error:", error)
      toast.error("Logout failed")
      throw error
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser)
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        await fetchUserData(firebaseUser)
      } else {
        setUser(null)
        localStorage.removeItem("accessToken")
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
