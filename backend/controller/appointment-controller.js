import tenantsDatabase from "../config/tenantsDb.js";

class AppointmentController {
  // Get clinic info from tenants table
  async getClinicInfo(clinicId) {
    try {
      const pool = await tenantsDatabase.getDatabase();

      // Make sure we're in main database
      await pool.query("USE `klinikah_demo`");

      const [clinics] = await pool.query("SELECT * FROM tenants WHERE id = ?", [
        clinicId,
      ]);

      if (clinics.length === 0) {
        throw new Error(`Clinic with ID ${clinicId} not found`);
      }

      return clinics[0];
    } catch (error) {
      console.error("❌ Error getting clinic info:", error);
      throw error;
    }
  }

  // Generate appointment ID like CodeIgniter does
  generateAppointmentId() {
    // CodeIgniter uses: $this->app_lib->getAppointmentNo()
    // Let's create similar format: APT + timestamp + random
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000);
    return `APT${timestamp.slice(-8)}${random.toString().padStart(3, "0")}`;
  }

  // EXACT CodeIgniter-style appointment booking
  async bookAppointment(clinicId, appointmentData) {
    try {
      console.log(`📝 Booking appointment for clinic: ${clinicId}`);

      // Get clinic info
      const clinic = await this.getClinicInfo(clinicId);

      if (!clinic.database_name) {
        return { success: false, message: `Clinic has no database configured` };
      }

      const pool = await tenantsDatabase.getDatabase();

      // Switch to clinic's database
      await pool.query(`USE \`${clinic.database_name}\``);

      // Validate required fields (same as CI)
      const requiredFields = [
        "doctor_id",
        "patient_id",
        "appointment_date",
        "schedule",
      ];
      for (const field of requiredFields) {
        if (!appointmentData[field]) {
          await pool.query("USE `klinikah_demo`");
          return {
            success: false,
            message: `Missing required field: ${field}`,
          };
        }
      }

      // Check schedule availability (like CI's check_schedule function)
      try {
        const [existingAppointments] = await pool.query(
          `SELECT id FROM appointment 
           WHERE doctor_id = ? 
           AND appointment_date = ? 
           AND schedule = ? 
           AND status IN (1, 2)`, // Same as CI: array(1, 2)
          [
            appointmentData.doctor_id,
            appointmentData.appointment_date,
            appointmentData.schedule,
          ]
        );

        if (existingAppointments.length > 0) {
          await pool.query("USE `klinikah_demo`");
          return {
            success: false,
            message: "This time slot is already booked",
          };
        }
      } catch (error) {
        // Table might be empty, continue
        console.log("⚠️ Schedule check skipped:", error.message);
      }

      // Generate appointment ID (like CI's getAppointmentNo())
      const appointmentId = this.generateAppointmentId();

      // Create appointment object EXACTLY like CodeIgniter
      const insertAppointment = {
        appointment_id: appointmentId,
        doctor_id: appointmentData.doctor_id,
        patient_id: appointmentData.patient_id,
        schedule: appointmentData.schedule,
        remarks: appointmentData.remarks || "",
        appointment_date: appointmentData.appointment_date, // CI: date("Y-m-d", strtotime(...))
        status: appointmentData.status || 4, // Default to 4 = requested
      };

      console.log("📝 Inserting appointment (CI format):", insertAppointment);

      // Insert into database - check what columns exist first
      const [tableInfo] = await pool.query("DESCRIBE appointment");
      const columnNames = tableInfo.map((col) => col.Field);

      console.log("📊 Appointment table columns:", columnNames);

      // Build dynamic SQL based on actual columns
      const availableColumns = {};
      for (const [key, value] of Object.entries(insertAppointment)) {
        if (columnNames.includes(key)) {
          availableColumns[key] = value;
        } else {
          console.log(`⚠️ Column '${key}' not found in appointment table`);
        }
      }

      // Add created_at if column exists
      if (columnNames.includes("created_at")) {
        availableColumns.created_at = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
      }

      const columns = Object.keys(availableColumns).join(", ");
      const placeholders = Object.keys(availableColumns)
        .map(() => "?")
        .join(", ");
      const values = Object.values(availableColumns);

      const sql = `INSERT INTO appointment (${columns}) VALUES (${placeholders})`;

      console.log("📝 Executing SQL:", sql);
      console.log("📝 With values:", values);

      const [result] = await pool.query(sql, values);

      console.log(`✅ Appointment inserted with ID: ${result.insertId}`);

      // Get the created appointment
      const [appointments] = await pool.query(
        "SELECT * FROM appointment WHERE id = ?",
        [result.insertId]
      );

      // Switch back to main database
      await pool.query("USE `klinikah_demo`");

      return {
        success: true,
        message: "Appointment booked successfully",
        data: appointments[0],
        appointment_id: appointmentId,
        insert_id: result.insertId,
      };
    } catch (error) {
      console.error("❌ Error booking appointment:", error);

      // Try to switch back to main database
      try {
        const pool = await tenantsDatabase.getDatabase();
        await pool.query("USE `klinikah_demo`");
      } catch (e) {
        // Ignore
      }

      return {
        success: false,
        message: error.message,
        error_code: error.code,
        sql_message: error.sqlMessage,
      };
    }
  }

  // Get appointments (like CI's get_appointment_list)
  async getAppointmentsByClinic(
    clinicId,
    isStaff = true,
    startDate = null,
    endDate = null
  ) {
    try {
      // Get clinic info
      const clinic = await this.getClinicInfo(clinicId);

      if (!clinic.database_name) {
        return { success: false, message: `Clinic has no database` };
      }

      const pool = await tenantsDatabase.getDatabase();

      // Switch to clinic's database
      await pool.query(`USE \`${clinic.database_name}\``);

      let appointments = [];
      let sql = "";
      let params = [];

      if (startDate && endDate) {
        // With date range (like CI's search)
        sql = `
          SELECT a.*, 
                 d.name as doctor_name,
                 p.name as patient_name,
                 p.mobile_no as patient_phone
          FROM appointment a
          LEFT JOIN staff d ON a.doctor_id = d.id
          LEFT JOIN patient p ON a.patient_id = p.id
          WHERE a.appointment_date BETWEEN ? AND ?
          ORDER BY a.appointment_date DESC, a.created_at DESC
        `;
        params = [startDate, endDate];
      } else {
        // All appointments (no date filter)
        sql = `
          SELECT a.*, 
                 d.name as doctor_name,
                 p.name as patient_name,
                 p.mobile_no as patient_phone
          FROM appointment a
          LEFT JOIN staff d ON a.doctor_id = d.id
          LEFT JOIN patient p ON a.patient_id = p.id
          ORDER BY a.appointment_date DESC, a.created_at DESC
        `;
      }

      try {
        [appointments] = await pool.query(sql, params);
      } catch (error) {
        // Fallback to simple query
        console.log("⚠️ Using simple query:", error.message);
        [appointments] = await pool.query(`
          SELECT * FROM appointment 
          ORDER BY appointment_date DESC, created_at DESC
        `);
      }

      // Switch back to main database
      await pool.query("USE `klinikah_demo`");

      return {
        success: true,
        data: appointments,
        clinic: {
          id: clinic.id,
          name: clinic.clinic_name,
          database: clinic.database_name,
        },
        count: appointments.length,
      };
    } catch (error) {
      console.error("❌ Error getting appointments:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Update appointment status (like CI's approvedRequested)
  async updateAppointmentStatus(
    clinicId,
    appointmentId,
    status,
    schedule = null
  ) {
    try {
      const clinic = await this.getClinicInfo(clinicId);

      if (!clinic.database_name) {
        return { success: false, message: `Clinic has no database` };
      }

      const pool = await tenantsDatabase.getDatabase();

      // Switch to clinic's database
      await pool.query(`USE \`${clinic.database_name}\``);

      let sql, params;

      if (schedule && status == 1) {
        // Approve with schedule (like CI: status = 1 with schedule)
        sql = "UPDATE appointment SET status = ?, schedule = ? WHERE id = ?";
        params = [status, schedule, appointmentId];
      } else {
        // Simple status update
        sql = "UPDATE appointment SET status = ? WHERE id = ?";
        params = [status, appointmentId];
      }

      const [result] = await pool.query(sql, params);

      // Switch back to main database
      await pool.query("USE `klinikah_demo`");

      return {
        success: true,
        message: `Appointment status updated to ${status}`,
        affected_rows: result.affectedRows,
      };
    } catch (error) {
      console.error("❌ Error updating appointment status:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get patient's appointments (like CI's my_list for patients)
  async getPatientAppointments(clinicId, patientId) {
    try {
      const clinic = await this.getClinicInfo(clinicId);

      if (!clinic.database_name) {
        return { success: false, message: `Clinic has no database` };
      }

      const pool = await tenantsDatabase.getDatabase();

      // Switch to clinic's database
      await pool.query(`USE \`${clinic.database_name}\``);

      // Get appointments for this patient
      const [appointments] = await pool.query(
        `
        SELECT a.*, d.name as doctor_name, d.qualification
        FROM appointment a
        LEFT JOIN staff d ON a.doctor_id = d.id
        WHERE a.patient_id = ?
        ORDER BY a.appointment_date DESC
      `,
        [patientId]
      );

      // Switch back to main database
      await pool.query("USE `klinikah_demo`");

      return {
        success: true,
        data: appointments,
        patient_id: patientId,
        count: appointments.length,
      };
    } catch (error) {
      console.error("❌ Error getting patient appointments:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

const appointmentController = new AppointmentController();
export default appointmentController;
