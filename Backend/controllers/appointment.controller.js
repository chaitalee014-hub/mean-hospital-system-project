import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";


export const createAppointment = async (req, res) => {
  try {
    const { doctor, hospital, appointmentDate, appointmentTime } = req.body;

    const doctorData = await Doctor.findById(doctor);

    if (!doctorData) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // ✅ Normalize date
    const formattedDate = new Date(appointmentDate)
      .toISOString()
      .split("T")[0];

    // ✅ Check full availability
    if (!doctorData.isAvailable) {
      return res.status(400).json({ message: "Doctor is not available" });
    }

    // ✅ Check leave date
    if (doctorData.leaveDates.includes(formattedDate)) {
      return res.status(400).json({
        message: "Doctor is on leave on selected date"
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      hospital,
      appointmentDate: formattedDate, // ✅ store clean date
      appointmentTime,
      isSeenByDoctor: false
    });

    res.status(201).json(appointment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Doctor Appointments (ONLY HIS)
export const getDoctorAppointments = async (req, res) => {
  try {

    const doctorProfile = await Doctor.findOne({
      user: req.user._id
    });

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({
      doctor: doctorProfile._id
    })
      .populate("patient", "name email")
      .populate("hospital", "name");

    res.status(200).json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Update Status (Doctor + Patient + Admin)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // ===============================
    // 🔹 PATIENT LOGIC
    // ===============================
    if (req.user.role === "patient") {

      if (appointment.patient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }


      appointment.status = "cancelled_by_patient";
      await appointment.save();

      return res.json({ message: "Appointment cancelled", appointment });
    }

    // ===============================
    // 🔹 DOCTOR LOGIC
    // ===============================

    if (req.user.role === "doctor") {

      const doctorProfile = await Doctor.findOne({
        user: req.user._id
      });

      if (!doctorProfile)
        return res.status(404).json({ message: "Doctor profile not found" });

      if (appointment.doctor.toString() !== doctorProfile._id.toString())
        return res.status(403).json({ message: "Not authorized" });

      // 🔥 TIME LOGIC (IMPORTANT)
      const now = new Date();

      const appointmentDateTime = new Date(
        `${appointment.appointmentDate.toISOString().split("T")[0]}T${appointment.appointmentTime}`
      );

      // ❌ FINAL STATES BLOCK
      if (["rejected", "completed", "cancelled_by_patient"].includes(appointment.status)) {
        return res.status(400).json({
          message: "This appointment is already finalized"
        });
      }

      // ===============================
      // 🔥 BEFORE APPOINTMENT TIME
      // ===============================
      if (now < appointmentDateTime) {

        // ONLY allow approve/reject
        if (!["approved", "rejected"].includes(status)) {
          return res.status(400).json({
            message: "Before appointment, only approve/reject allowed"
          });
        }
      }

      // ===============================
      // 🔥 AFTER APPOINTMENT TIME
      // ===============================
      if (now >= appointmentDateTime) {

        // ❌ cannot approve/reject after time
        if (["approved", "rejected"].includes(status)) {
          return res.status(400).json({
            message: "Cannot approve/reject after appointment time"
          });
        }

        // ✅ only completed allowed
        if (status !== "completed") {
          return res.status(400).json({
            message: "Only completion is allowed after appointment time"
          });
        }

        // ❌ only approved → completed
        if (appointment.status !== "approved") {
          return res.status(400).json({
            message: "Only approved appointments can be completed"
          });
        }
      }

      // ✅ UPDATE
      await Appointment.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: status,
            isSeenByDoctor: true
          }
        }
      );

      return res.json({ message: "Status updated successfully" });
    }
    // ===============================
    // 🔹 ADMIN LOGIC
    // ===============================
    if (req.user.role === "admin") {

      const now = new Date();

      const appointmentDateTime = new Date(
        `${appointment.appointmentDate.toISOString().split("T")[0]}T${appointment.appointmentTime}`
      );

      // ❌ FINAL STATES BLOCK
      if (["rejected", "completed", "cancelled_by_patient"].includes(appointment.status)) {
        return res.status(400).json({
          message: "This appointment is already finalized"
        });
      }

      // ===============================
      // 🔥 BEFORE TIME
      // ===============================
      if (now < appointmentDateTime) {

        if (!["approved", "rejected"].includes(status)) {
          return res.status(400).json({
            message: "Before appointment, only approve/reject allowed"
          });
        }
      }

      // ===============================
      // 🔥 AFTER TIME
      // ===============================
      if (now >= appointmentDateTime) {

        // ❌ cannot approve/reject
        if (["approved", "rejected"].includes(status)) {
          return res.status(400).json({
            message: "Cannot approve/reject after appointment time"
          });
        }

        // ✅ only completed allowed
        if (status !== "completed") {
          return res.status(400).json({
            message: "Only completion allowed after appointment"
          });
        }

        // ❌ must be approved first
        if (appointment.status !== "approved") {
          return res.status(400).json({
            message: "Only approved appointments can be completed"
          });
        }
      }

      appointment.status = status;
      await appointment.save();

      return res.json({ message: "Status updated by admin", appointment });
    }
    // ❌ if no role matched
    return res.status(403).json({ message: "Forbidden" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Patient Appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id
    })
      .populate("doctor", "name")
      .populate("hospital", "name");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin - Get All Appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name")
      .populate("patient", "name email")
      .populate("hospital", "name");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Book Appointment (with validation)
export const bookAppointment = async (req, res) => {
  try {

    const { appointmentDate, appointmentTime } = req.body;

    const doctor = await Doctor.findById(req.params.doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const selectedDay = new Date(appointmentDate)
      .toLocaleDateString("en-US", { weekday: "long" });

    if (!doctor.availableDays
      .map(d => d.toLowerCase())
      .includes(selectedDay.toLowerCase())) {

      return res.status(400).json({
        message: `Doctor is not available on ${selectedDay}`
      });
    }

    const [h, m] = appointmentTime.split(":").map(Number);
    const selectedMinutes = h * 60 + m;

    const [startH, startM] = doctor.startTime.split(":").map(Number);
    const [endH, endM] = doctor.endTime.split(":").map(Number);
    const [lunchH, lunchM] = doctor.lunchStart.split(":").map(Number);
    const [lunchEH, lunchEM] = doctor.lunchEnd.split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const lunchStartMin = lunchH * 60 + lunchM;
    const lunchEndMin = lunchEH * 60 + lunchEM;

    if (selectedMinutes < startMinutes || selectedMinutes >= endMinutes) {
      return res.status(400).json({
        message: "Selected time is outside doctor's working hours."
      });
    }

    if (selectedMinutes >= lunchStartMin && selectedMinutes < lunchEndMin) {
      return res.status(400).json({
        message: "Doctor is on lunch break at this time."
      });
    }

    const existingAppointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate
    });

    for (let appt of existingAppointments) {
      const [eh, em] = appt.appointmentTime.split(":").map(Number);
      const bookedMinutes = eh * 60 + em;

      if (Math.abs(bookedMinutes - selectedMinutes) < doctor.slotDuration) {
        return res.status(400).json({
          message: "Please choose another time. Slot already booked."
        });
      }
    }

    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctor._id,
      hospital: doctor.hospitalId,
      appointmentDate,
      appointmentTime
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Booked Slots
export const getBookedSlots = async (req, res) => {
  try {

    console.log("Logged in user:", req.user);
    console.log("Logged in user:", req.user);
    const { doctorId, date } = req.query;

    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: date
    });

    const bookedTimes = appointments.map(a => a.appointmentTime);

    res.json(bookedTimes);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/appointments/unseen-count
export const getUnseenCount = async (req, res) => {
  try {

    const doctorProfile = await Doctor.findOne({
      user: req.user._id
    });

    if (!doctorProfile) {
      return res.json({ count: 0 });
    }

    const count = await Appointment.countDocuments({
      doctor: doctorProfile._id,
      isSeenByDoctor: false
    });

    res.json({ count });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/appointments/mark-seen

export const markAllSeen = async (req, res) => {
  try {

    console.log("🔥 USER:", req.user);

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Find doctor profile
    const doctorProfile = await Doctor.findOne({
      user: req.user._id
    });

    if (!doctorProfile) {
      console.log("❌ Doctor not found for user:", req.user._id);
      return res.status(404).json({
        message: "Doctor profile not found"
      });
    }

    console.log("✅ Doctor ID:", doctorProfile._id);

    // ✅ Ensure ObjectId (VERY IMPORTANT FIX)
    const doctorId = new mongoose.Types.ObjectId(doctorProfile._id);

    // ✅ Update safely
    const result = await Appointment.updateMany(
      { doctor: doctorId },
      { $set: { isSeenByDoctor: true } }
    );

    console.log("🔥 Updated count:", result.modifiedCount);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as seen",
      updated: result.modifiedCount
    });

  } catch (error) {
    console.error("❌ MARK SEEN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

