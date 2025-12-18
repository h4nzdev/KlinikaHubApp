import express from "express";
import appointmentController from "../controller/appointment-controller.js";

const router = express.Router();

// POST book appointment directly to klinikah_demo
router.post("/appointments", async (req, res) => {
  try {
    const result = await appointmentController.bookAppointment(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET appointments from klinikah_demo
router.get("/appointments", async (req, res) => {
  try {
    const filters = {
      clinic_id: req.query.clinic_id,
      patient_id: req.query.patient_id,
      doctor_id: req.query.doctor_id,
      status: req.query.status,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
    };

    const result = await appointmentController.getAppointments(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// PUT update appointment in klinikah_demo
router.put("/appointments/:id", async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id);
    const result = await appointmentController.updateAppointment(
      appointmentId,
      req.body
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE appointment from klinikah_demo
router.delete("/appointments/:id", async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id);
    const result = await appointmentController.deleteAppointment(appointmentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
