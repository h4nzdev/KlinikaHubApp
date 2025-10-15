import express from "express";
import authController from "../controller/authController.js";

const authRouter = express.Router();

// ✅ NEW: Request verification code
authRouter.post("/request-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await authController.requestVerificationCode(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ NEW: Verify code and register
authRouter.post("/verify-and-register", async (req, res) => {
  try {
    const { email, code, patientData } = req.body;

    if (!email || !code || !patientData) {
      return res.status(400).json({
        error: "Email, verification code, and patient data are required",
      });
    }

    const result = await authController.verifyAndRegister(
      email,
      code,
      patientData
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ NEW: Resend verification code
authRouter.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await authController.resendVerificationCode(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ⚠️ UPDATE: Old register route (keep for backward compatibility or remove)
authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, first_name, last_name, mobileno } = req.body;

    // Basic validation - using model field names
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        error: "Email, password, first name, and last name are required",
      });
    }

    // Check if email already exists
    const exists = await authController.checkPatientExists(email);
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const result = await authController.register(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Patient Login (unchanged but uses updated controller)
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

// Upload photo
authRouter.post("/upload-photo", async (req, res) => {
  try {
    const { image } = req.body; // base64 image string

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    const photoUrl = await authController.uploadPatientPhoto(image);

    res.json({
      success: true,
      photoUrl,
    });
  } catch (error) {
    console.error("❌ Upload photo error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default authRouter;
