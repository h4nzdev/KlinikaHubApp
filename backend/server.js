import cors from "cors";
import express from "express";
import patientRouter from "./routes/patientRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import patientController from "./controller/patientController.js";
import clinicController from "./controller/clinicController.js"; // Add this
import authRouter from "./routes/authRoutes.js";
import clinicRouter from "./routes/clinicRoutes.js"; // Add this

const app = express();

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

const mockDoctors = [
  // ... your existing mock doctors data
];

app.use("/api/patients", patientRouter);
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRouter);
app.use("/api/clinics", clinicRouter); // Add this

app.get("/", (req, res) => {
  res.json({
    message: "Hello from express",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/doctors", (req, res) => {
  res.json(mockDoctors);
});

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: Math.random(),
    name,
    email,
    createdAt: new Date(),
  };

  res.json({ message: "User created", user: newUser });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});