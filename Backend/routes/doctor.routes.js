import express from "express";
import upload from "../config/multer.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

import {
  addDoctor,
  getAllDoctors,
  getDoctorsByHospital,
  getDoctorsBySpecialization,
  updateDoctor,
  deleteDoctor,
  updateAvailability
} from "../controllers/doctor.controller.js";

import { getDoctorById } from "../controllers/doctor.controller.js";


const router = express.Router();

/* Public Routes */
router.get("/", getAllDoctors);
router.get("/hospital/:hospitalId", getDoctorsByHospital);
router.get("/specialization/:specialization", getDoctorsBySpecialization);

/* Admin Routes */
router.post("/add", protect, authorize(["admin"]), upload.single("image"), addDoctor);
router.put("/availability",protect,authorize(["admin"]),updateAvailability);
router.put("/:id", protect, authorize(["admin"]), upload.single("image"), updateDoctor);
router.delete("/:id", protect, authorize(["admin"]), deleteDoctor);



router.get("/:id", getDoctorById);

export default router;