import { Document, Schema, model } from "mongoose"

export interface ITask extends Document {
  title: string
  description: string
  taskImageURL?: string
  submissionInfo: string
  payableAmount: number
  completionTime: Date
  creatorId: Schema.Types.ObjectId
  creatorName: string
  creatorEmail: string
  taskQuantity: number
  currentSubmissions: number
  isActive: boolean
  status: string
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    taskImageURL: {
      type: String,
    },
    submissionInfo: {
      type: String,
      required: [true, "Submission info is required"],
    },
    payableAmount: {
      type: Number,
      required: [true, "Payable amount is required"],
      min: [1, "Payable amount must be at least 1 coin"],
    },
    completionTime: {
      type: Date,
      required: [true, "Completion time is required"],
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    creatorEmail: {
      type: String,
      required: true,
    },
    taskQuantity: {
      type: Number,
      required: [true, "Task quantity is required"],
      min: [1, "Task quantity must be at least 1"],
    },
    currentSubmissions: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
taskSchema.index({ creatorId: 1 })
taskSchema.index({ isActive: 1 })
taskSchema.index({ createdAt: -1 })

const Task = model<ITask>("Task", taskSchema)

export default Task
