import express from "express";
import appointmentController from "../controller/appointmentController.js";

const appointmentRouter = express.Router();

// @route   POST /api/appointments/:clinicId
// @desc    Create or update appointment
// @access  Public
appointmentRouter.post("/:clinicId", async (req, res) => {
  try {
    const appointmentId = await appointmentController.save(
      req.params.clinicId,
      req.body
    );
    res.status(201).json({
      success: true,
      id: appointmentId,
      message: "Appointment saved successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/:clinicId
// @desc    Get appointments for a clinic with optional filters
// @access  Public
appointmentRouter.get("/:clinicId", async (req, res) => {
  try {
    const filters = {
      patient_id: req.query.patient_id,
      doctor_id: req.query.doctor_id,
      status: req.query.status,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      limit: req.query.limit,
    };

    const appointments = await appointmentController.getByClinic(
      req.params.clinicId,
      filters
    );

    res.json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/:clinicId/:id
// @desc    Get single appointment by ID
// @access  Public
appointmentRouter.get("/:clinicId/:id", async (req, res) => {
  try {
    const appointment = await appointmentController.getById(
      req.params.clinicId,
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/:clinicId/patient/:patientId
// @desc    Get patient's appointments
// @access  Public
appointmentRouter.get("/:clinicId/patient/:patientId", async (req, res) => {
  try {
    const appointments = await appointmentController.getByPatient(
      req.params.clinicId,
      req.params.patientId
    );

    res.json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/:clinicId/doctor/:doctorId
// @desc    Get doctor's appointments
// @access  Public
appointmentRouter.get("/:clinicId/doctor/:doctorId", async (req, res) => {
  try {
    const appointments = await appointmentController.getByDoctor(
      req.params.clinicId,
      req.params.doctorId
    );

    res.json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/:clinicId/doctors
// @desc    Get doctors list
// @access  Public
appointmentRouter.get("/:clinicId/doctors", async (req, res) => {
  try {
    const doctors = await appointmentController.getDoctors(req.params.clinicId);
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/:clinicId/doctor/:doctorId/slots/:date
// @desc    Get available time slots for doctor on specific date
// @access  Public
appointmentRouter.get(
  "/:clinicId/doctor/:doctorId/slots/:date",
  async (req, res) => {
    try {
      const slots = await appointmentController.getAvailableSlots(
        req.params.clinicId,
        req.params.doctorId,
        req.params.date
      );

      res.json({ success: true, data: slots });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   GET /api/appointments/:clinicId/doctor/:doctorId/schedule
// @desc    Get doctor's schedule
// @access  Public
appointmentRouter.get(
  "/:clinicId/doctor/:doctorId/schedule",
  async (req, res) => {
    try {
      const schedule = await appointmentController.getDoctorSchedule(
        req.params.clinicId,
        req.params.doctorId
      );

      res.json({ success: true, data: schedule });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   PATCH /api/appointments/:clinicId/:id/status
// @desc    Update appointment status
// @access  Public
appointmentRouter.patch("/:clinicId/:id/status", async (req, res) => {
  try {
    const { status, schedule } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const success = await appointmentController.updateStatus(
      req.params.clinicId,
      req.params.id,
      status,
      schedule
    );

    res.json({
      success: true,
      updated: success,
      message: "Appointment status updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/appointments/:clinicId/:id
// @desc    Delete appointment
// @access  Public
appointmentRouter.delete("/:clinicId/:id", async (req, res) => {
  try {
    const success = await appointmentController.delete(
      req.params.clinicId,
      req.params.id
    );

    res.json({
      success: true,
      deleted: success,
      message: success ? "Appointment deleted" : "Appointment not found",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/appointments/:clinicId/check-schedule
// @desc    Check if schedule slot is available
// @access  Public
appointmentRouter.post("/:clinicId/check-schedule", async (req, res) => {
  try {
    const { doctor_id, date, schedule } = req.body;

    if (!doctor_id || !date || !schedule) {
      return res.status(400).json({
        success: false,
        message: "doctor_id, date, and schedule are required",
      });
    }

    const isAvailable = await appointmentController.checkScheduleAvailability(
      req.params.clinicId,
      doctor_id,
      date,
      schedule
    );

    res.json({
      success: true,
      available: isAvailable,
      message: isAvailable ? "Slot available" : "Slot already booked",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/appointments/:clinicId/request
// @desc    Patient requests appointment (status = 4)
// @access  Public
appointmentRouter.post("/:clinicId/request", async (req, res) => {
  try {
    // Set status to REQUESTED (4) for patient requests
    const appointmentData = {
      ...req.body,
      status: 4, // REQUESTED status
    };

    const appointmentId = await appointmentController.save(
      req.params.clinicId,
      appointmentData
    );

    res.status(201).json({
      success: true,
      id: appointmentId,
      status: 4,
      message: "Appointment requested successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default appointmentRouter;
