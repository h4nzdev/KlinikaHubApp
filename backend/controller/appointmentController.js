import database from "../config/database.js";
import Appointment from "../model/Appointment.js";

// Appointment Controller for Node.js/Express
class AppointmentController {
  constructor() {
    this.db = database.getDatabase();
  }

  // Initialize appointment table
  async initTable() {
    return new Promise((resolve, reject) => {
      this.db.run(Appointment.getCreateTableSQL(), (err) => {
        if (err) {
          console.log("❌ Appointment table init error:", err);
          reject(err);
        } else {
          console.log("✅ Appointment table initialized");
          resolve();
        }
      });
    });
  }

  // Create a new appointment
  async createAppointment(appointmentData) {
    return new Promise((resolve, reject) => {
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

      this.db.run(sql, values, function (err) {
        if (err) {
          console.log("❌ Appointment creation error:", err);
          reject(err);
        } else {
          console.log("✅ Appointment created with ID:", this.lastID);
          resolve({ id: this.lastID, ...appointmentData });
        }
      });
    });
  }

  // Get all appointments
  async getAllAppointments() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ${Appointment.tableName} ORDER BY appointment_date DESC, created_at DESC`,
        [],
        (err, rows) => {
          if (err) {
            console.log("❌ Appointments fetch error:", err);
            reject(err);
          } else {
            console.log("✅ Appointments found:", rows.length);
            resolve(rows);
          }
        }
      );
    });
  }

  // Get appointment by ID
  async getAppointmentById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM ${Appointment.tableName} WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            console.log("❌ Appointment find error:", err);
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  // Get appointments by patient ID
  async getAppointmentsByPatientId(patientId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ${Appointment.tableName} WHERE patient_id = ? ORDER BY appointment_date DESC`,
        [patientId],
        (err, rows) => {
          if (err) {
            console.log("❌ Patient appointments fetch error:", err);
            reject(err);
          } else {
            console.log(
              `✅ Found ${rows.length} appointments for patient: ${patientId}`
            );
            resolve(rows);
          }
        }
      );
    });
  }

  // Get appointments by doctor ID
  async getAppointmentsByDoctorId(doctorId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ${Appointment.tableName} WHERE doctor_id = ? ORDER BY appointment_date DESC`,
        [doctorId],
        (err, rows) => {
          if (err) {
            console.log("❌ Doctor appointments fetch error:", err);
            reject(err);
          } else {
            console.log(
              `✅ Found ${rows.length} appointments for doctor: ${doctorId}`
            );
            resolve(rows);
          }
        }
      );
    });
  }

  // Get appointments by date
  async getAppointmentsByDate(date) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ${Appointment.tableName} WHERE appointment_date = ? ORDER BY schedule ASC`,
        [date],
        (err, rows) => {
          if (err) {
            console.log("❌ Date appointments fetch error:", err);
            reject(err);
          } else {
            console.log(
              `✅ Found ${rows.length} appointments for date: ${date}`
            );
            resolve(rows);
          }
        }
      );
    });
  }

  // Get appointments by status
  async getAppointmentsByStatus(status) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ${Appointment.tableName} WHERE status = ? ORDER BY appointment_date DESC`,
        [status],
        (err, rows) => {
          if (err) {
            console.log("❌ Status appointments fetch error:", err);
            reject(err);
          } else {
            console.log(
              `✅ Found ${rows.length} appointments with status: ${status}`
            );
            resolve(rows);
          }
        }
      );
    });
  }

  // Get today's appointments
  async getTodaysAppointments() {
    const today = new Date().toISOString().split("T")[0];
    return this.getAppointmentsByDate(today);
  }

  // Update appointment
  async updateAppointment(id, appointmentData) {
    return new Promise((resolve, reject) => {
      const updates = Object.keys(appointmentData)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = Object.keys(appointmentData)
        .filter((key) => key !== "id")
        .map((key) => appointmentData[key])
        .concat(id);

      const sql = `UPDATE ${Appointment.tableName} SET ${updates} WHERE id = ?`;

      this.db.run(sql, values, function (err) {
        if (err) {
          console.log("❌ Appointment update error:", err);
          reject(err);
        } else {
          console.log("✅ Appointment updated:", id);
          resolve({ id, ...appointmentData });
        }
      });
    });
  }

  // Get appointments by patient ID WITH clinic and doctor names
  async getAppointmentsByPatientIdWithDetails(patientId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          a.*,
          gs.institute_name as clinic_name,
          s.name as doctor_name,
          s.specialties as doctor_specialties
        FROM ${Appointment.tableName} a
        LEFT JOIN global_settings gs ON a.clinic_id = gs.id
        LEFT JOIN staff s ON a.doctor_id = s.id
        WHERE a.patient_id = ? 
        ORDER BY a.appointment_date DESC
      `;

      this.db.all(sql, [patientId], (err, rows) => {
        if (err) {
          console.log("❌ Patient appointments with details error:", err);
          reject(err);
        } else {
          console.log(
            `✅ Found ${rows.length} detailed appointments for patient: ${patientId}`
          );
          resolve(rows);
        }
      });
    });
  }

  // Get single appointment WITH clinic and doctor details
  async getAppointmentWithDetails(appointmentId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          a.*,
          gs.institute_name as clinic_name,
          gs.address as clinic_address,
          s.name as doctor_name,
          s.specialties as doctor_specialties,
          s.qualification as doctor_qualification
        FROM ${Appointment.tableName} a
        LEFT JOIN global_settings gs ON a.clinic_id = gs.id
        LEFT JOIN staff s ON a.doctor_id = s.id
        WHERE a.id = ? OR a.appointment_id = ?
      `;

      this.db.get(sql, [appointmentId, appointmentId], (err, row) => {
        if (err) {
          console.log("❌ Appointment details fetch error:", err);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  // Get all appointments WITH clinic and doctor names
  async getAllAppointmentsWithDetails() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          a.*,
          gs.institute_name as clinic_name,
          s.name as doctor_name,
          s.specialties as doctor_specialties
        FROM ${Appointment.tableName} a
        LEFT JOIN global_settings gs ON a.clinic_id = gs.id
        LEFT JOIN staff s ON a.doctor_id = s.id
        ORDER BY a.appointment_date DESC, a.created_at DESC
      `;

      this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.log("❌ Appointments with details fetch error:", err);
          reject(err);
        } else {
          console.log("✅ Appointments with details found:", rows.length);
          resolve(rows);
        }
      });
    });
  }

  // Update appointment status
  async updateAppointmentStatus(id, status) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE ${Appointment.tableName} SET status = ? WHERE id = ?`,
        [status, id],
        function (err) {
          if (err) {
            console.log("❌ Appointment status update error:", err);
            reject(err);
          } else {
            console.log("✅ Appointment status updated:", id, "to", status);
            resolve({ id, status });
          }
        }
      );
    });
  }

  // Delete appointment
  async deleteAppointment(id) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM ${Appointment.tableName} WHERE id = ?`,
        [id],
        function (err) {
          if (err) {
            console.log("❌ Appointment delete error:", err);
            reject(err);
          } else {
            console.log("✅ Appointment deleted:", id);
            resolve({ deletedId: id });
          }
        }
      );
    });
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
