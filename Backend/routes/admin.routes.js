import express from "express";
import { createDoctor, deleteDoctorByAdmin, updateDoctorByAdmin } from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post(
  "/create-doctor",
  protect,
  adminOnly,
  upload.single("image"),  // 🔥 VERY IMPORTANT
  createDoctor
);

router.put("/doctor/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateDoctorByAdmin
);

router.delete("/doctor/:id",
  protect,
  adminOnly,
  deleteDoctorByAdmin
);

export default router;