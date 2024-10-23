import mongoose from "mongoose";
const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    viewedServices: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    searchHistory: [String],
  },
  { timestamps: true }
);

export const UserActivity = mongoose.model("UserActivity", userActivitySchema);
