import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        publicId: String,
        imageUrl: String,
      },
    ],
    keywords: [String],
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);
