import express from "express";
import { sendSMS } from "../controller/smsController.js";

const smsRouter = express.Router();

// POST /api/sms
smsRouter.post("/sms", sendSMS);

export default smsRouter;
