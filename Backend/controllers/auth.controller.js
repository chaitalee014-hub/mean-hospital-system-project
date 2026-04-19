import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

/* ===============================
   PATIENT SIGNUP ONLY
================================= */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create only PATIENT from signup
    const user = await User.create({
      name,
      email,
      password,          // auto hashed from model
      role: "patient"    // force patient
    });

    res.status(201).json({
      message: "Patient registered successfully"
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//google lohin

export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: "google-auth",
        role: "patient"
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: user.role,
      userId: user._id,
      name: user.name
    });

  } catch (err) {
    res.status(500).json({ message: "Google login failed" });
  }
};

/* ===============================
   LOGIN (ADMIN / DOCTOR / PATIENT)
================================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Use model method (better way)
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id,
      name: user.name
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
