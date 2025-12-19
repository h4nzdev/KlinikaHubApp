import express from "express";
import appointmentController from "../controller/appointment-controller.js";

const router = express.Router();

// ============ APPOINTMENT ROUTES ============

// POST /api/klinikah/60/appointments - Book appointment for clinic 60
router.post("/:clinic_id/appointments", async (req, res) => {
  try {
    const clinicId = parseInt(req.params.clinic_id);
    const result = await appointmentController.bookAppointment(
      clinicId,
      req.body
    );
    res.json(result);
  } catch (error) {
    console.error("❌ Route error (book appointment):", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/klinikah/60/appointments - Get all appointments for clinic 60
router.get("/:clinic_id/appointments", async (req, res) => {
  try {
    const clinicId = parseInt(req.params.clinic_id);
    const { start_date, end_date } = req.query;

    const result = await appointmentController.getAppointmentsByClinic(
      clinicId,
      true, // isStaff
      start_date || null,
      end_date || null
    );
    res.json(result);
  } catch (error) {
    console.error("❌ Route error (get appointments):", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// PUT /api/klinikah/60/appointments/:id/status - Update appointment status
router.put("/:clinic_id/appointments/:id/status", async (req, res) => {
  try {
    const clinicId = parseInt(req.params.clinic_id);
    const appointmentId = parseInt(req.params.id);
    const { status, schedule } = req.body;

    const result = await appointmentController.updateAppointmentStatus(
      clinicId,
      appointmentId,
      status,
      schedule
    );
    res.json(result);
  } catch (error) {
    console.error("❌ Route error (update status):", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/klinikah/60/appointments/patient/:patient_id - Patient's appointments
router.get("/:clinic_id/appointments/patient/:patient_id", async (req, res) => {
  try {
    const clinicId = parseInt(req.params.clinic_id);
    const patientId = parseInt(req.params.patient_id);

    const result = await appointmentController.getPatientAppointments(
      clinicId,
      patientId
    );
    res.json(result);
  } catch (error) {
    console.error("❌ Route error (patient appointments):", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE /api/klinikah/60/appointments/:id - Delete appointment
router.delete("/:clinic_id/appointments/:id", async (req, res) => {
  try {
    const clinicId = parseInt(req.params.clinic_id);
    const appointmentId = parseInt(req.params.id);

    // Check if deleteAppointment method exists, otherwise use direct query
    if (appointmentController.deleteAppointment) {
      const result = await appointmentController.deleteAppointment(
        clinicId,
        appointmentId
      );
      res.json(result);
    } else {
      // Fallback if method doesn't exist yet
      res.status(501).json({
        success: false,
        message: "Delete appointment method not implemented yet",
      });
    }
  } catch (error) {
    console.error("❌ Route error (delete appointment):", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/klinikah/60/appointments/requested - Get requested appointments
router.get("/:clinic_id/appointments/requested", async (req, res) => {
  try {
    const clinicId = parseInt(req.params.clinic_id);
    const { start_date, end_date } = req.query;

    // Check if getRequestedAppointments method exists
    if (appointmentController.getRequestedAppointments) {
      const result = await appointmentController.getRequestedAppointments(
        clinicId,
        start_date || null,
        end_date || null
      );
      res.json(result);
    } else {
      // Fallback: Get appointments with status = 4
      const result = await appointmentController.getAppointmentsByClinic(
        clinicId,
        true,
        start_date || null,
        end_date || null
      );

      if (result.success) {
        // Filter for status = 4
        const requestedAppointments = result.data.filter(
          (app) => app.status == 4
        );
        res.json({
          success: true,
          data: requestedAppointments,
          count: requestedAppointments.length,
          clinic: result.clinic,
        });
      } else {
        res.json(result);
      }
    }
  } catch (error) {
    console.error("❌ Route error (requested appointments):", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/klinikah/60/appointments/my-appointments - Patient books own appointment
router.post("/:clinic_id/appointments/my-appointments", async (req, res) => {
  try {
    const clinicId = parseInt(req.params.clinic_id);
    const { patient_id, doctor_id, appointment_date, schedule, remarks } =
      req.body;

    // Check if bookMyAppointment method exists
    if (appointmentController.bookMyAppointment) {
      const result = await appointmentController.bookMyAppointment(
        clinicId,
        patient_id,
        doctor_id,
        appointment_date,
        schedule,
        remarks
      );
      res.json(result);
    } else {
      // Fallback: Use regular booking with patient_id from body
      const appointmentData = {
        patient_id: patient_id,
        doctor_id: doctor_id,
        appointment_date: appointment_date,
        schedule: schedule,
        remarks: remarks || "",
        status: 4, // requested
      };

      const result = await appointmentController.bookAppointment(
        clinicId,
        appointmentData
      );
      res.json(result);
    }
  } catch (error) {
    console.error("❌ Route error (my appointments):", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
