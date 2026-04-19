// import User from "../models/user.model.js";
// import Doctor from "../models/doctor.model.js";
// import Hospital from "../models/hospital.model.js";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";

// dotenv.config();

// /* ===============================
//    EMAIL CONFIGURATION
// ================================= */
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// /* ===============================
//    CREATE DOCTOR (ADMIN ONLY)
// ================================= */

// export const createDoctor = async (req, res) => {
//   try {

//     const {
//       name,
//       email,
//       specialization,
//       qualification,
//       experience,
//       consultationFee,
//       availableDays,
//       startTime,
//       endTime,
//       lunchStart,
//       lunchEnd,
//       slotDuration
//     } = req.body;

//     if (!name || !email || !specialization || !experience || !consultationFee) {
//       return res.status(400).json({ message: "All required fields must be filled" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Doctor already exists" });
//     }

//     const hospital = await Hospital.findOne();
//     if (!hospital) {
//       return res.status(400).json({ message: "No hospital found" });
//     }

//     const generatedPassword = Math.random().toString(36).slice(-8);

//     const user = await User.create({
//       name,
//       email,
//       password: generatedPassword,
//       role: "doctor"
//     });

//     const daysArray = Array.isArray(availableDays)
//       ? availableDays
//       : availableDays
//         ? [availableDays]
//         : [];

//     // 🔥 create doctor WITHOUT image first
//     const doctor = await Doctor.create({
//       name,
//       specialization,
//       qualification,
//       experience: Number(experience),
//       consultationFee: Number(consultationFee),
//       hospitalId: hospital._id,
//       user: user._id,
//       availableDays: daysArray,
//       startTime,
//       endTime,
//       lunchStart,
//       lunchEnd,
//       slotDuration: Number(slotDuration) || 30,
//       image: null
//     });

//     // 🔥 HANDLE IMAGE
//     if (req.file) {
//       const ext = path.extname(req.file.originalname);
//       const newFileName = doctor._id + ext;

//       const oldPath = path.join("uploads", req.file.filename);
//       const newPath = path.join("uploads", newFileName);

//       // 🔥 HANDLE IMAGE
//       if (req.file) {
//         doctor.image = req.file.path; // ✅ Cloudinary URL
//         await doctor.save();
//       }
//     }

//     // 🔥 Send Email
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Doctor Account Created",
//       text: `Hello ${name},

// Your account has been created.

// Email: ${email}
// Password: ${generatedPassword}`
//     });

//     res.status(201).json({
//       message: "Doctor created successfully",
//       doctor
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// /* ==============================
//    UPDATE DOCTOR (ADMIN)
// ================================ */

// export const updateDoctorByAdmin = async (req, res) => {
//   try {

//     const doctor = await Doctor.findById(req.params.id);

//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     // Update fields
//     doctor.name = req.body.name || doctor.name;
//     doctor.specialization = req.body.specialization || doctor.specialization;
//     doctor.qualification = req.body.qualification || doctor.qualification;
//     doctor.experience = req.body.experience || doctor.experience;

//     // 🔥 IMAGE UPDATE (overwrite same file)
//     if (req.file) {
//       const ext = path.extname(req.file.originalname);
//       const fileName = doctor._id + ext;

//       const filePath = path.join("uploads", fileName);

//       // delete old file if exists
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }

//       // move new file with SAME name
//       fs.renameSync(
//         path.join("uploads", req.file.filename),
//         filePath
//       );

//       doctor.image = fileName;
//     }

//     await doctor.save();

//     res.json({
//       message: "Doctor updated successfully",
//       doctor
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// /* ==============================
//    DELETE DOCTOR (ADMIN)
// ================================ */

// export const deleteDoctorByAdmin = async (req, res) => {
//   try {

//     const doctor = await Doctor.findById(req.params.id);

//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     // delete linked user account
//     await User.findByIdAndDelete(doctor.user);

//     await Doctor.findByIdAndDelete(req.params.id);

//     res.json({
//       message: "Doctor deleted successfully"
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Hospital from "../models/hospital.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* ===============================
   EMAIL CONFIGURATION
================================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ===============================
   CREATE DOCTOR (ADMIN ONLY)
================================= */
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      qualification,
      experience,
      consultationFee,
      availableDays,
      startTime,
      endTime,
      lunchStart,
      lunchEnd,
      slotDuration
    } = req.body;

    if (!name || !email || !specialization || !experience || !consultationFee) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hospital = await Hospital.findOne();
    if (!hospital) {
      return res.status(400).json({ message: "No hospital found" });
    }

    const generatedPassword = Math.random().toString(36).slice(-8);

    const user = await User.create({
      name,
      email,
      password: generatedPassword,
      role: "doctor"
    });

    const daysArray = Array.isArray(availableDays)
      ? availableDays
      : availableDays
        ? [availableDays]
        : [];

    const doctor = await Doctor.create({
      name,
      specialization,
      qualification,
      experience: Number(experience),
      consultationFee: Number(consultationFee),
      hospitalId: hospital._id,
      user: user._id,
      availableDays: daysArray,
      startTime,
      endTime,
      lunchStart,
      lunchEnd,
      slotDuration: Number(slotDuration) || 30,
      image: null
    });

    // ✅ CLOUDINARY IMAGE SAVE
    if (req.file) {
      doctor.image = req.file.path;
      await doctor.save();
    }

    // 📧 Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Doctor Account Created",
      text: `Hello ${name},

Your account has been created.

Email: ${email}
Password: ${generatedPassword}`
    });

    res.status(201).json({
      message: "Doctor created successfully",
      doctor
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   UPDATE DOCTOR (ADMIN)
================================ */
export const updateDoctorByAdmin = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.name = req.body.name || doctor.name;
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.qualification = req.body.qualification || doctor.qualification;
    doctor.experience = req.body.experience || doctor.experience;

    // ✅ CLOUDINARY IMAGE UPDATE
    if (req.file) {
      doctor.image = req.file.path;
    }

    await doctor.save();

    res.json({
      message: "Doctor updated successfully",
      doctor
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   DELETE DOCTOR (ADMIN)
================================ */
export const deleteDoctorByAdmin = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await User.findByIdAndDelete(doctor.user);
    await Doctor.findByIdAndDelete(req.params.id);

    res.json({
      message: "Doctor deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};