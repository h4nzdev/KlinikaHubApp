import express from "express";
import appointmentController from "../controller/appointmentController.js";

const appointmentRouter = express.Router();

// @route   GET /api/appointments/init
// @desc    Initialize appointment table
// @access  Public
appointmentRouter.get("/init", async (req, res) => {
  try {
    await appointmentController.initTable();
    res.json({
      success: true,
      message: "Appointment table initialized successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Public
appointmentRouter.post("/", async (req, res) => {
  try {
    const appointment = await appointmentController.createAppointment(req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments
// @desc    Get all appointments
// @access  Public
appointmentRouter.get("/", async (req, res) => {
  try {
    const appointments = await appointmentController.getAllAppointments();
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/today
// @desc    Get today's appointments
// @access  Public
appointmentRouter.get("/today", async (req, res) => {
  try {
    const appointments = await appointmentController.getTodaysAppointments();
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Public
appointmentRouter.get("/:id", async (req, res) => {
  try {
    const appointment = await appointmentController.getAppointmentById(
      req.params.id
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/patient/:patientId
// @desc    Get appointments by patient ID
// @access  Public
appointmentRouter.get("/patient/:patientId", async (req, res) => {
  try {
    const appointments = await appointmentController.getAppointmentsByPatientId(
      req.params.patientId
    );
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/doctor/:doctorId
// @desc    Get appointments by doctor ID
// @access  Public
appointmentRouter.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appointments = await appointmentController.getAppointmentsByDoctorId(
      req.params.doctorId
    );
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/date/:date
// @desc    Get appointments by date (YYYY-MM-DD format)
// @access  Public
appointmentRouter.get("/date/:date", async (req, res) => {
  try {
    const appointments = await appointmentController.getAppointmentsByDate(
      req.params.date
    );
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/status/:status
// @desc    Get appointments by status
// @access  Public
appointmentRouter.get("/status/:status", async (req, res) => {
  try {
    const appointments = await appointmentController.getAppointmentsByStatus(
      req.params.status
    );
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Public
appointmentRouter.put("/:id", async (req, res) => {
  try {
    const appointment = await appointmentController.updateAppointment(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/appointments/:id/status
// @desc    Update appointment status only
// @access  Public
appointmentRouter.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (status === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }
    const appointment = await appointmentController.updateAppointmentStatus(
      req.params.id,
      status
    );
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Public
appointmentRouter.delete("/:id", async (req, res) => {
  try {
    await appointmentController.deleteAppointment(req.params.id);
    res.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

appointmentRouter.get("/patient/:patientId/details", async (req, res) => {
  try {
    const appointments =
      await appointmentController.getAppointmentsByPatientIdWithDetails(
        req.params.patientId
      );
    res.json({
      success: true,
      data: appointments,
      message: `Found ${appointments.length} appointments with details`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/:id/details
// @desc    Get single appointment WITH clinic and doctor details
// @access  Public
appointmentRouter.get("/:id/details", async (req, res) => {
  try {
    const appointment = await appointmentController.getAppointmentWithDetails(
      req.params.id
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/with-details/all
// @desc    Get all appointments WITH clinic and doctor names
// @access  Public
appointmentRouter.get("/with-details/all", async (req, res) => {
  try {
    const appointments =
      await appointmentController.getAllAppointmentsWithDetails();
    res.json({
      success: true,
      data: appointments,
      message: `Found ${appointments.length} appointments with details`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/appointments/:id/reschedule
// @desc    Reschedule an appointment (update date and time)
// @access  Public
appointmentRouter.patch("/:id/reschedule", async (req, res) => {
  try {
    const { appointment_date, schedule } = req.body;

    if (!appointment_date || !schedule) {
      return res.status(400).json({
        success: false,
        message: "Both appointment_date and schedule are required",
      });
    }

    // Validate that the new date is not in the past
    const newDate = new Date(appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot reschedule to a past date",
      });
    }

    // If same day, validate time is not in the past
    if (newDate.getTime() === today.getTime()) {
      const newTime = new Date(schedule);
      const now = new Date();

      if (newTime < now) {
        return res.status(400).json({
          success: false,
          message: "Cannot reschedule to a past time on today's date",
        });
      }
    }

    const appointment = await appointmentController.rescheduleAppointment(
      req.params.id,
      appointment_date,
      schedule
    );

    res.json({
      success: true,
      data: appointment,
      message: "Appointment rescheduled successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default appointmentRouter;
