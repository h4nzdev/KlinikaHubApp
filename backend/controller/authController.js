import database from "../config/database.js";
import Patient from "../model/Patient.js";

class AuthController {
  constructor() {
    this.db = database.getDatabase();
  }

  // Patient Registration (with all model fields)
  async register(patientData) {
    return new Promise((resolve, reject) => {
      // Filter out id and timestamp fields (auto-generated)
      const insertableColumns = Object.keys(Patient.columns).filter(
        (key) => !["id", "created_at", "updated_at"].includes(key)
      );

      const columns = insertableColumns.join(", ");
      const placeholders = insertableColumns.map(() => "?").join(", ");

      const values = insertableColumns.map((key) => {
        // Provide default values for required fields if missing
        if (key === "patient_id" && !patientData[key]) {
          return `PAT${Date.now()}`; // Generate unique patient ID
        }
        if (key === "category_id" && !patientData[key]) {
          return 1; // Default category
        }
        if (key === "source" && !patientData[key]) {
          return 1; // Default source
        }
        return patientData[key] || null;
      });

      const sql = `INSERT INTO patients (${columns}) VALUES (${placeholders})`;

      this.db.run(sql, values, function (err) {
        if (err) {
          console.log("❌ Patient registration error:", err);
          reject(err);
        } else {
          console.log("✅ Patient registered with ID:", this.lastID);
          resolve({
            success: true,
            patient: {
              id: this.lastID,
              ...patientData,
            },
          });
        }
      });
    });
  }

  // Patient Login (unchanged)
  async login(email, password) {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM patients WHERE email = ? AND password = ?",
        [email, password],
        (err, patient) => {
          if (err) {
            console.log("❌ Login error:", err);
            reject(err);
          } else if (!patient) {
            reject(new Error("Invalid email or password"));
          } else {
            resolve({
              success: true,
              patient: {
                id: patient.id,
                first_name: patient.first_name,
                last_name: patient.last_name,
                email: patient.email,
                mobileno: patient.mobileno,
                age: patient.age,
                address: patient.address,
                role: "patient",
              },
            });
          }
        }
      );
    });
  }

  // Check if patient exists
  async checkPatientExists(email) {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT id FROM patients WHERE email = ?",
        [email],
        (err, patient) => {
          if (err) reject(err);
          else resolve(!!patient);
        }
      );
    });
  }
}

export default new AuthController();
