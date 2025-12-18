import cors from "cors";
import express from "express";
import tenantsDatabase from "./config/tenantsDb.js";
import appointmentRoutes from "./routes/appointment-routes.js";
import patientRouter from "./routes/patientRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import authRouter from "./routes/authRoutes.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import smsRouter from "./routes/smsRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import tenantsRouter from "./routes/tenantsRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// CORRECT ROUTE: /api/klinikah
app.use("/api/klinikah", appointmentRoutes);

app.use("/api/patients", patientRouter);
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api", smsRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/tenants", tenantsRouter);


// Health check
app.get("/", (req, res) => {
  res.json({
    message: "🏥 Clinic Appointment API",
    version: "1.0.0",
    endpoints: {
      get_appointments: "GET /api/klinikah/:clinicId/appointments",
      book_appointment: "POST /api/klinikah/:clinicId/appointments",
      patient_appointments:
        "GET /api/klinikah/:clinicId/patient/:patientId/appointments",
      update_status:
        "PUT /api/klinikah/:clinicId/appointments/:appointmentId/status",
    },
    example_clinics: [
      { id: 59, name: "Tunacao Clinic" },
      { id: 75, name: "Gwapo Klinik" },
      { id: 84, name: "Medora" },
    ],
    timestamp: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await tenantsDatabase.connect();
    console.log("✅ Database connected: klinikah_demo");

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(
        `🔗 Test URL: http://localhost:${PORT}/api/klinikah/75/appointments`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Add this route to server.js
app.get("/api/debug/tables", async (req, res) => {
  try {
    const pool = await tenantsDatabase.getDatabase();

    // Get all tables in the database
    const [tables] = await pool.query("SHOW TABLES");

    // Get table names
    const tableNames = tables.map((table) => {
      const key = Object.keys(table)[0];
      return table[key];
    });

    console.log("📊 Tables in klinikah_demo:", tableNames);

    res.json({
      database: "klinikah_demo",
      tables: tableNames,
      table_count: tableNames.length,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      sql: "SHOW TABLES",
    });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down...");
  await tenantsDatabase.close();
  process.exit(0);
});

startServer();
