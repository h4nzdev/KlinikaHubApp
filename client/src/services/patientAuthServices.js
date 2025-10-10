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
      const response = await api.post("/auth/login", { email, password });
      console.log("✅ Login Success! Patient:", response.data);
      return response.data;
    } catch (error) {
      console.log("Full error details:", error.response?.data || error);

      // Extract the specific error message from backend response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";

      // Throw a new error with the specific message from backend
      throw new Error(errorMessage);
    }
  },

  patientRegister: async (patientData) => {
    try {
      console.log("🔄 Registering patient:", patientData.email);
      const response = await api.post("/auth/register", patientData);
      console.log("✅ Registration Success! Patient:", response.data);
      return response.data;
    } catch (error) {
      console.log("Full error details:", error.response?.data || error);

      // Extract the specific error message from backend response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";

      throw new Error(errorMessage);
    }
  },
};

export default patientAuthServices;
