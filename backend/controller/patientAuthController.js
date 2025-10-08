import { patientMockData } from "../data/patientData.js";

export const patientLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = patientMockData.find((p) => p.email === email);

    if (!patient) {
      return res.status(404).json({ message: "Email not found!" });
    }

    if (patient.password === password) {
      return res.status(200).json(patient);
    } else {
      return res.status(401).json({ message: "Incorrect Password" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
