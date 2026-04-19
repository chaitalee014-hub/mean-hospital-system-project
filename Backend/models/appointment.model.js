import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  appointmentDate: {
    type: Date,
    required: true
  },

  appointmentTime: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled_by_patient","completed"
    ],
    default: "pending"

  },
  isSeenByDoctor: {
  type: Boolean,
  default: false
} 

}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);