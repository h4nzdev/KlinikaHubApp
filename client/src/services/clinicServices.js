import axios from "axios";

// For physical device - remove the __DEV__ check temporarily
const API_BASE_URL = "http://192.168.1.35:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const clinicServices = {
  getAllClinics: async () => {
    try {
      console.log("🔄 Fetching clinics from:", `${API_BASE_URL}/clinics`);
      const response = await api.get("/clinics");
      console.log("✅ Clinics fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Clinics fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  getClinicById: async (id) => {
    try {
      console.log("🔄 Fetching clinic:", id);
      const response = await api.get(`/clinics/${id}`);
      console.log("✅ Clinic fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Clinic fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  createClinic: async (clinicData) => {
    try {
      console.log("🔄 Creating clinic:", clinicData.name);
      const response = await api.post("/clinics", clinicData);
      console.log("✅ Clinic created successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Clinic creation error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },
};

export default clinicServices;
