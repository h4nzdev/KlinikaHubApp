import axios from "axios";
import Config from "../config/api";

const API_BASE_URL = Config.API_BASE_URL;

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
      console.log(
        "🔄 Fetching clinics (tenants) from:",
        `${API_BASE_URL}/tenants`
      );

      // Updated endpoint to match router
      const response = await api.get("/tenants", {
        timeout: 10000,
        validateStatus: (status) => status >= 200 && status < 500,
      });

      console.log("✅ Response status:", response.status);
      console.log("✅ Response data:", response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data;
      if (!data) {
        throw new Error("Unexpected clinics response format");
      }

      return data;
    } catch (error) {
      console.error("❌ Detailed clinics fetch error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });

      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "Cannot connect to server. Make sure the backend is running."
        );
      } else if (error.code === "NETWORK_ERROR") {
        throw new Error("Network error. Check your internet connection.");
      } else if (error.code === "TIMEOUT") {
        throw new Error(
          "Request timeout. Server is taking too long to respond."
        );
      }

      throw error;
    }
  },

  getClinicById: async (id) => {
    try {
      console.log("🔄 Fetching clinic:", id);
      // Updated endpoint to match router
      const response = await api.get(`/tenants/clinics/${id}`);
      console.log("✅ Specific Clinic fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Clinic fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  getClinicByName: async (name) => {
    try {
      console.log("🔄 Fetching clinic by name:", name);
      // New endpoint for getting clinic by name
      const response = await api.get(`/tenants/clinics/name/${name}`);
      console.log("✅ Clinic by name fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Clinic by name fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  getClinicsByType: async (type) => {
    try {
      console.log("🔄 Fetching clinics by type:", type);
      // Updated endpoint and function name
      const response = await api.get(`/tenants/clinics/type/${type}`);
      console.log("✅ Clinics by type fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Clinics by type fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Keep these as they are (they're for different routes)
  getAllCategories: async () => {
    try {
      console.log("🔄 Fetching all categories");
      const response = await api.get("/categories");
      console.log("✅ Categories fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Categories fetch error:", error.message);
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
