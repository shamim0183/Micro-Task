import { Document, Schema, model } from "mongoose"

export interface ISubmission extends Document {
  taskId: Schema.Types.ObjectId
  workerId: Schema.Types.ObjectId
  workerName: string
  workerEmail: string
  submissionDetails: string
  submissionFileURL?: string
  status: "pending" | "approved" | "rejected"
  reviewNote?: string
  payableAmount: number
  createdAt: Date
  updatedAt: Date
}

const submissionSchema = new Schema<ISubmission>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workerName: {
      type: String,
      required: true,
    },
    workerEmail: {
      type: String,
      required: true,
    },
    submissionDetails: {
      type: String,
      required: [true, "Submission details are required"],
    },
    submissionFileURL: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewNote: {
      type: String,
    },
    payableAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index for unique submission per worker per task
submissionSchema.index({ taskId: 1, workerId: 1 }, { unique: true })
submissionSchema.index({ status: 1 })
submissionSchema.index({ createdAt: -1 })

const Submission = model<ISubmission>("Submission", submissionSchema)

export default Submission
