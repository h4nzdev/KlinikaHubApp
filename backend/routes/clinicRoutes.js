import express from "express";
import clinicController from "../controller/clinicController.js";

const router = express.Router();

// Initialize clinic table
router.get("/clinics/init", async (req, res) => {
  try {
    await clinicController.initTable();
    res.json({
      success: true,
      message: "Clinic table initialized successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ALL CLINICS
router.get("/", async (req, res) => {
  try {
    console.log("🔄 Fetching all clinics...");
    const clinics = await clinicController.getAllClinics();
    res.json({ success: true, data: clinics });
  } catch (error) {
    console.error("❌ Get clinics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET CLINIC BY ID
router.get("/clinics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Fetching clinic with ID: ${id}`);

    const clinic = await clinicController.getClinicById(id);

    if (!clinic) {
      return res
        .status(404)
        .json({ success: false, message: "Clinic not found" });
    }

    res.json({ success: true, data: clinic });
  } catch (error) {
    console.error("❌ Get clinic by ID error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET CLINICS BY CATEGORY
router.get("/clinics/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`🔄 Fetching clinics in category: ${category}`);

    const clinics = await clinicController.getClinicsByCategory(category);
    res.json({ success: true, data: clinics });
  } catch (error) {
    console.error("❌ Get clinics by category error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ALL CATEGORIES
router.get("/categories", async (req, res) => {
  try {
    console.log("🔄 Fetching all categories...");
    const categories = await clinicController.getAllCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("❌ Get categories error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE NEW CLINIC
router.post("/clinics", async (req, res) => {
  try {
    const clinicData = req.body;
    console.log("🔄 Creating new clinic:", clinicData.institute_name);

    // Validate required fields
    if (
      !clinicData.institute_name ||
      !clinicData.institute_email ||
      !clinicData.address ||
      !clinicData.mobileno
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: institute_name, institute_email, address, mobileno",
      });
    }

    const newClinic = await clinicController.createClinic(clinicData);
    res.status(201).json({ success: true, data: newClinic });
  } catch (error) {
    console.error("❌ Create clinic error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE CLINIC
router.put("/clinics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const clinicData = req.body;
    console.log(`🔄 Updating clinic ID: ${id}`);

    // Check if clinic exists
    const existingClinic = await clinicController.getClinicById(id);
    if (!existingClinic) {
      return res
        .status(404)
        .json({ success: false, message: "Clinic not found" });
    }

    const updatedClinic = await clinicController.updateClinic(id, clinicData);
    res.json({ success: true, data: updatedClinic });
  } catch (error) {
    console.error("❌ Update clinic error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE CLINIC
router.delete("/clinics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Deleting clinic ID: ${id}`);

    // Check if clinic exists
    const existingClinic = await clinicController.getClinicById(id);
    if (!existingClinic) {
      return res
        .status(404)
        .json({ success: false, message: "Clinic not found" });
    }

    await clinicController.deleteClinic(id);
    res.json({ success: true, message: "Clinic deleted successfully" });
  } catch (error) {
    console.error("❌ Delete clinic error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// SEARCH CLINICS BY NAME
router.get("/search/clinics", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    console.log(`🔄 Searching clinics with query: ${q}`);

    // Get all clinics and filter by search query
    const allClinics = await clinicController.getAllClinics();
    const filteredClinics = allClinics.filter(
      (clinic) =>
        clinic.institute_name.toLowerCase().includes(q.toLowerCase()) ||
        clinic.address.toLowerCase().includes(q.toLowerCase()) ||
        clinic.primary_category.toLowerCase().includes(q.toLowerCase())
    );

    res.json({ success: true, data: filteredClinics });
  } catch (error) {
    console.error("❌ Search clinics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
