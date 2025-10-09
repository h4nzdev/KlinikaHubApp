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
      const columns = Object.keys(Clinic.columns).join(", ");
      const placeholders = Object.keys(Clinic.columns)
        .map(() => "?")
        .join(", ");
      const values = Object.keys(Clinic.columns).map(
        (key) => clinicData[key] || null
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
            console.log("✅ Clinics found:", rows.length);
            resolve(rows);
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
            resolve(row || null);
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
            resolve(row || null);
          }
        }
      );
    });
  }

  // Update clinic
  async updateClinic(id, clinicData) {
    return new Promise((resolve, reject) => {
      const updates = Object.keys(clinicData)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = Object.keys(clinicData)
        .filter((key) => key !== "id")
        .map((key) => clinicData[key])
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
}

// Export controller instance
export default new ClinicController();
