import { ContactInfo, ServiceProvider, User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerServiceProvider = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const profileImage = req.file;

  const existingEmail = await User.findOne({ email });
  if (existingEmail && existingEmail.role === "USER") {
    throw new ApiError(400, "Cannot use customer email for service provider");
  } else if (existingEmail) {
    throw new ApiError(400, "Email already exist");
  }

  const userData = {
    fullName,
    email,
    password,
    role: "SERVICE_PROVIDER",
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

const verifyServiceProvider = asyncHandler(async (req, res) => {
  const {
    companyName,
    about,
    contactPerson,
    contactNumber,
    contactEmail,
    address,
  } = req.body;

  const user = req.user._id;
  const verificationDocuments = req.files;

  if (!(verificationDocuments.length > 0)) {
    throw new ApiError(400, "Verification Documents are required");
  }
  const imageUrls = [];
  for (const file of verificationDocuments) {
    const uploadedImage = await uploadOnCloudinary(file.path);
    if (uploadedImage) {
      imageUrls.push({
        publicId: uploadedImage.public_id,
        imageUrl: uploadedImage.secure_url,
      });
    }
  }

  const serviceProviderData = { user, verificationDocuments: imageUrls };
  if (companyName) serviceProviderData.companyName = companyName;
  if (about) serviceProviderData.about = about;
  const serviceProvider = await ServiceProvider.create(serviceProviderData);

  const contactInfoData = { user };
  if (contactPerson) contactInfoData.contactPerson = contactPerson;
  if (contactNumber) contactInfoData.contactNumber = contactNumber;
  if (contactEmail) contactInfoData.contactEmail = contactEmail;
  if (address) contactInfoData.address = address;
  const contactInfo = await ContactInfo.create(contactInfoData);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { serviceProvider, contactInfo },
        "Verification process started successfully"
      )
    );
});

const getAllServiceProviders = asyncHandler(async (req, res) => {
  const serviceProviders = await ServiceProvider.find()
    .populate({
      path: "user",
      select:
        "fullName email profileImage role isEmailVerified createdAt updatedAt",
    })
    .select(
      "companyName about isVerified verificationDocuments verificationStatus createdAt updatedAt"
    );

  res.status(200).json(new ApiResponse(200, serviceProviders));
});

const getServiceProviderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const serviceProviders = await ServiceProvider.findById(id)
    .populate({
      path: "user",
      select:
        "fullName email profileImage role isEmailVerified createdAt updatedAt",
    })
    .select(
      "companyName about isVerified verificationDocuments verificationStatus createdAt updatedAt"
    );

  res.status(200).json(new ApiResponse(200, serviceProviders));
});

export {
  registerServiceProvider,
  verifyServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
};
