import mongoose, { Document, Schema } from "mongoose"

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId
  sessionId: string
  amount: number
  coins: number
  status: string
  createdAt: Date
}

const PaymentSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    coins: {
      type: Number,
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

export default mongoose.model<IPayment>("Payment", PaymentSchema)
