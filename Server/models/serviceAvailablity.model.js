import mongoose from "mongoose";

const serviceAvailabilitySchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    availableDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ServiceAvailibility = mongoose.model(
  "ServiceAvailibility",
  serviceAvailabilitySchema
);
