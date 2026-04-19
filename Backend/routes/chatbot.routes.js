import express from "express";
import { chatbotReply } from "../controllers/chatbot.controller.js";

const router = express.Router();   // ✅ ADD THIS

router.post("/", chatbotReply);
console.log("✅ Chatbot route loaded");

export default router;