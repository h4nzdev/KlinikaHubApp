import express from "express";
import { chatWithGemini, getEmergencyContacts } from "../controller/chatbot.js";

const chatRouter = express.Router();

// 🗣️ Main chat endpoint
chatRouter.post("/message", chatWithGemini);

// 🚨 Emergency contacts endpoint
chatRouter.post("/emergency-contacts", getEmergencyContacts);

export default chatRouter;
