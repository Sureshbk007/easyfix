import mongoose from "mongoose";

const cancellationRefundSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ["PENDING", "PROCESSED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const CancellationRefund = mongoose.model(
  "CancellationRefund",
  cancellationRefundSchema
);
