import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema(
  {
    contactPerson: String,
    contactNumber: String,
    contactEmail: String,
    address: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const ContactInfo = mongoose.model("ContactInfo", contactInfoSchema);
