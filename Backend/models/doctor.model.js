import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  specialization: {
    type: String,
    required: true
  },

  qualification: {
    type: String,
    required: true
  },

  experience: {
    type: Number,
    required: true
  },

  consultationFee: {
    type: Number,
    required: true
  },

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  availableDays: {
    type: [String],
    required: true
  },

  startTime: {
    type: String,
    required: true
  },

  endTime: {
    type: String,
    required: true
  },

  slotDuration: {
    type: Number,
    default: 30
  },

  lunchStart: {
    type: String,
    required: true
  },

  lunchEnd: {
    type: String,
    required: true
  },
  
  isAvailable: {
    type: Boolean,
    default: true
  },

  leaveDates: {
    type: [String], 
    default: []
  },

  image: {
    type: String,

  }

}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);