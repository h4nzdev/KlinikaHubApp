import tenantsDatabase from "../config/tenantsDb.js";

export const getTenants = async (req, res) => {
  try {
    const pool = await tenantsDatabase.getDatabase();
    const [rows] = await pool.query("SELECT * FROM tenants");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTenantById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await tenantsDatabase.getDatabase();
    const [rows] = await pool.query("SELECT * FROM tenants WHERE id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clinic queries (all working with tenants table)
export const getAllClinics = async (req, res) => {
  try {
    const pool = await tenantsDatabase.getDatabase();
    const [rows] = await pool.query(
      "SELECT * FROM tenants ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getClinicById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await tenantsDatabase.getDatabase();
    const [rows] = await pool.query("SELECT * FROM tenants WHERE id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getClinicByName = async (req, res) => {
  try {
    const { name } = req.params;
    const pool = await tenantsDatabase.getDatabase();
    const [rows] = await pool.query(
      "SELECT * FROM tenants WHERE clinic_name = ?",
      [name]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getClinicsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const pool = await tenantsDatabase.getDatabase();
    const [rows] = await pool.query(
      "SELECT * FROM tenants WHERE clinic_type = ? ORDER BY created_at DESC",
      [type]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
