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

      // Add timeout and better error handling
      const response = await api.get("/clinics", {
        timeout: 10000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      });

      console.log("✅ Response status:", response.status);
      console.log("✅ Response data:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "API returned unsuccessful response"
        );
      }

      return response.data.data; // Make sure this matches your backend response structure
    } catch (error) {
      console.error("❌ Detailed clinics fetch error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });

      // More specific error messages
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
      const response = await api.get(`/clinics/${id}`);
      console.log("✅ Clinic fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Clinic fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  getClinicsByCategory: async (category) => {
    try {
      console.log("🔄 Fetching clinics by category:", category);
      const response = await api.get(`/clinics/category/${category}`);
      console.log("✅ Clinics by category fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Clinics by category fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

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
