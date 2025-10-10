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
  // Patient Login with specific error messages
  async login(email, password) {
    return new Promise((resolve, reject) => {
      // Check if email is provided
      if (!email || email.trim() === "") {
        reject(new Error("Email is required"));
        return;
      }

      // Check if password is provided
      if (!password || password.trim() === "") {
        reject(new Error("Password is required"));
        return;
      }

      // Check if email format is valid
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        reject(new Error("Please enter a valid email address"));
        return;
      }

      // Check if password meets minimum length
      if (password.length < 6) {
        reject(new Error("Password must be at least 6 characters"));
        return;
      }

      this.db.get(
        "SELECT * FROM patients WHERE email = ?",
        [email],
        (err, patient) => {
          if (err) {
            console.log("❌ Login error:", err);
            reject(new Error("Database error occurred"));
          } else if (!patient) {
            reject(new Error("No account found with this email address"));
          } else if (patient.password !== password) {
            reject(new Error("Incorrect password. Please try again"));
          } else {
            resolve({
              success: true,
              patient: {
                ...patient,
                password: undefined,
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
