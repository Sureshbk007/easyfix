import express from "express";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import {
  getAllServiceProviders,
  getServiceProviderById,
  registerServiceProvider,
  verifyServiceProvider,
} from "../controllers/serviceProvider.controller.js";
import { authorizeRoles } from "../middlewares/authorizedRoles.js";

const router = express.Router();

router.get("/", getAllServiceProviders);
router.get("/:id", getServiceProviderById);

router.post(
  "/register",
  upload.single("profileImage"),
  registerServiceProvider
);

router.post(
  "/verify",
  verifyJWT,
  authorizeRoles("SERVICE_PROVIDER"),
  upload.array("verificationDocuments"),
  verifyServiceProvider
);

export default router;
