import mysql from "mysql2/promise";

class TenantsDatabase {
  constructor() {
    this.pool = null;
  }
  async connect() {
    try {
      this.pool = mysql.createPool({
        host: process.env.TENANTS_DB_HOST,
        user: process.env.TENANTS_DB_USER,
        password: process.env.TENANTS_DB_PASSWORD,
        database: process.env.TENANTS_DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      console.log("✅ Tenants MySQL Database Connected");
      return this.pool;
    } catch (error) {
      console.log("❌ Tenants MySQL Database connection failed:", error);
      throw error;
    }
  }

  async getDatabase() {
    if (!this.pool) {
      return await this.connect();
    }
    return this.pool;
  }
}

const tenantsDatabase = new TenantsDatabase();
export default tenantsDatabase;
