import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    contactInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactInfo",
    },
    scheduledForDate: { type: Date, required: true },
    notes: String,
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
