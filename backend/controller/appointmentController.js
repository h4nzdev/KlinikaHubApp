import database from "../config/database.js";
import Appointment from "../model/Appointment.js";
import cron from "node-cron";

// Appointment Controller for Node.js/Express
class AppointmentController {
  constructor() {
    this.db = null;
    this.startAutoCancelCron();
  }

  // Initialize database connection
  async initDB() {
    if (!this.db) {
      this.db = await database.getDatabase();
    }
    return this.db;
  }

  // Initialize appointment table
  async initTable() {
    try {
      const db = await this.initDB();
      await db.execute(Appointment.getCreateTableSQL());
      console.log("✅ Appointment table initialized");
    } catch (err) {
      console.log("❌ Appointment table init error:", err);
      throw err;
    }
  }

  // NEW: Auto-cancel expired appointments
  async cancelExpiredAppointments() {
    try {
      const db = await this.initDB();
      const [result] = await db.execute(
        Appointment.getCancelExpiredAppointmentsSQL()
      );

      if (result.affectedRows > 0) {
        console.log(
          `✅ Auto-cancelled ${result.affectedRows} expired appointments`
        );
      }

      return {
        cancelledCount: result.affectedRows,
        message: `Cancelled ${result.affectedRows} expired appointments`,
      };
    } catch (err) {
      console.log("❌ Auto-cancel error:", err);
      throw err;
    }
  }

  // NEW: Check if specific appointment is expired
  async isAppointmentExpired(appointmentId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        Appointment.getIsAppointmentExpiredSQL(),
        [appointmentId]
      );

      return rows.length > 0 ? rows[0].is_expired === 1 : false;
    } catch (err) {
      console.log("❌ Check appointment expiry error:", err);
      return false;
    }
  }

  // NEW: Start cron job for auto-cancellation (runs every hour)
  startAutoCancelCron() {
    // Run every hour at minute 0
    cron.schedule("0 * * * *", async () => {
      try {
        console.log("🕒 Running auto-cancel cron job...");
        const result = await this.cancelExpiredAppointments();

        if (result.cancelledCount > 0) {
          console.log(
            `🕒 Auto-cancelled ${result.cancelledCount} expired appointments`
          );
          // You can emit socket event here if needed
          // req.io.emit("appointment_updated");
        }
      } catch (error) {
        console.error("❌ Error in auto-cancel cron job:", error);
      }
    });

    console.log("✅ Auto-cancel cron job started (runs every hour)");
  }

  // NEW: Cancel expired appointments for specific patient
  async cancelExpiredAppointmentsForPatient(patientId) {
    try {
      const db = await this.initDB();
      const sql = `
        UPDATE ${Appointment.tableName} 
        SET 
          status = 3, 
          cancellation_reason = 'Automatically cancelled - appointment date passed',
          auto_cancelled = TRUE
        WHERE 
          patient_id = ?
          AND status IN (0, 1)
          AND (
            (appointment_date < CURDATE()) 
            OR 
            (appointment_date = CURDATE() AND schedule < NOW())
          )
      `;

      const [result] = await db.execute(sql, [patientId]);

      if (result.affectedRows > 0) {
        console.log(
          `✅ Auto-cancelled ${result.affectedRows} expired appointments for patient: ${patientId}`
        );
      }

      return result.affectedRows;
    } catch (err) {
      console.log("❌ Patient-specific auto-cancel error:", err);
      return 0;
    }
  }

  // MODIFIED: Get appointments by patient ID - automatically check for expired ones first
  async getAppointmentsByPatientId(patientId) {
    try {
      // First, cancel any expired appointments for this patient
      await this.cancelExpiredAppointmentsForPatient(patientId);

      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Appointment.tableName} WHERE patient_id = ? ORDER BY appointment_date DESC`,
        [patientId]
      );
      console.log(
        `✅ Found ${rows.length} appointments for patient: ${patientId}`
      );
      return rows;
    } catch (err) {
      console.log("❌ Patient appointments fetch error:", err);
      throw err;
    }
  }

  // MODIFIED: Get appointments by patient ID WITH clinic and doctor names - with auto-cancel check
  async getAppointmentsByPatientIdWithDetails(patientId) {
    try {
      // First, cancel any expired appointments for this patient
      await this.cancelExpiredAppointmentsForPatient(patientId);

      const db = await this.initDB();
      const [rows] = await db.execute(
        Appointment.getAppointmentsByPatientIdWithDetailsSQL(),
        [patientId]
      );
      console.log(
        `✅ Found ${rows.length} detailed appointments for patient: ${patientId}`
      );
      return rows;
    } catch (err) {
      console.log("❌ Patient appointments with details error:", err);
      throw err;
    }
  }

  // MODIFIED: Get all appointments - with auto-cancel check
  async getAllAppointments() {
    try {
      // Cancel any expired appointments first
      await this.cancelExpiredAppointments();

      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Appointment.tableName} ORDER BY appointment_date DESC, created_at DESC`
      );
      console.log("✅ Appointments found:", rows.length);
      return rows;
    } catch (err) {
      console.log("❌ Appointments fetch error:", err);
      throw err;
    }
  }

  // MODIFIED: Get all appointments WITH clinic and doctor names - with auto-cancel check
  async getAllAppointmentsWithDetails() {
    try {
      // Cancel any expired appointments first
      await this.cancelExpiredAppointments();

      const db = await this.initDB();
      const [rows] = await db.execute(
        Appointment.getAppointmentsWithDetailsSQL()
      );
      console.log("✅ Appointments with details found:", rows.length);
      return rows;
    } catch (err) {
      console.log("❌ Appointments with details fetch error:", err);
      throw err;
    }
  }

  // ✅ FIXED: SINGLE createAppointment method with validation
  async createAppointment(appointmentData) {
    try {
      const db = await this.initDB();

      // Validate appointment date is not in the past
      const appointmentDate = new Date(appointmentData.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (appointmentDate < today) {
        throw new Error("Cannot create appointment for past dates");
      }

      // If same day, validate time is not in the past
      if (
        appointmentData.schedule &&
        appointmentDate.getTime() === today.getTime()
      ) {
        const appointmentTime = new Date(appointmentData.schedule);
        const now = new Date();

        if (appointmentTime < now) {
          throw new Error(
            "Cannot create appointment for past time on today's date"
          );
        }
      }

      // Generate unique appointment_id if not provided
      const processedData = { ...appointmentData };
      if (!processedData.appointment_id) {
        processedData.appointment_id = this.generateAppointmentId();
      }

      // Build dynamic SQL
      const columns = Object.keys(Appointment.columns).join(", ");
      const placeholders = Object.keys(Appointment.columns)
        .map(() => "?")
        .join(", ");
      const values = Object.keys(Appointment.columns).map((key) =>
        processedData.hasOwnProperty(key) ? processedData[key] : null
      );

      const sql = `INSERT INTO ${Appointment.tableName} (${columns}) VALUES (${placeholders})`;
      const [result] = await db.execute(sql, values);

      console.log("✅ Appointment created with ID:", result.insertId);
      return { id: result.insertId, ...appointmentData };
    } catch (err) {
      console.log("❌ Appointment creation error:", err);
      throw err;
    }
  }

  // Get appointment by ID
  async getAppointmentById(id) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Appointment.tableName} WHERE id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      console.log("❌ Appointment find error:", err);
      throw err;
    }
  }

  // Get appointments by doctor ID
  async getAppointmentsByDoctorId(doctorId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Appointment.tableName} WHERE doctor_id = ? ORDER BY appointment_date DESC`,
        [doctorId]
      );
      console.log(
        `✅ Found ${rows.length} appointments for doctor: ${doctorId}`
      );
      return rows;
    } catch (err) {
      console.log("❌ Doctor appointments fetch error:", err);
      throw err;
    }
  }

  // Get appointments by date
  async getAppointmentsByDate(date) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Appointment.tableName} WHERE appointment_date = ? ORDER BY schedule ASC`,
        [date]
      );
      console.log(`✅ Found ${rows.length} appointments for date: ${date}`);
      return rows;
    } catch (err) {
      console.log("❌ Date appointments fetch error:", err);
      throw err;
    }
  }

  // Get appointments by status
  async getAppointmentsByStatus(status) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Appointment.tableName} WHERE status = ? ORDER BY appointment_date DESC`,
        [status]
      );
      console.log(
        `✅ Found ${rows.length} appointments with status: ${status}`
      );
      return rows;
    } catch (err) {
      console.log("❌ Status appointments fetch error:", err);
      throw err;
    }
  }

  // Get today's appointments
  async getTodaysAppointments() {
    const today = new Date().toISOString().split("T")[0];
    return this.getAppointmentsByDate(today);
  }

  // Update appointment
  async updateAppointment(id, appointmentData) {
    try {
      const db = await this.initDB();
      const updates = Object.keys(appointmentData)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = Object.keys(appointmentData)
        .filter((key) => key !== "id")
        .map((key) => appointmentData[key])
        .concat(id);

      const sql = `UPDATE ${Appointment.tableName} SET ${updates} WHERE id = ?`;
      await db.execute(sql, values);

      console.log("✅ Appointment updated:", id);
      return { id, ...appointmentData };
    } catch (err) {
      console.log("❌ Appointment update error:", err);
      throw err;
    }
  }

  // Get single appointment WITH clinic and doctor details
  async getAppointmentWithDetails(appointmentId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        Appointment.getAppointmentWithDetailsSQL(),
        [appointmentId, appointmentId]
      );
      return rows[0] || null;
    } catch (err) {
      console.log("❌ Appointment details fetch error:", err);
      throw err;
    }
  }

  // Update appointment status
  async updateAppointmentStatus(id, status) {
    try {
      const db = await this.initDB();
      await db.execute(
        `UPDATE ${Appointment.tableName} SET status = ? WHERE id = ?`,
        [status, id]
      );
      console.log("✅ Appointment status updated:", id, "to", status);
      return { id, status };
    } catch (err) {
      console.log("❌ Appointment status update error:", err);
      throw err;
    }
  }

  // Delete appointment
  async deleteAppointment(id) {
    try {
      const db = await this.initDB();
      await db.execute(`DELETE FROM ${Appointment.tableName} WHERE id = ?`, [
        id,
      ]);
      console.log("✅ Appointment deleted:", id);
      return { deletedId: id };
    } catch (err) {
      console.log("❌ Appointment delete error:", err);
      throw err;
    }
  }

  // HELPER: Generate unique appointment ID
  generateAppointmentId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `APT${timestamp}${random}`;
  }
}

// Export controller instance
export default new AppointmentController();
