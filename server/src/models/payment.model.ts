import mongoose, { Document, Schema } from "mongoose"

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId
  amount: number
  coins: number
  paymentMethod: string
  transactionId: string
  status: "pending" | "completed" | "failed"
  createdAt: Date
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    coins: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "stripe",
    },
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
)

export default mongoose.model<IPayment>("Payment", paymentSchema)
