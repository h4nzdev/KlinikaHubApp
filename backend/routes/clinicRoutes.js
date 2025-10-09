import express from "express";
import clinicController from "../controller/clinicController.js";

const clinicRouter = express.Router();

// Initialize database table
clinicRouter.get("/init", async (req, res) => {
  try {
    await clinicController.initTable();
    res.json({ message: "Clinic table created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new clinic
clinicRouter.post("/", async (req, res) => {
  try {
    const result = await clinicController.createClinic(req.body);
    res.json({ message: "Clinic created", clinic: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all clinics
clinicRouter.get("/", async (req, res) => {
  try {
    const clinics = await clinicController.getAllClinics();
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get clinic by ID
clinicRouter.get("/:id", async (req, res) => {
  try {
    const clinic = await clinicController.getClinicById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update clinic
clinicRouter.put("/:id", async (req, res) => {
  try {
    const result = await clinicController.updateClinic(req.params.id, req.body);
    res.json({ message: "Clinic updated", clinic: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete clinic
clinicRouter.delete("/:id", async (req, res) => {
  try {
    await clinicController.deleteClinic(req.params.id);
    res.json({ message: "Clinic deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default clinicRouter;
