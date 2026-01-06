import { Document, Schema, model } from "mongoose"

export interface IWithdrawal extends Document {
  workerId: Schema.Types.ObjectId
  workerName: string
  workerEmail: string
  amount: number
  paymentMethod: string
  paymentDetails: string
  status: "pending" | "approved" | "rejected"
  adminNote?: string
  createdAt: Date
  updatedAt: Date
}

const withdrawalSchema = new Schema<IWithdrawal>(
  {
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
    amount: {
      type: Number,
      required: [true, "Withdrawal amount is required"],
      min: [1, "Minimum withdrawal is 1 coin"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["bkash", "nagad", "rocket", "bank"],
    },
    paymentDetails: {
      type: String,
      required: [true, "Payment details are required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

withdrawalSchema.index({ status: 1 })
withdrawalSchema.index({ createdAt: -1 })

const Withdrawal = model<IWithdrawal>("Withdrawal", withdrawalSchema)

export default Withdrawal
