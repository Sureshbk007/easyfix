import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { User } from "../models/users.model.js";

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const profileImage = req.file;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "Email already exist");
  }
  const userData = {
    fullName,
    email,
    password,
  };

  if (profileImage) {
    const { secure_url: imageUrl, public_id: publicId } =
      await uploadOnCloudinary(profileImage.path);
    userData.profileImage = {
      imageUrl,
      publicId,
    };
  }
  const user = await User.create(userData);
  const newUser = await User.findById(user._id)
    .select("-password -__v -createdAt -updatedAt")
    .lean();
  const token = user.generateAuthToken();
  const response = {
    ...newUser,
    profileImage: newUser?.profileImage?.imageUrl
      ? newUser.profileImage.imageUrl
      : "",
    token,
  };

  res
    .status(201)
    .json(new ApiResponse(201, response, "Account registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "Invalid email address");

  const isMatchingPassword = await user.comparePassword(password);
  if (!isMatchingPassword) throw new ApiError(400, "Invalid password");

  const token = user.generateAuthToken();
  const response = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImage: user?.profileImage?.imageUrl
      ? user.profileImage.imageUrl
      : "",
    token,
  };
  res
    .status(200)
    .json(new ApiResponse(200, response, "Logged in successfully"));
});

const updateUserInfo = asyncHandler(async (req, res) => {
  const id = req.user;
  const { fullName, password } = req.body;
  const profileImage = req.file;
  const user = await User.findById(id);
  if (fullName) user.fullName = fullName;
  if (password) user.password = password;
  if (profileImage) {
    const { secure_url: imageUrl, public_id: publicId } =
      await uploadOnCloudinary(profileImage.path);
    user.profileImage = {
      imageUrl,
      publicId,
    };
  }
  await user.save();
  const updatedUser = await User.findById(id)
    .select("-password -__v -createdAt -updatedAt")
    .lean();
  const response = {
    ...updatedUser,
    profileImage: updatedUser?.profileImage?.imageUrl
      ? user.profileImage.imageUrl
      : "",
  };

  res.status(200).json(new ApiResponse(200, response));
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = req.user;

  const user = await User.findByIdAndDelete(id);
  if (user?.profileImage?.publicId) {
    await deleteFromCloudinary(user.profileImage.publicId);
  }
  res
    .status(200)
    .json(new ApiResponse(200, user, "Account deleted successfully"));
});
export { register, login, updateUserInfo, deleteUser };
