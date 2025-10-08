import { patientMockData } from "../data/patientData.js";

export const getAllPatients = (req, res) => {
  try {
    res.status(200).json(patientMockData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

