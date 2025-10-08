import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

const mockDoctors = [
  {
    _id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    experience: "8+ years",
    consultation: "$45",
    rating: 4.8,
    reviews: 120,
  },
  {
    _id: "2",
    name: "Dr. Mike Chen",
    specialty: "Dermatology",
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
    experience: "10+ years",
    consultation: "$50",
    rating: 4.9,
    reviews: 150,
  },
  {
    _id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
    experience: "6+ years",
    consultation: "$40",
    rating: 4.7,
    reviews: 98,
  },
  {
    _id: "4",
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
    experience: "12+ years",
    consultation: "$55",
    rating: 4.9,
    reviews: 200,
  },
  {
    _id: "5",
    name: "Dr. Lisa Anderson",
    specialty: "Neurology",
    profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
    experience: "9+ years",
    consultation: "$60",
    rating: 4.8,
    reviews: 145,
  },
  {
    _id: "6",
    name: "Dr. Robert Brown",
    specialty: "General Practice",
    profileImage: "https://randomuser.me/api/portraits/men/6.jpg",
    experience: "7+ years",
    consultation: "$35",
    rating: 4.6,
    reviews: 89,
  },
];

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
