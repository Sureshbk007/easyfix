import mongoose from "mongoose";

async function connectDB() {
  return await mongoose.connect(`${process.env.MONGODB_URI}`);
}

export default connectDB;
