import database from "../config/database.js";
import Clinic from "../model/Clinic.js";

// Clinic Controller for Node.js/Express
class ClinicController {
  constructor() {
    this.db = database.getDatabase();
  }

  // Initialize clinic table
  async initTable() {
    return new Promise((resolve, reject) => {
      this.db.run(Clinic.getCreateTableSQL(), (err) => {
        if (err) {
          console.log("❌ Table init error:", err);
          reject(err);
        } else {
          console.log("✅ Clinic table initialized");
          resolve();
        }
      });
    });
  }

  // Create a new clinic
  async createClinic(clinicData) {
    return new Promise((resolve, reject) => {
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

      const sql = `INSERT INTO global_settings (${columns}) VALUES (${placeholders})`;

      this.db.run(sql, values, function (err) {
        if (err) {
          console.log("❌ Clinic creation error:", err);
          reject(err);
        } else {
          console.log("✅ Clinic created with ID:", this.lastID);
          resolve({ id: this.lastID, ...clinicData });
        }
      });
    });
  }

  // Get all clinics
  async getAllClinics() {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM global_settings ORDER BY created_at DESC",
        [],
        (err, rows) => {
          if (err) {
            console.log("❌ Clinics fetch error:", err);
            reject(err);
          } else {
            // Parse JSON fields for categories and specialties
            const clinics = rows.map((clinic) => this.parseClinicData(clinic));
            console.log("✅ Clinics found:", clinics.length);
            resolve(clinics);
          }
        }
      );
    });
  }

  // Get clinic by ID
  async getClinicById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM global_settings WHERE id = ?",
        [id],
        (err, row) => {
          if (err) {
            console.log("❌ Clinic find error:", err);
            reject(err);
          } else {
            const clinic = row ? this.parseClinicData(row) : null;
            resolve(clinic);
          }
        }
      );
    });
  }

  // Get clinic by name
  async getClinicByName(name) {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM global_settings WHERE institute_name = ?",
        [name],
        (err, row) => {
          if (err) {
            console.log("❌ Clinic name search error:", err);
            reject(err);
          } else {
            const clinic = row ? this.parseClinicData(row) : null;
            resolve(clinic);
          }
        }
      );
    });
  }

  // GET CLINICS BY CATEGORY
  async getClinicsByCategory(category) {
    return new Promise((resolve, reject) => {
      if (category === "All") {
        // If 'All', return all clinics
        this.getAllClinics().then(resolve).catch(reject);
        return;
      }

      // Search in primary_category or categories JSON array
      const sql = `
        SELECT * FROM global_settings 
        WHERE primary_category = ? 
        OR categories LIKE ?
        ORDER BY created_at DESC
      `;

      const categoryPattern = `%"${category}"%`; // For JSON array search

      this.db.all(sql, [category, categoryPattern], (err, rows) => {
        if (err) {
          console.log("❌ Clinics by category error:", err);
          reject(err);
        } else {
          // Parse JSON fields
          const clinics = rows.map((clinic) => this.parseClinicData(clinic));
          console.log(
            `✅ Found ${clinics.length} clinics in category: ${category}`
          );
          resolve(clinics);
        }
      });
    });
  }

  // GET ALL UNIQUE CATEGORIES
  async getAllCategories() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT DISTINCT primary_category 
        FROM global_settings 
        WHERE primary_category IS NOT NULL AND primary_category != ''
        UNION
        SELECT DISTINCT json_each.value as primary_category
        FROM global_settings, json_each(categories)
        WHERE categories IS NOT NULL AND categories != '[]'
      `;

      this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.log("❌ Categories fetch error:", err);
          reject(err);
        } else {
          const categories = rows
            .map((row) => row.primary_category)
            .filter(Boolean);
          console.log("✅ Found categories:", categories);
          resolve(categories);
        }
      });
    });
  }

  // Update clinic
  async updateClinic(id, clinicData) {
    return new Promise((resolve, reject) => {
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

      const sql = `UPDATE global_settings SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

      this.db.run(sql, values, function (err) {
        if (err) {
          console.log("❌ Clinic update error:", err);
          reject(err);
        } else {
          console.log("✅ Clinic updated:", id);
          resolve({ id, ...clinicData });
        }
      });
    });
  }

  // Delete clinic
  async deleteClinic(id) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "DELETE FROM global_settings WHERE id = ?",
        [id],
        function (err) {
          if (err) {
            console.log("❌ Clinic delete error:", err);
            reject(err);
          } else {
            console.log("✅ Clinic deleted:", id);
            resolve({ deletedId: id });
          }
        }
      );
    });
  }

  // HELPER METHOD: Parse clinic data (JSON fields)
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
