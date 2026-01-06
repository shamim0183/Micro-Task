import mongoose, { Document, Schema } from "mongoose"

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  type: "task" | "submission" | "withdrawal" | "system" | "admin"
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: Date
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["task", "submission", "withdrawal", "system", "admin"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
notificationSchema.index({ userId: 1, read: 1 })
notificationSchema.index({ createdAt: -1 })

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
)

export default Notification
