import mysql from "mysql2/promise";

// Database class to manage MySQL connection
class Database {
  constructor() {
    // Store the connection pool
    this.pool = null;
  }

  // Connect to MySQL database
  async connect() {
    try {
      // Create connection pool
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "klinikahub",
        port: process.env.DB_PORT || 27677,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: { rejectUnauthorized: true },
      });

      console.log("✅ MySQL Database Connected");
      return this.pool;
    } catch (error) {
      console.log("❌ MySQL Database connection failed:", error);
      throw error;
    }
  }

  // Get database instance (creates connection if not exists)
  async getDatabase() {
    if (!this.pool) {
      // If no connection exists, create one
      return await this.connect();
    }
    // Return existing connection pool
    return this.pool;
  }
}

// Create a single instance (Singleton pattern)
const database = new Database();

// Export the database instance for use in other files
export default database;
