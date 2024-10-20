import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  deleteUser,
  login,
  register,
  updateUserInfo,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);
router.patch(
  "/update",
  upload.single("profileImage"),
  verifyJWT,
  updateUserInfo
);
router.delete("/deleteAccount", verifyJWT, deleteUser);

export default router;
