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
