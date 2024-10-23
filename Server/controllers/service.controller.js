import { Service, ServiceProvider } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Create a new service
const createService = asyncHandler(async (req, res) => {
  const { name, category, description, price, keywords } = req.body;
  const user = req.user._id;
  const serviceProvider = await ServiceProvider.findOne({ user }).select("_id");
  if (!serviceProvider) {
    throw new ApiError(400, "You are not allowed to create service");
  }
  const images = req.files;
  const imageUrls = [];

  // Upload each image to Cloudinary and store the URLs
  if (images.length > 0)
    for (const file of images) {
      const uploadedImage = await uploadOnCloudinary(file.path);
      if (uploadedImage) {
        imageUrls.push({
          publicId: uploadedImage.public_id,
          imageUrl: uploadedImage.secure_url,
        });
      }
    }

  const service = await Service.create({
    name,
    category,
    description,
    price: Number(price),
    images: imageUrls,
    keywords: keywords.split(","),
    serviceProvider,
  });

  res
    .status(201)
    .json(new ApiResponse(201, service, "Service created successfully"));
});

// Get all services
const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find().populate("category serviceProvider");
  res.status(200).json(new ApiResponse(200, services));
});

// Get a single service by ID
const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id)
    .populate("category serviceProvider")
    .lean();

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, service, "Service fetched successfully"));
});

// Update a service by ID
const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, keywords, serviceProvider } =
    req.body;
  const images = req.files;
  const imageUrls = [];

  // Upload new images to Cloudinary
  for (const file of images) {
    const uploadedImage = await uploadOnCloudinary(file.path);
    if (uploadedImage) {
      imageUrls.push({
        publicId: uploadedImage.public_id,
        imageUrl: uploadedImage.secure_url,
      });
    }
  }

  const service = await Service.findByIdAndUpdate(
    id,
    {
      name,
      category,
      description,
      price,
      images: imageUrls,
      keywords,
      serviceProvider,
    },
    { new: true, runValidators: true }
  )
    .populate("category serviceProvider")
    .lean();

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, service, "Service updated successfully"));
});

// Delete a service by ID
const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findByIdAndDelete(id).lean();

  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  if (service.images && service.images.length > 0) {
    await Promise.all(
      service.images.map((image) => deleteFromCloudinary(image.publicId))
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Service deleted successfully", service));
});

export {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
