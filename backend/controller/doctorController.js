import database from "../config/database.js";
import Doctor from "../model/Doctor.js";

// Doctor Controller for Node.js/Express
class DoctorController {
  constructor() {
    this.db = database.getDatabase();
  }

  // Initialize doctor table
  async initTable() {
    return new Promise((resolve, reject) => {
      this.db.run(Doctor.getCreateTableSQL(), (err) => {
        if (err) {
          console.log("❌ Doctor table init error:", err);
          reject(err);
        } else {
          console.log("✅ Doctor table initialized");
          resolve();
        }
      });
    });
  }

  // Create a new doctor
  async createDoctor(doctorData) {
    return new Promise((resolve, reject) => {
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

      this.db.run(sql, values, function (err) {
        if (err) {
          console.log("❌ Doctor creation error:", err);
          reject(err);
        } else {
          console.log("✅ Doctor created with ID:", this.lastID);
          resolve({ id: this.lastID, ...doctorData });
        }
      });
    });
  }

  // Get all doctors
  async getAllDoctors() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ${Doctor.tableName} ORDER BY created_at DESC`,
        [],
        (err, rows) => {
          if (err) {
            console.log("❌ Doctors fetch error:", err);
            reject(err);
          } else {
            // Parse JSON fields
            const doctors = rows.map((doctor) => this.parseDoctorData(doctor));
            console.log("✅ Doctors found:", doctors.length);
            resolve(doctors);
          }
        }
      );
    });
  }

  // Get doctor by ID
  async getDoctorById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM ${Doctor.tableName} WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            console.log("❌ Doctor find error:", err);
            reject(err);
          } else {
            const doctor = row ? this.parseDoctorData(row) : null;
            resolve(doctor);
          }
        }
      );
    });
  }

  // Get doctor by staff_id
  async getDoctorByStaffId(staffId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM ${Doctor.tableName} WHERE staff_id = ?`,
        [staffId],
        (err, row) => {
          if (err) {
            console.log("❌ Doctor staff_id search error:", err);
            reject(err);
          } else {
            const doctor = row ? this.parseDoctorData(row) : null;
            resolve(doctor);
          }
        }
      );
    });
  }

  // Get doctors by department
  async getDoctorsByDepartment(departmentId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ${Doctor.tableName} WHERE department = ? ORDER BY name ASC`,
        [departmentId],
        (err, rows) => {
          if (err) {
            console.log("❌ Doctors by department error:", err);
            reject(err);
          } else {
            const doctors = rows.map((doctor) => this.parseDoctorData(doctor));
            console.log(
              `✅ Found ${doctors.length} doctors in department: ${departmentId}`
            );
            resolve(doctors);
          }
        }
      );
    });
  }

  // Get active doctors
  async getActiveDoctors() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ${Doctor.tableName} WHERE is_active = 1 ORDER BY name ASC`,
        [],
        (err, rows) => {
          if (err) {
            console.log("❌ Active doctors fetch error:", err);
            reject(err);
          } else {
            const doctors = rows.map((doctor) => this.parseDoctorData(doctor));
            resolve(doctors);
          }
        }
      );
    });
  }

  // Update doctor
  async updateDoctor(id, doctorData) {
    return new Promise((resolve, reject) => {
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

      this.db.run(sql, values, function (err) {
        if (err) {
          console.log("❌ Doctor update error:", err);
          reject(err);
        } else {
          console.log("✅ Doctor updated:", id);
          resolve({ id, ...doctorData });
        }
      });
    });
  }

  // Delete doctor (soft delete by setting is_active to 0)
  async deleteDoctor(id) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE ${Doctor.tableName} SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [id],
        function (err) {
          if (err) {
            console.log("❌ Doctor delete error:", err);
            reject(err);
          } else {
            console.log("✅ Doctor deactivated:", id);
            resolve({ deletedId: id });
          }
        }
      );
    });
  }

  // HELPER METHOD: Parse doctor data (JSON fields)
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

  // Add this to your DoctorController
  async recreateTable() {
    return new Promise((resolve, reject) => {
      // Drop existing table
      this.db.run(`DROP TABLE IF EXISTS ${Doctor.tableName}`, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Create new table with updated schema
        this.db.run(Doctor.getCreateTableSQL(), (err) => {
          if (err) {
            reject(err);
          } else {
            console.log("✅ Doctor table recreated with clinic_id");
            resolve();
          }
        });
      });
    });
  }

  // @route   GET /api/doctors/clinic/:clinicId
  // @desc    Get doctors by clinic ID
  // @access  Public
  async getDoctorsByClinicId(clinicId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ${Doctor.tableName} WHERE clinic_id = ? ORDER BY name ASC`,
        [clinicId],
        (err, rows) => {
          if (err) {
            console.log("❌ Doctors by clinic error:", err);
            reject(err);
          } else {
            // Parse JSON fields
            const doctors = rows.map((doctor) => this.parseDoctorData(doctor));
            console.log(
              `✅ Found ${doctors.length} doctors for clinic: ${clinicId}`
            );
            resolve(doctors);
          }
        }
      );
    });
  }
}

// Export controller instance
export default new DoctorController();
