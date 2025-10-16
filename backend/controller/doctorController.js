import database from "../config/database.js";
import Doctor from "../model/Doctor.js";

// Doctor Controller for Node.js/Express
class DoctorController {
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

  // Initialize doctor table
  async initTable() {
    try {
      const db = await this.initDB();
      await db.execute(Doctor.getCreateTableSQL());
      console.log("✅ Doctor table initialized");
    } catch (err) {
      console.log("❌ Doctor table init error:", err);
      throw err;
    }
  }

  // Create a new doctor
  async createDoctor(doctorData) {
    try {
      const db = await this.initDB();
      // Process JSON fields
      const processedData = { ...doctorData };

      if (
        processedData.specialties &&
        Array.isArray(processedData.specialties)
      ) {
        processedData.specialties = JSON.stringify(processedData.specialties);
      }

      // Build dynamic SQL
      const columns = Object.keys(Doctor.columns).join(", ");
      const placeholders = Object.keys(Doctor.columns)
        .map(() => "?")
        .join(", ");
      const values = Object.keys(Doctor.columns).map(
        (key) => processedData[key] || null
      );

      const sql = `INSERT INTO ${Doctor.tableName} (${columns}) VALUES (${placeholders})`;
      const [result] = await db.execute(sql, values);

      console.log("✅ Doctor created with ID:", result.insertId);
      return { id: result.insertId, ...doctorData };
    } catch (err) {
      console.log("❌ Doctor creation error:", err);
      throw err;
    }
  }

  // Get all doctors
  async getAllDoctors() {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Doctor.tableName} ORDER BY created_at DESC`
      );
      // Parse JSON fields
      const doctors = rows.map((doctor) => this.parseDoctorData(doctor));
      console.log("✅ Doctors found:", doctors.length);
      return doctors;
    } catch (err) {
      console.log("❌ Doctors fetch error:", err);
      throw err;
    }
  }

  // Get doctor by ID
  async getDoctorById(id) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Doctor.tableName} WHERE id = ?`,
        [id]
      );
      const doctor = rows[0] ? this.parseDoctorData(rows[0]) : null;
      return doctor;
    } catch (err) {
      console.log("❌ Doctor find error:", err);
      throw err;
    }
  }

  // Get doctor by staff_id
  async getDoctorByStaffId(staffId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Doctor.tableName} WHERE staff_id = ?`,
        [staffId]
      );
      const doctor = rows[0] ? this.parseDoctorData(rows[0]) : null;
      return doctor;
    } catch (err) {
      console.log("❌ Doctor staff_id search error:", err);
      throw err;
    }
  }

  // Get doctors by department
  async getDoctorsByDepartment(departmentId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Doctor.tableName} WHERE department = ? ORDER BY name ASC`,
        [departmentId]
      );
      const doctors = rows.map((doctor) => this.parseDoctorData(doctor));
      console.log(
        `✅ Found ${doctors.length} doctors in department: ${departmentId}`
      );
      return doctors;
    } catch (err) {
      console.log("❌ Doctors by department error:", err);
      throw err;
    }
  }

  // Get active doctors
  async getActiveDoctors() {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Doctor.tableName} WHERE is_active = 1 ORDER BY name ASC`
      );
      const doctors = rows.map((doctor) => this.parseDoctorData(doctor));
      return doctors;
    } catch (err) {
      console.log("❌ Active doctors fetch error:", err);
      throw err;
    }
  }

  // Update doctor
  async updateDoctor(id, doctorData) {
    try {
      const db = await this.initDB();
      // Process JSON fields
      const processedData = { ...doctorData };

      if (
        processedData.specialties &&
        Array.isArray(processedData.specialties)
      ) {
        processedData.specialties = JSON.stringify(processedData.specialties);
      }

      // Build dynamic update SQL
      const updates = Object.keys(processedData)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = Object.keys(processedData)
        .filter((key) => key !== "id")
        .map((key) => processedData[key])
        .concat(id);

      const sql = `UPDATE ${Doctor.tableName} SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      await db.execute(sql, values);

      console.log("✅ Doctor updated:", id);
      return { id, ...doctorData };
    } catch (err) {
      console.log("❌ Doctor update error:", err);
      throw err;
    }
  }

  // Delete doctor (soft delete by setting is_active to 0)
  async deleteDoctor(id) {
    try {
      const db = await this.initDB();
      await db.execute(
        `UPDATE ${Doctor.tableName} SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [id]
      );
      console.log("✅ Doctor deactivated:", id);
      return { deletedId: id };
    } catch (err) {
      console.log("❌ Doctor delete error:", err);
      throw err;
    }
  }

  // Get doctors by clinic ID
  async getDoctorsByClinicId(clinicId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Doctor.tableName} WHERE clinic_id = ? ORDER BY name ASC`,
        [clinicId]
      );
      const doctors = rows.map((doctor) => this.parseDoctorData(doctor));
      console.log(`✅ Found ${doctors.length} doctors for clinic: ${clinicId}`);
      return doctors;
    } catch (err) {
      console.log("❌ Doctors by clinic error:", err);
      throw err;
    }
  }

  // Recreate table
  async recreateTable() {
    try {
      const db = await this.initDB();
      // Drop existing table
      await db.execute(`DROP TABLE IF EXISTS ${Doctor.tableName}`);
      // Create new table with updated schema
      await db.execute(Doctor.getCreateTableSQL());
      console.log("✅ Doctor table recreated with clinic_id");
    } catch (err) {
      console.log("❌ Table recreation error:", err);
      throw err;
    }
  }

  // HELPER METHOD: Parse doctor data (JSON fields) - keep your existing method unchanged
  parseDoctorData(doctor) {
    const parsedDoctor = { ...doctor };

    // Parse specialties JSON string to array
    if (parsedDoctor.specialties) {
      try {
        if (Array.isArray(parsedDoctor.specialties)) {
          // Already an array
        } else if (typeof parsedDoctor.specialties === "string") {
          if (parsedDoctor.specialties.includes(",")) {
            // Comma-separated string
            parsedDoctor.specialties = parsedDoctor.specialties
              .split(",")
              .map((s) => s.trim());
          } else {
            // Try to parse as JSON
            try {
              parsedDoctor.specialties = JSON.parse(parsedDoctor.specialties);
            } catch (e) {
              parsedDoctor.specialties = [parsedDoctor.specialties];
            }
          }
        }
      } catch (e) {
        console.log("❌ Error parsing specialties:", e);
        parsedDoctor.specialties = [parsedDoctor.specialties];
      }
    } else {
      parsedDoctor.specialties = [];
    }

    return parsedDoctor;
  }
}

// Export controller instance
export default new DoctorController();
