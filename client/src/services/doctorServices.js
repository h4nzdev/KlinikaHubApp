import axios from "axios";
import { API_URL } from "@env";
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

export const doctorServices = {
  // Initialize doctor table
  initDoctorsTable: async () => {
    try {
      console.log("🔄 Initializing doctors table...");
      const response = await api.get("/doctors/init", {
        timeout: 10000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      });

      console.log("✅ Doctors table init response:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "API returned unsuccessful response"
        );
      }

      return response.data;
    } catch (error) {
      console.error("❌ Doctors table init error:", {
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

  // Get all doctors
  getAllDoctors: async () => {
    try {
      console.log("🔄 Fetching all doctors...");
      const response = await api.get("/doctors", {
        timeout: 10000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      });

      console.log("✅ Doctors fetch response:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "API returned unsuccessful response"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("❌ Doctors fetch error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });
      throw error;
    }
  },

  // Get active doctors only
  getActiveDoctors: async () => {
    try {
      console.log("🔄 Fetching active doctors...");
      const response = await api.get("/doctors/active");
      console.log("✅ Active doctors fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Active doctors fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    try {
      console.log("🔄 Fetching doctor by ID:", id);
      const response = await api.get(`/doctors/${id}`);
      console.log("✅ Doctor fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Doctor fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get doctor by staff ID
  getDoctorByStaffId: async (staffId) => {
    try {
      console.log("🔄 Fetching doctor by staff ID:", staffId);
      const response = await api.get(`/doctors/staff/${staffId}`);
      console.log("✅ Doctor by staff ID fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Doctor by staff ID fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get doctors by clinic ID
  getDoctorsByClinicId: async (clinicId) => {
    try {
      console.log("🔄 Fetching doctors by clinic ID:", clinicId);
      const response = await api.get(`/doctors/clinic/${clinicId}`);
      console.log("✅ Doctors by clinic fetched successfully!");
      return response.data.data;
    } catch (error) {
      console.error("❌ Doctors by clinic fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get active doctors by clinic ID
  getActiveDoctorsByClinicId: async (clinicId) => {
    try {
      console.log("🔄 Fetching active doctors by clinic ID:", clinicId);
      const response = await api.get(`/doctors/clinic/${clinicId}/active`);
      console.log("✅ Active doctors by clinic fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Active doctors by clinic fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get doctors by department
  getDoctorsByDepartment: async (departmentId) => {
    try {
      console.log("🔄 Fetching doctors by department:", departmentId);
      const response = await api.get(`/doctors/department/${departmentId}`);
      console.log("✅ Doctors by department fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Doctors by department fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Create new doctor
  createDoctor: async (doctorData) => {
    try {
      console.log("🔄 Creating doctor:", doctorData.name);
      const response = await api.post("/doctors", doctorData);
      console.log("✅ Doctor created successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Doctor creation error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Update doctor
  updateDoctor: async (id, doctorData) => {
    try {
      console.log("🔄 Updating doctor:", id);
      const response = await api.put(`/doctors/${id}`, doctorData);
      console.log("✅ Doctor updated successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Doctor update error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Delete doctor
  deleteDoctor: async (id) => {
    try {
      console.log("🔄 Deleting doctor:", id);
      const response = await api.delete(`/doctors/${id}`);
      console.log("✅ Doctor deleted successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Doctor deletion error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },
};
