import express from "express";
import doctorController from "../controller/doctorController.js";

const doctorRouter = express.Router();

// @route   GET /api/doctors/clinic/:clinicId
// @desc    Get doctors by clinic ID
// @access  Public
doctorRouter.get("/clinic/:clinicId", async (req, res) => {
  try {
    const doctors = await doctorController.getDoctorsByClinicId(
      req.params.clinicId
    );
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// In doctorRoutes.js
doctorRouter.get("/recreate-table", async (req, res) => {
  try {
    await doctorController.recreateTable();
    res.json({ success: true, message: "Table recreated with clinic_id" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors/init
// @desc    Initialize doctor table
// @access  Public
doctorRouter.get("/init", async (req, res) => {
  try {
    await doctorController.initTable();
    res.json({
      success: true,
      message: "Doctor table initialized successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/doctors
// @desc    Create a new doctor
// @access  Public
doctorRouter.post("/", async (req, res) => {
  try {
    const doctor = await doctorController.createDoctor(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
doctorRouter.get("/", async (req, res) => {
  try {
    const doctors = await doctorController.getAllDoctors();
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors/active
// @desc    Get all active doctors
// @access  Public
doctorRouter.get("/active", async (req, res) => {
  try {
    const doctors = await doctorController.getActiveDoctors();
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
doctorRouter.get("/:id", async (req, res) => {
  try {
    const doctor = await doctorController.getDoctorById(req.params.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors/staff/:staffId
// @desc    Get doctor by staff ID
// @access  Public
doctorRouter.get("/staff/:staffId", async (req, res) => {
  try {
    const doctor = await doctorController.getDoctorByStaffId(
      req.params.staffId
    );
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors/department/:departmentId
// @desc    Get doctors by department
// @access  Public
doctorRouter.get("/department/:departmentId", async (req, res) => {
  try {
    const doctors = await doctorController.getDoctorsByDepartment(
      req.params.departmentId
    );
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/doctors/:id
// @desc    Update doctor
// @access  Public
doctorRouter.put("/:id", async (req, res) => {
  try {
    const doctor = await doctorController.updateDoctor(req.params.id, req.body);
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor (soft delete)
// @access  Public
doctorRouter.delete("/:id", async (req, res) => {
  try {
    await doctorController.deleteDoctor(req.params.id);
    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default doctorRouter;
