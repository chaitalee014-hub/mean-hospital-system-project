import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";

/* ==============================
   GET ALL DOCTORS
================================ */
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("hospitalId")
      .populate("user", "email");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ==============================
   GET DOCTORS BY HOSPITAL
================================ */
export const getDoctorsByHospital = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      hospitalId: req.params.hospitalId
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ==============================
   GET DOCTORS BY SPECIALIZATION
================================ */
export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      specialization: req.params.specialization
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ==============================
   ADD DOCTOR (ADMIN)
================================ */
export const addDoctor = async (req, res) => {
  try {
    const doctorData = {
      ...req.body,
      availableDays: req.body.availableDays || [],
      image: req.file ? req.file.path : null // ✅ Cloudinary URL
    };

    const doctor = new Doctor(doctorData);
    await doctor.save();

    res.status(201).json({
      message: "Doctor added successfully",
      doctor
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ==============================
   UPDATE DOCTOR (ADMIN)
================================ */
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // ✅ Update fields
    Object.assign(doctor, req.body);

    // ✅ Update image (Cloudinary URL)
    if (req.file) {
      doctor.image = req.file.path;
    }

    // ✅ Fix availableDays format
    if (req.body.availableDays) {
      doctor.availableDays = Array.isArray(req.body.availableDays)
        ? req.body.availableDays
        : [req.body.availableDays];
    }

    await doctor.save();

    res.json({
      message: "Doctor updated successfully",
      doctor
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ==============================
   DELETE DOCTOR (ADMIN)
================================ */
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // ❌ DO NOT delete local file (Cloudinary is used now)

    await User.findByIdAndDelete(doctor.user);
    await Doctor.findByIdAndDelete(req.params.id);

    res.json({
      message: "Doctor deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ==============================
   GET DOCTOR BY ID
================================ */
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("hospitalId")
      .populate("user", "email");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   UPDATE AVAILABILITY (ADMIN)
================================ */
export const updateAvailability = async (req, res) => {
  try {
    const { doctorId, isAvailable, leaveDates } = req.body;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (typeof isAvailable !== "undefined") {
      doctor.isAvailable = isAvailable;
    }

    if (leaveDates !== undefined) {
      doctor.leaveDates = leaveDates;
    }

    await doctor.save();

    res.json({
      message: "Availability updated successfully",
      doctor
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};