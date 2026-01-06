"use client"

import { useAuth } from "@/contexts/AuthContext"
import axios from "axios"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaEnvelope, FaGoogle, FaImage, FaLock, FaUser } from "react-icons/fa"

export default function RegisterPage() {
  const router = useRouter()
  const { register, loginWithGoogle } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoFile: null as File | null,
    photoURL: "",
    role: "worker" as "worker" | "buyer",
  })
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken")
      if (token) {
        router.push("/dashboard")
      }
    }
  }, [])

  // Password validation regex: at least 1 uppercase, 1 lowercase, 1 number, 1 special char, min 6 chars
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
  const isPasswordValid = passwordRegex.test(formData.password)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploadingImage(true)
    const formDataImg = new FormData()
    formDataImg.append("image", file)

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        formDataImg
      )

      if (response.data.success) {
        setFormData({ ...formData, photoURL: response.data.data.url })
      }
    } catch (error) {
      console.error("Image upload error:", error)
      alert("Failed to upload image")
      setImagePreview(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.photoURL) {
      alert("Please upload a profile picture")
      return
    }

    setLoading(true)

    try {
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.photoURL,
        formData.role
      )
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async (role: "worker" | "buyer") => {
    setLoading(true)
    try {
      await loginWithGoogle(role)
      router.push("/dashboard")
    } catch (error) {
      console.error("Google sign-in error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Image */}
      <div className="hidden lg:block relative bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/85"></div>
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200"
          alt="Team success"
          fill
          className="object-cover"
          priority
        />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-md text-white">
            <h2 className="text-4xl font-bold mb-6">
              Start Your Journey Today!
            </h2>
            <p className="text-xl text-blue-100 mb-6">
              Join thousands of workers earning daily or businesses getting work
              done efficiently.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  🎁
                </div>
                <span>Get free coins on signup</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  ⚡
                </div>
                <span>Start earning immediately</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  🌍
                </div>
                <span>Work from anywhere</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <Link href="/" className="flex items-center justify-center mb-6">
              <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TaskEarn
              </div>
            </Link>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-gray-600 mt-2">
                Join TaskEarn and start earning!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                      formData.password.length === 0
                        ? "border-gray-300 focus:ring-primary-500"
                        : isPasswordValid
                        ? "border-green-500 focus:ring-green-500"
                        : "border-red-500 focus:ring-red-500"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {formData.password.length > 0 && (
                  <p
                    className={`text-sm mt-1 ${
                      isPasswordValid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPasswordValid
                      ? "✓ Strong password"
                      : "✗ Must have uppercase, lowercase, number, special char (@$!%*?&)"}
                  </p>
                )}
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="relative">
                  <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                {uploadingImage && (
                  <p className="text-sm text-primary-500 mt-1">Uploading...</p>
                )}
                {imagePreview && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary-500"
                    />
                    <p className="text-sm text-green-600">
                      ✓ Image uploaded successfully
                    </p>
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join as
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="worker">
                    Worker (Earn by completing tasks)
                  </option>
                  <option value="buyer">
                    Buyer (Create tasks and hire workers)
                  </option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  {formData.role === "worker"
                    ? "🎁 Get 10 coins on signup!"
                    : "🎁 Get 50 coins on signup!"}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold 
                       hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">
                Or continue with
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Sign In */}
            <div className="space-y-3">
              <button
                onClick={() => handleGoogleSignIn("worker")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 
                       py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <FaGoogle className="text-red-500" />
                Sign up as Worker with Google
              </button>
              <button
                onClick={() => handleGoogleSignIn("buyer")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 
                       py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <FaGoogle className="text-red-500" />
                Sign up as Buyer with Google
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
