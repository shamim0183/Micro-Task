import { Document, Schema, model } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  photoURL: string
  role: "worker" | "buyer" | "admin"
  coins: number
  firebaseUid: string
  hasReceivedInitialCoins: boolean
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    photoURL: {
      type: String,
      required: [true, "Photo URL is required"],
    },
    role: {
      type: String,
      enum: ["worker", "buyer", "admin"],
      default: "worker",
    },
    coins: {
      type: Number,
      default: 10,
    },
    firebaseUid: {
      type: String,
      required: [true, "Firebase UID is required"],
      unique: true,
      index: true,
    },
    hasReceivedInitialCoins: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
userSchema.index({ email: 1 })
userSchema.index({ firebaseUid: 1 })
userSchema.index({ role: 1 })

const User = model<IUser>("User", userSchema)

export default User
