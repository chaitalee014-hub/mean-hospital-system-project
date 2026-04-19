import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import specialistRoutes from "./routes/specialist.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";

// Models
import User from "./models/user.model.js";

dotenv.config();

const app = express();

/* ===============================
   DATABASE CONNECTION
================================= */
connectDB();

/* ===============================
   MIDDLEWARE
================================= */
app.use(express.json());

app.use(cors({
  origin: "*",// change after deploy
  credentials: true
}));

/* ===============================
   ROUTES
================================= */
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/specialists", specialistRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

/* ===============================
   TEST ROUTE
================================= */
app.get("/test", (req, res) => {
  res.send("Server working");
});

/* ===============================
   CREATE ADMIN IF NOT EXISTS
================================= */
const createAdminIfNotExists = async () => {
  try {
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      await User.create({
        name: "Admin",
        email: "admin@hospital.com",
        password: "admin123",
        role: "admin"
      });

      console.log("✅ Admin created automatically");
    }
  } catch (err) {
    console.log("Admin creation error:", err.message);
  }
};

/* ===============================
   START SERVER (AFTER DB CONNECT)
================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await createAdminIfNotExists();
});