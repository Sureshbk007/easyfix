import express from "express";
import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
} from "../controllers/service.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authorizedRoles.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/")
  .post(
    verifyJWT,
    authorizeRoles("ADMIN", "SERVICE_PROVIDER"),
    upload.array("serviceImages"),
    createService
  )
  .get(getAllServices);

router
  .route("/:id")
  .get(getServiceById)
  .put(
    verifyJWT,
    authorizeRoles("ADMIN", "SERVICE_PROVIDER"),
    upload.array("images"),
    updateService
  )
  .delete(
    verifyJWT,
    authorizeRoles("ADMIN", "SERVICE_PROVIDER"),
    deleteService
  );

export default router;
