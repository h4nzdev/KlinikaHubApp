import mysql from "mysql2/promise";
import { Client } from "ssh2";
import net from "net";
import dotenv from "dotenv";

dotenv.config();

class AppointmentDatabase {
  constructor() {
    this.pool = null;
    this.sshClient = null;
    this.sshServer = null;
    this.localPort = 3308;
  }

  async createSSHTunnel() {
    return new Promise((resolve, reject) => {
      this.sshClient = new Client();

      this.sshClient.on("ready", () => {
        console.log("✅ SSH Connection established for Appointment DB");

        this.sshServer = net.createServer((clientSocket) => {
          this.sshClient.forwardOut(
            "127.0.0.1",
            0,
            "127.0.0.1",
            3306,
            (err, stream) => {
              if (err) {
                console.error("❌ SSH forwarding error:", err);
                clientSocket.end();
                return;
              }
              clientSocket.pipe(stream).pipe(clientSocket);
            }
          );
        });

        this.sshServer.listen(this.localPort, "127.0.0.1", () => {
          console.log(`✅ SSH Tunnel ready on localhost:${this.localPort}`);
          resolve(this.localPort);
        });

        this.sshServer.on("error", reject);
      });

      this.sshClient.on("error", (err) => {
        console.error("❌ SSH Client error:", err);
        reject(err);
      });

      this.sshClient.connect({
        host: process.env.SSH_HOST,
        port: Number(process.env.SSH_PORT) || 22,
        username: process.env.SSH_USER,
        password: process.env.SSH_PASSWORD,
      });
    });
  }

  async connect() {
    try {
      // Create SSH tunnel
      await this.createSSHTunnel();

      // Connect to the MAIN CodeIgniter database (not tenant-specific)
      this.pool = mysql.createPool({
        host: "localhost",
        port: this.localPort,
        user: process.env.MAIN_DB_USER, // Main CI database user
        password: process.env.MAIN_DB_PASSWORD, // Main CI database password
        database: process.env.MAIN_DB_NAME, // Main CI database name
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Test connection
      await this.pool.query("SELECT 1");
      console.log("✅ Appointment (Main CI) Database Connected");

      return this.pool;
    } catch (error) {
      console.error("❌ Appointment Database connection error:", error);
      throw error;
    }
  }

  async getDatabase() {
    if (!this.pool) {
      return await this.connect();
    }
    return this.pool;
  }

  async query(sql, params) {
    try {
      const pool = await this.getDatabase();
      const [results] = await pool.query(sql, params);
      return results;
    } catch (error) {
      console.error("❌ Appointment query error:", error);
      throw error;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }

    if (this.sshServer) {
      this.sshServer.close();
      this.sshServer = null;
    }

    if (this.sshClient) {
      this.sshClient.end();
      this.sshClient = null;
    }

    console.log("✅ Appointment Database closed");
  }
}

const appointmentDatabase = new AppointmentDatabase();
export default appointmentDatabase;
