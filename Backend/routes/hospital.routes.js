import express from "express";
import {
  addHospital,
  getAllHospitals,
  getHospitalById
} from "../controllers/hospital.controller.js";


const router = express.Router();

// Add new hospital
router.post("/add", addHospital);

// Get all hospitals
router.get("/", getAllHospitals);

// Get hospital by ID
router.get("/:id", getHospitalById);


export default router;
