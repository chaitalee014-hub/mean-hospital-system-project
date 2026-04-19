import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    contactNumber: String,
    email: String,
    description: String,

    // ✅ GeoJSON Location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number] // [longitude, latitude]
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Hospital", hospitalSchema);