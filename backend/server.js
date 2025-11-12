import cors from "cors";
import express from "express";
import patientRouter from "./routes/patientRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import patientController from "./controller/patientController.js";
import clinicController from "./controller/clinicController.js"; // Add this
import authRouter from "./routes/authRoutes.js";
import clinicRouter from "./routes/clinicRoutes.js"; // Add this
import appointmentRouter from "./routes/appointmentRouter.js";
import doctorRouter from "./routes/doctorRoutes.js";
import smsRouter from "./routes/smsRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import tenantsRouter from "./routes/tenantsRoutes.js";

const app = express();

app.use(express.json({ limit: "50mb" })); // Increase from default 100kb to 50mb
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.json());

// Initialize database on server start
const initializeDatabase = async () => {
  try {
    await patientController.initTable();
    await clinicController.initTable(); // Add this
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.log("❌ Database initialization failed:", error);
  }
};

// Call initialization
initializeDatabase();

app.use("/api/patients", patientRouter);
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRouter);
app.use("/api/clinics", clinicRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api", smsRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/tenants", tenantsRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Hello from express",
    timestamp: new Date().toISOString(),
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
