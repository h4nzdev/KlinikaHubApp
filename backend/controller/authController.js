import database from "../config/database.js";

class AuthController {
  constructor() {
    this.db = database.getDatabase();
  }

  // Patient Login (Simple - just check email/password)
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
            // Success - return patient data (without password)
            resolve({
              success: true,
              patient: {
                id: patient.id,
                name: `${patient.first_name} ${patient.last_name}`,
                email: patient.email,
                mobileno: patient.mobileno,
                role: "patient",
              },
            });
          }
        }
      );
    });
  }

  // Check if patient exists (for registration)
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
