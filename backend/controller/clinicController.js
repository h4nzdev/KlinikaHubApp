import database from "../config/database.js";
import Clinic from "../model/Clinic.js";

// Clinic Controller for Node.js/Express - Updated for tenants table
class ClinicController {
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

  // Initialize clinic table
  async initTable() {
    try {
      const db = await this.initDB();
      await db.execute(Clinic.getCreateTableSQL());
      console.log("✅ Tenants table initialized");
    } catch (err) {
      console.log("❌ Table init error:", err);
      throw err;
    }
  }

  // Create a new clinic (tenant)
  async createClinic(clinicData) {
    try {
      const db = await this.initDB();

      const columns = Object.keys(Clinic.columns).join(", ");
      const placeholders = Object.keys(Clinic.columns)
        .map(() => "?")
        .join(", ");
      const values = Object.keys(Clinic.columns).map(
        (key) => clinicData[key] || null
      );

      const sql = `INSERT INTO ${Clinic.tableName} (${columns}) VALUES (${placeholders})`;
      const [result] = await db.execute(sql, values);

      console.log("✅ Clinic created with ID:", result.insertId);
      return { id: result.insertId, ...clinicData };
    } catch (err) {
      console.log("❌ Clinic creation error:", err);
      throw err;
    }
  }

  // Get all clinics
  async getAllClinics() {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Clinic.tableName} ORDER BY created_at DESC`
      );
      console.log("✅ Clinics found:", rows.length);
      return rows;
    } catch (err) {
      console.log("❌ Clinics fetch error:", err);
      throw err;
    }
  }

  // Get clinic by ID
  async getClinicById(id) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Clinic.tableName} WHERE id = ?`,
        [id]
      );
      const clinic = rows[0] || null;
      return clinic;
    } catch (err) {
      console.log("❌ Clinic find error:", err);
      throw err;
    }
  }

  // Get clinic by name
  async getClinicByName(name) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Clinic.tableName} WHERE clinic_name = ?`,
        [name]
      );
      const clinic = rows[0] || null;
      return clinic;
    } catch (err) {
      console.log("❌ Clinic name search error:", err);
      throw err;
    }
  }

  // Get clinic by email
  async getClinicByEmail(email) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Clinic.tableName} WHERE email = ?`,
        [email]
      );
      const clinic = rows[0] || null;
      return clinic;
    } catch (err) {
      console.log("❌ Clinic email search error:", err);
      throw err;
    }
  }

  // Get clinics by status
  async getClinicsByStatus(status) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Clinic.tableName} WHERE status = ? ORDER BY created_at DESC`,
        [status]
      );
      return rows;
    } catch (err) {
      console.log("❌ Clinics by status error:", err);
      throw err;
    }
  }

  // Get clinics by clinic type
  async getClinicsByType(clinicType) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Clinic.tableName} WHERE clinic_type = ? ORDER BY created_at DESC`,
        [clinicType]
      );
      return rows;
    } catch (err) {
      console.log("❌ Clinics by type error:", err);
      throw err;
    }
  }

  // Update clinic
  async updateClinic(id, clinicData) {
    try {
      const db = await this.initDB();

      const updates = Object.keys(clinicData)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = Object.keys(clinicData)
        .filter((key) => key !== "id")
        .map((key) => clinicData[key])
        .concat(id);

      const sql = `UPDATE ${Clinic.tableName} SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      await db.execute(sql, values);

      console.log("✅ Clinic updated:", id);
      return { id, ...clinicData };
    } catch (err) {
      console.log("❌ Clinic update error:", err);
      throw err;
    }
  }

  // Delete clinic
  async deleteClinic(id) {
    try {
      const db = await this.initDB();
      await db.execute(`DELETE FROM ${Clinic.tableName} WHERE id = ?`, [id]);
      console.log("✅ Clinic deleted:", id);
      return { deletedId: id };
    } catch (err) {
      console.log("❌ Clinic delete error:", err);
      throw err;
    }
  }

  // Activate clinic (set status to active)
  async activateClinic(id) {
    try {
      const db = await this.initDB();
      await db.execute(
        `UPDATE ${Clinic.tableName} SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [id]
      );
      console.log("✅ Clinic activated:", id);
      return { id, status: "active" };
    } catch (err) {
      console.log("❌ Clinic activation error:", err);
      throw err;
    }
  }

  // Suspend clinic (set status to suspended)
  async suspendClinic(id) {
    try {
      const db = await this.initDB();
      await db.execute(
        `UPDATE ${Clinic.tableName} SET status = 'suspended', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [id]
      );
      console.log("✅ Clinic suspended:", id);
      return { id, status: "suspended" };
    } catch (err) {
      console.log("❌ Clinic suspension error:", err);
      throw err;
    }
  }

  // Update subscription status
  async updateSubscriptionStatus(id, subscriptionData) {
    try {
      const db = await this.initDB();
      const {
        subscription_status,
        current_period_start,
        current_period_end,
        next_billing_date,
        payment_method_id,
      } = subscriptionData;

      const sql = `
        UPDATE ${Clinic.tableName} 
        SET subscription_status = ?, 
            current_period_start = ?, 
            current_period_end = ?, 
            next_billing_date = ?,
            payment_method_id = ?,
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;

      await db.execute(sql, [
        subscription_status,
        current_period_start,
        current_period_end,
        next_billing_date,
        payment_method_id,
        id,
      ]);

      console.log("✅ Subscription updated for clinic:", id);
      return { id, ...subscriptionData };
    } catch (err) {
      console.log("❌ Subscription update error:", err);
      throw err;
    }
  }
}

// Export controller instance
export default new ClinicController();
