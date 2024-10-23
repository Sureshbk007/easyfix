import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyName: {
      type: String,
      trim: true,
    },
    about: String,
    isVerified: { type: Boolean, default: false },
    verificationDocuments: [
      {
        publicId: String,
        imageUrl: String,
      },
    ],
    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);
