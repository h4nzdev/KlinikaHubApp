import database from "../config/database.js";
import Patient from "../model/Patient.js";

// Patient Controller for Node.js/Express
class PatientController {
  constructor() {
    this.db = database.getDatabase();
  }

  // Initialize patients table
  async initTable() {
    return new Promise((resolve, reject) => {
      this.db.run(Patient.getCreateTableSQL(), (err) => {
        if (err) {
          console.log("❌ Table init error:", err);
          reject(err);
        } else {
          console.log("✅ Patients table initialized");
          resolve();
        }
      });
    });
  }

  // Create a new patient
  async createPatient(patientData) {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(Patient.columns).join(", ");
      const placeholders = Object.keys(Patient.columns)
        .map(() => "?")
        .join(", ");
      const values = Object.keys(Patient.columns).map(
        (key) => patientData[key] || null
      );

      const sql = `INSERT INTO patients (${columns}) VALUES (${placeholders})`;

      this.db.run(sql, values, function (err) {
        if (err) {
          console.log("❌ Patient creation error:", err);
          reject(err);
        } else {
          console.log("✅ Patient created with ID:", this.lastID);
          resolve({ id: this.lastID, ...patientData });
        }
      });
    });
  }

  // Get all patients
  async getAllPatients() {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM patients ORDER BY created_at DESC",
        [],
        (err, rows) => {
          if (err) {
            console.log("❌ Patients fetch error:", err);
            reject(err);
          } else {
            console.log("✅ Patients found:", rows.length);
            resolve(rows);
          }
        }
      );
    });
  }

  // Get patient by ID
  async getPatientById(id) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM patients WHERE id = ?", [id], (err, row) => {
        if (err) {
          console.log("❌ Patient find error:", err);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  // Get patient by email
  async getPatientByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM patients WHERE email = ?",
        [email],
        (err, row) => {
          if (err) {
            console.log("❌ Patient email search error:", err);
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  // Update patient
  async updatePatient(id, patientData) {
    return new Promise((resolve, reject) => {
      const updates = Object.keys(patientData)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = Object.keys(patientData)
        .filter((key) => key !== "id")
        .map((key) => patientData[key])
        .concat(id);

      const sql = `UPDATE patients SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

      this.db.run(sql, values, function (err) {
        if (err) {
          console.log("❌ Patient update error:", err);
          reject(err);
        } else {
          console.log("✅ Patient updated:", id);
          resolve({ id, ...patientData });
        }
      });
    });
  }

  // Delete patient
  async deletePatient(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM patients WHERE id = ?", [id], function (err) {
        if (err) {
          console.log("❌ Patient delete error:", err);
          reject(err);
        } else {
          console.log("✅ Patient deleted:", id);
          resolve({ deletedId: id });
        }
      });
    });
  }
}

// Export controller instance
export default new PatientController();
