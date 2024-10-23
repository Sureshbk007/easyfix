import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authorizedRoles.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Only ADMIN can create, update, or delete categories
router.post(
  "/",
  verifyJWT,
  authorizeRoles("ADMIN"),
  upload.single("categoryImage"),
  createCategory
);
router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("ADMIN"),
  upload.single("categoryImage"),
  updateCategory
);
router.delete("/:id", verifyJWT, authorizeRoles("ADMIN"), deleteCategory);

// Public routes for fetching categories
router.get("/", getCategories);
router.get("/:id", getCategoryById);

export default router;
