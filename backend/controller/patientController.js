import database from "../config/database.js";
import Patient from "../model/Patient.js";
import cloudinary from "../config/cloudinary.js";

// Patient Controller for Node.js/Express
class PatientController {
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

  // Initialize patients table
  async initTable() {
    try {
      const db = await this.initDB();
      await db.execute(Patient.getCreateTableSQL());
      console.log("✅ Patients table initialized");
    } catch (err) {
      console.log("❌ Table init error:", err);
      throw err;
    }
  }

  // Create a new patient
  async createPatient(patientData) {
    try {
      const db = await this.initDB();
      const columns = Object.keys(Patient.columns).join(", ");
      const placeholders = Object.keys(Patient.columns)
        .map(() => "?")
        .join(", ");
      const values = Object.keys(Patient.columns).map(
        (key) => patientData[key] || null
      );

      const sql = `INSERT INTO patients (${columns}) VALUES (${placeholders})`;
      const [result] = await db.execute(sql, values);

      console.log("✅ Patient created with ID:", result.insertId);
      return { id: result.insertId, ...patientData };
    } catch (err) {
      console.log("❌ Patient creation error:", err);
      throw err;
    }
  }

  // Get all patients
  async getAllPatients() {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        "SELECT * FROM patients ORDER BY created_at DESC"
      );
      console.log("✅ Patients found:", rows.length);
      return rows;
    } catch (err) {
      console.log("❌ Patients fetch error:", err);
      throw err;
    }
  }

  // Get patient by ID
  async getPatientById(id) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute("SELECT * FROM patients WHERE id = ?", [
        id,
      ]);
      return rows[0] || null;
    } catch (err) {
      console.log("❌ Patient find error:", err);
      throw err;
    }
  }

  // Get patient by email
  async getPatientByEmail(email) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        "SELECT * FROM patients WHERE email = ?",
        [email]
      );
      return rows[0] || null;
    } catch (err) {
      console.log("❌ Patient email search error:", err);
      throw err;
    }
  }

  // Update patient
  // In patientController.js
  async updatePatient(id, patientData) {
    try {
      const db = await this.initDB();

      const updates = Object.keys(patientData)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = Object.keys(patientData)
        .filter((key) => key !== "id")
        .map((key) => patientData[key])
        .concat(id);

      // ✅ USE 'id' INSTEAD OF 'patient_id'
      const sql = `UPDATE patients SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

      const [result] = await db.execute(sql, values);

      console.log("✅ Update result:", result);
      return { id, ...patientData };
    } catch (err) {
      console.log("❌ Patient update error:", err);
      throw err;
    }
  }

  // Delete patient
  async deletePatient(id) {
    try {
      const db = await this.initDB();
      await db.execute("DELETE FROM patients WHERE id = ?", [id]);
      console.log("✅ Patient deleted:", id);
      return { deletedId: id };
    } catch (err) {
      console.log("❌ Patient delete error:", err);
      throw err;
    }
  }

  // Update profile picture
  async updateProfilePicture(patientId, base64Image) {
    try {
      const db = await this.initDB();
      console.log("🔄 Uploading profile picture for patient:", patientId);

      // Upload to Cloudinary
      const imageUrl = await this.uploadToCloudinary(base64Image);

      // Update patient record
      await db.execute(
        "UPDATE patients SET photo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [imageUrl, patientId]
      );

      console.log("✅ Profile picture updated for patient:", patientId);
      return {
        success: true,
        profile_picture: imageUrl,
      };
    } catch (error) {
      console.error("❌ Error updating profile picture:", error);
      throw error;
    }
  }

  async uploadToCloudinary(base64Image) {
    // ... keep your existing cloudinary code unchanged ...
    try {
      console.log("🔄 Starting Cloudinary upload...");
      console.log("🔧 Cloudinary Config Check:");
      console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
      console.log(
        "API Key:",
        process.env.CLOUDINARY_API_KEY
          ? "***" + process.env.CLOUDINARY_API_KEY.slice(-4)
          : "MISSING"
      );
      console.log(
        "API Secret:",
        process.env.CLOUDINARY_API_SECRET
          ? "***" + process.env.CLOUDINARY_API_SECRET.slice(-4)
          : "MISSING"
      );

      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64Image}`,
        {
          folder: "patient_profiles",
          resource_type: "image",
          transformation: [
            { width: 300, height: 300, crop: "fill" },
            { quality: "auto" },
            { format: "jpg" },
          ],
        }
      );

      console.log("✅ Cloudinary upload successful!");
      return result.secure_url;
    } catch (error) {
      console.error("❌ Cloudinary upload error details:");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Full error:", error);
      throw new Error("Failed to upload profile picture");
    }
  }
}

// Export controller instance
export default new PatientController();
