import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      publicId: { type: String },
      imageUrl: { type: String },
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER", "SERVICE_PROVIDER"],
      required: true,
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = function (plaintextPassword) {
  return bcrypt.compareSync(plaintextPassword, this.password);
};
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.AUTH_TOKEN, {
    expiresIn: "10d",
  });
  return token;
};

export const User = mongoose.model("User", userSchema);
