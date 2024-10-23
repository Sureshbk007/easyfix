import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

// Create a new category
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const categoryImage = req.file;

  // Check if category with the same name exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ApiError(400, "Category with this name already exists.");
  }

  const categoryData = { name };
  const { secure_url: imageUrl, public_id: publicId } =
    await uploadOnCloudinary(categoryImage.path);
  categoryData.image = {
    imageUrl,
    publicId,
  };

  const category = new Category(categoryData);
  await category.save();

  res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

// Get all categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(new ApiResponse(200, categories));
});

// Get a single category by ID
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.status(200).json(new ApiResponse(200, category));
});

// Update a category
export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const categoryImage = req.file;
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (name) category.name = name;
  if (categoryImage) {
    // Delete the existing image from Cloudinary
    if (category.image && category.image.publicId) {
      await deleteFromCloudinary(category.image.publicId);
    }

    const { secure_url: imageUrl, public_id: publicId } =
      await uploadOnCloudinary(categoryImage.path);
    category.image = {
      imageUrl,
      publicId,
    };
  }

  await category.save();

  res.status(200).json({
    message: "Category updated successfully",
    category,
  });
});

// Delete a category
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  if (category.image && category.image.publicId) {
    await deleteFromCloudinary(category.image.publicId);
  }

  await Category.deleteOne({ _id: req.params.id });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});
