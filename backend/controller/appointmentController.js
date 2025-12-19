import tenantsDatabase from "../config/tenantsDb.js";

class AppointmentController {
  // Get clinic database
  async getClinicDb(clinicId) {
    const pool = await tenantsDatabase.getDatabase();

    // Get clinic info
    const [clinics] = await pool.query("SELECT * FROM tenants WHERE id = ?", [
      clinicId,
    ]);

    if (!clinics[0]?.database_name) {
      throw new Error("Clinic not found");
    }

    // Switch to clinic database
    await pool.query(`USE \`${clinics[0].database_name}\``);

    return { pool, clinic: clinics[0] };
  }

  // Switch back to main
  async switchToMain(pool) {
    try {
      await pool.query("USE `klinikah_demo`");
    } catch (e) {}
  }

  // =========== SIMPLE SAVE ===========
  async save(clinicId, data) {
    const { pool } = await this.getClinicDb(clinicId);

    try {
      // Map schedule to time_slot, remarks to notes
      const appointmentData = {
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        appointment_date: new Date(data.appointment_date)
          .toISOString()
          .split("T")[0],
        time_slot: data.schedule || data.time_slot || "",
        status: data.status || "No Show",
        notes: data.remarks || data.notes || null,
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      if (data.id) {
        // Update
        const appointmentId = data.id;
        delete appointmentData.created_at; // Don't update created_at

        await pool.query(`UPDATE appointment SET ? WHERE id = ?`, [
          appointmentData,
          appointmentId,
        ]);
        return appointmentId;
      } else {
        // Create
        const [result] = await pool.query(`INSERT INTO appointment SET ?`, [
          appointmentData,
        ]);
        return result.insertId;
      }
    } finally {
      await this.switchToMain(pool);
    }
  }

  // =========== SIMPLE GET ===========
  async getByClinic(clinicId, filters = {}) {
    const { pool } = await this.getClinicDb(clinicId);

    try {
      let sql = `
        SELECT a.*, 
               s.name as doctor_name,
               CONCAT(p.last_name, ', ', p.first_name, ' ', p.middle_name) as patient_name
        FROM appointment a
        LEFT JOIN staff s ON a.doctor_id = s.id
        LEFT JOIN patient p ON a.patient_id = p.id
        WHERE 1=1
      `;

      const params = [];

      // Simple filters
      if (filters.patient_id) {
        sql += " AND a.patient_id = ?";
        params.push(filters.patient_id);
      }

      if (filters.doctor_id) {
        sql += " AND a.doctor_id = ?";
        params.push(filters.doctor_id);
      }

      sql += " ORDER BY a.appointment_date DESC, a.created_at DESC";

      const [appointments] = await pool.query(sql, params);
      return appointments;
    } finally {
      await this.switchToMain(pool);
    }
  }

  // =========== OTHER SIMPLE METHODS ===========
  async getById(clinicId, id) {
    const { pool } = await this.getClinicDb(clinicId);

    try {
      const [rows] = await pool.query(
        `SELECT a.*, 
                s.name as doctor_name,
                CONCAT(p.last_name, ', ', p.first_name, ' ', p.middle_name) as patient_name
         FROM appointment a
         LEFT JOIN staff s ON a.doctor_id = s.id
         LEFT JOIN patient p ON a.patient_id = p.id
         WHERE a.id = ?`,
        [id]
      );

      return rows[0] || null;
    } finally {
      await this.switchToMain(pool);
    }
  }

  async delete(clinicId, appointmentId) {
    const { pool } = await this.getClinicDb(clinicId);

    try {
      const [result] = await pool.query(
        `DELETE FROM appointment WHERE id = ?`,
        [appointmentId]
      );

      return result.affectedRows > 0;
    } finally {
      await this.switchToMain(pool);
    }
  }

  // Get doctors
  async getDoctors(clinicId) {
    const { pool } = await this.getClinicDb(clinicId);

    try {
      const [doctors] = await pool.query(
        `SELECT id, name FROM staff WHERE role_id = 3 ORDER BY name`
      );

      return doctors;
    } finally {
      await this.switchToMain(pool);
    }
  }
}

export default new AppointmentController();
