import express from "express";
import patientController from "../controller/patientController.js";

const patientRouter = express.Router();

// Initialize database table
patientRouter.get("/init", async (req, res) => {
  try {
    await patientController.initTable();
    res.json({ message: "Patients table created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new patient
patientRouter.post("/", async (req, res) => {
  try {
    const result = await patientController.createPatient(req.body);
    res.json({ message: "Patient created", patient: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all patients
patientRouter.get("/", async (req, res) => {
  try {
    const patients = await patientController.getAllPatients();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient by ID
patientRouter.get("/:id", async (req, res) => {
  try {
    const patient = await patientController.getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update patient
patientRouter.put("/:id", async (req, res) => {
  try {
    const result = await patientController.updatePatient(
      req.params.id,
      req.body
    );
    res.json({ message: "Patient updated", patient: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ NEW: Update patient profile picture
patientRouter.put("/:id/profile-picture", async (req, res) => {
  try {
    const { image } = req.body; // base64 image data
    const result = await patientController.updateProfilePicture(
      req.params.id,
      image
    );
    res.json({
      message: "Profile picture updated successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete patient
patientRouter.delete("/:id", async (req, res) => {
  try {
    await patientController.deletePatient(req.params.id);
    res.json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default patientRouter;
