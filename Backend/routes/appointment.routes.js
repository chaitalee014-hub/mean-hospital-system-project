import express from "express";
import {
  createAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getPatientAppointments,
  getAllAppointments,
  bookAppointment,
  getBookedSlots,
  getUnseenCount,
  markAllSeen
} from "../controllers/appointment.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

// Book Appointment (Patient)
router.post(
  "/book/:doctorId",
  protect,
  authorize(["patient"]),   // ✅ added []
  bookAppointment
);

// Patient Routes
router.post("/", protect, authorize(["patient"]), createAppointment);  // ✅
router.get("/my", protect, authorize(["patient"]), getPatientAppointments);  // ✅

router.get('/unseen-count', protect, authorize(["doctor"]), getUnseenCount);
router.put('/mark-seen', protect, authorize(["doctor"]),markAllSeen);

// Doctor Routes
router.get("/doctor", protect, authorize(["doctor"]), getDoctorAppointments);  // ✅
router.put("/:id", protect, updateAppointmentStatus);  // ✅


// Admin Routes
router.get("/all", protect, authorize(["admin"]), getAllAppointments);  // ✅

// Get Booked Slots
router.get("/booked-slots", protect, getBookedSlots);

export default router;