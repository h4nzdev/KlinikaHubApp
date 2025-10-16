import database from "../config/database.js";
import Clinic from "../model/Clinic.js";

// Clinic Controller for Node.js/Express
class ClinicController {
  constructor() {
    this.db = null;
  }

  // Initialize database connection
  async initDB() {
    if (!this.db) {
      this.db = await database.getDatabase();
    }
    return this.db;
  }

  // Initialize clinic table
  async initTable() {
    try {
      const db = await this.initDB();
      await db.execute(Clinic.getCreateTableSQL());
      console.log("✅ Clinic table initialized");
    } catch (err) {
      console.log("❌ Table init error:", err);
      throw err;
    }
  }

  // Create a new clinic
  async createClinic(clinicData) {
    try {
      const db = await this.initDB();
      // Handle categories field - convert array to JSON string if needed
      const processedData = { ...clinicData };

      if (processedData.categories && Array.isArray(processedData.categories)) {
        processedData.categories = JSON.stringify(processedData.categories);
      }

      if (
        processedData.specialties &&
        Array.isArray(processedData.specialties)
      ) {
        processedData.specialties = JSON.stringify(processedData.specialties);
      }

      const columns = Object.keys(Clinic.columns).join(", ");
      const placeholders = Object.keys(Clinic.columns)
        .map(() => "?")
        .join(", ");
      const values = Object.keys(Clinic.columns).map(
        (key) => processedData[key] || null
      );

      const sql = `INSERT INTO clinics (${columns}) VALUES (${placeholders})`;
      const [result] = await db.execute(sql, values);

      console.log("✅ Clinic created with ID:", result.insertId);
      return { id: result.insertId, ...clinicData };
    } catch (err) {
      console.log("❌ Clinic creation error:", err);
      throw err;
    }
  }

  // Get all clinics
  async getAllClinics() {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        "SELECT * FROM clinics ORDER BY created_at DESC"
      );
      // Parse JSON fields for categories and specialties
      const clinics = rows.map((clinic) => this.parseClinicData(clinic));
      console.log("✅ Clinics found:", clinics.length);
      return clinics;
    } catch (err) {
      console.log("❌ Clinics fetch error:", err);
      throw err;
    }
  }

  // Get clinic by ID
  async getClinicById(id) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        "SELECT * FROM clinics WHERE id = ?",
        [id]
      );
      const clinic = rows[0] ? this.parseClinicData(rows[0]) : null;
      return clinic;
    } catch (err) {
      console.log("❌ Clinic find error:", err);
      throw err;
    }
  }

  // Get clinic by name
  async getClinicByName(name) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        "SELECT * FROM clinics WHERE institute_name = ?",
        [name]
      );
      const clinic = rows[0] ? this.parseClinicData(rows[0]) : null;
      return clinic;
    } catch (err) {
      console.log("❌ Clinic name search error:", err);
      throw err;
    }
  }

  // GET CLINICS BY CATEGORY
  async getClinicsByCategory(category) {
    try {
      const db = await this.initDB();

      if (category === "All") {
        // If 'All', return all clinics
        return await this.getAllClinics();
      }

      // Search in primary_category or categories JSON array
      const sql = `
        SELECT * FROM clinics 
        WHERE primary_category = ? 
        OR JSON_CONTAINS(categories, ?)
        ORDER BY created_at DESC
      `;

      const [rows] = await db.execute(sql, [category, `"${category}"`]);
      // Parse JSON fields
      const clinics = rows.map((clinic) => this.parseClinicData(clinic));
      console.log(
        `✅ Found ${clinics.length} clinics in category: ${category}`
      );
      return clinics;
    } catch (err) {
      console.log("❌ Clinics by category error:", err);
      throw err;
    }
  }

  // GET ALL UNIQUE CATEGORIES
  async getAllCategories() {
    try {
      const db = await this.initDB();
      const sql = `
        SELECT DISTINCT primary_category 
        FROM clinics 
        WHERE primary_category IS NOT NULL AND primary_category != ''
        UNION
        SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(categories, CONCAT('$[', idx.idx, ']'))) as primary_category
        FROM clinics
        CROSS JOIN (
          SELECT 0 as idx UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
        ) idx
        WHERE categories IS NOT NULL AND categories != '[]'
        AND JSON_EXTRACT(categories, CONCAT('$[', idx.idx, ']')) IS NOT NULL
      `;

      const [rows] = await db.execute(sql);
      const categories = rows
        .map((row) => row.primary_category)
        .filter(Boolean);
      console.log("✅ Found categories:", categories);
      return categories;
    } catch (err) {
      console.log("❌ Categories fetch error:", err);
      throw err;
    }
  }

  // Update clinic
  async updateClinic(id, clinicData) {
    try {
      const db = await this.initDB();
      // Handle categories field - convert array to JSON string if needed
      const processedData = { ...clinicData };

      if (processedData.categories && Array.isArray(processedData.categories)) {
        processedData.categories = JSON.stringify(processedData.categories);
      }

      if (
        processedData.specialties &&
        Array.isArray(processedData.specialties)
      ) {
        processedData.specialties = JSON.stringify(processedData.specialties);
      }

      const updates = Object.keys(processedData)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = Object.keys(processedData)
        .filter((key) => key !== "id")
        .map((key) => processedData[key])
        .concat(id);

      const sql = `UPDATE clinics SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      await db.execute(sql, values);

      console.log("✅ Clinic updated:", id);
      return { id, ...clinicData };
    } catch (err) {
      console.log("❌ Clinic update error:", err);
      throw err;
    }
  }

  // Delete clinic
  async deleteClinic(id) {
    try {
      const db = await this.initDB();
      await db.execute("DELETE FROM clinics WHERE id = ?", [id]);
      console.log("✅ Clinic deleted:", id);
      return { deletedId: id };
    } catch (err) {
      console.log("❌ Clinic delete error:", err);
      throw err;
    }
  }

  // HELPER METHOD: Parse clinic data (JSON fields) - keep your existing method unchanged
  parseClinicData(clinic) {
    const parsedClinic = { ...clinic };

    // Parse categories JSON string to array
    if (parsedClinic.categories) {
      try {
        // Check if it's already an array
        if (Array.isArray(parsedClinic.categories)) {
          // It's already an array, keep it as is
        } else if (typeof parsedClinic.categories === "string") {
          // Try to parse if it's a string
          parsedClinic.categories = JSON.parse(parsedClinic.categories);
        }
      } catch (e) {
        console.log("❌ Error parsing categories:", e);
        parsedClinic.categories = [];
      }
    } else {
      parsedClinic.categories = [];
    }

    // Parse specialties JSON string to array
    if (parsedClinic.specialties) {
      try {
        // Check if it's already an array
        if (Array.isArray(parsedClinic.specialties)) {
          // It's already an array, keep it as is
        } else if (typeof parsedClinic.specialties === "string") {
          // If it's a comma-separated string, split it
          if (parsedClinic.specialties.includes(",")) {
            parsedClinic.specialties = parsedClinic.specialties
              .split(",")
              .map((s) => s.trim());
          } else {
            // Try to parse as JSON, if fails, make it a single-item array
            try {
              parsedClinic.specialties = JSON.parse(parsedClinic.specialties);
            } catch (e) {
              parsedClinic.specialties = [parsedClinic.specialties];
            }
          }
        }
      } catch (e) {
        console.log("❌ Error parsing specialties:", e);
        // If there's an error, treat it as a single specialty
        parsedClinic.specialties = [parsedClinic.specialties];
      }
    } else {
      parsedClinic.specialties = [];
    }

    return parsedClinic;
  }
}

// Export controller instance
export default new ClinicController();
