import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SUCCESS"],
      default: "PENDING",
    },
    paymnetDate: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["ESEWA"],
      default: "ESEWA",
    },
  },
  { timestamps: true }
);

export const Payments = new mongoose.model("Payment", paymentSchema);
