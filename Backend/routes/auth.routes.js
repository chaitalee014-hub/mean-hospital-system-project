import express from "express";
import { signup,login,googleLogin} from "../controllers/auth.controller.js";

const router = express.Router();

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);


router.post("/google",googleLogin);


export default router;
