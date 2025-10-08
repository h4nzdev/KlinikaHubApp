import axios from "axios";

// For physical device - remove the __DEV__ check temporarily
const API_BASE_URL = "http://192.168.1.35:5000/api"; // ← Changed this!

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const patientAuthServices = {
  patientLogin: async (email, password) => {
    try {
      console.log("🔄 Logging in patient:", email);
      const response = await api.post("/auth/login", { email, password }); // ← Changed endpoint!
      console.log("✅ Login Success! Patient:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Login Error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },
};

export default patientAuthServices;
