import express from "express";
import authController from "../controller/authController.js";

const authRouter = express.Router();

// Patient Login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = await authController.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Check if email exists
authRouter.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await authController.checkPatientExists(email);
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default authRouter;
