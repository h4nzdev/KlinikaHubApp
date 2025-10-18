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

export const appointmentServices = {
  // Initialize appointment table
  initAppointmentsTable: async () => {
    try {
      console.log("🔄 Initializing appointments table...");
      const response = await api.get("/appointments/init", {
        timeout: 10000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      });

      console.log("✅ Appointments table init response:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "API returned unsuccessful response"
        );
      }

      return response.data;
    } catch (error) {
      console.error("❌ Appointments table init error:", {
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

  // Get all appointments
  getAllAppointments: async () => {
    try {
      console.log("🔄 Fetching all appointments...");
      const response = await api.get("/appointments", {
        timeout: 10000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      });

      console.log("✅ Appointments fetch response:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "API returned unsuccessful response"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("❌ Appointments fetch error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });
      throw error;
    }
  },

  // Get today's appointments
  getTodaysAppointments: async () => {
    try {
      console.log("🔄 Fetching today's appointments...");
      const response = await api.get("/appointments/today");
      console.log("✅ Today's appointments fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Today's appointments fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    try {
      console.log("🔄 Fetching appointment by ID:", id);
      const response = await api.get(`/appointments/${id}`);
      console.log("✅ Appointment fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Appointment fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get appointments by patient ID
  getAppointmentsByPatientId: async (patientId) => {
    try {
      console.log("🔄 Fetching appointments by patient ID:", patientId);
      const response = await api.get(`/appointments/patient/${patientId}`);
      console.log("✅ Patient appointments fetched successfully!");
      return response.data.data;
    } catch (error) {
      console.error("❌ Patient appointments fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get appointments by doctor ID
  getAppointmentsByDoctorId: async (doctorId) => {
    try {
      console.log("🔄 Fetching appointments by doctor ID:", doctorId);
      const response = await api.get(`/appointments/doctor/${doctorId}`);
      console.log("✅ Doctor appointments fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Doctor appointments fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get appointments by date
  getAppointmentsByDate: async (date) => {
    try {
      console.log("🔄 Fetching appointments by date:", date);
      const response = await api.get(`/appointments/date/${date}`);
      console.log("✅ Date appointments fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Date appointments fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get appointments by status
  getAppointmentsByStatus: async (status) => {
    try {
      console.log("🔄 Fetching appointments by status:", status);
      const response = await api.get(`/appointments/status/${status}`);
      console.log("✅ Status appointments fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Status appointments fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Create new appointment
  createAppointment: async (appointmentData) => {
    try {
      console.log("🔄 Creating appointment...");
      const response = await api.post("/appointments", appointmentData);
      console.log("✅ Appointment created successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Appointment creation error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      console.log("🔄 Updating appointment:", id);
      const response = await api.put(`/appointments/${id}`, appointmentData);
      console.log("✅ Appointment updated successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Appointment update error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  getAppointmentsByPatientIdWithDetails: async (patientId) => {
    try {
      console.log(
        "🔄 Fetching appointments with details for patient:",
        patientId
      );
      const response = await api.get(
        `/appointments/patient/${patientId}/details`
      );
      console.log("✅ Patient appointments with details fetched successfully!");
      return response.data.data || response.data;
    } catch (error) {
      console.error(
        "❌ Patient appointments with details fetch error:",
        error.message
      );
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get single appointment WITH clinic and doctor details
  getAppointmentWithDetails: async (appointmentId) => {
    try {
      console.log("🔄 Fetching appointment with details:", appointmentId);
      const response = await api.get(`/appointments/${appointmentId}/details`);
      console.log("✅ Appointment with details fetched successfully!");
      return response.data.data || response.data;
    } catch (error) {
      console.error("❌ Appointment with details fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get all appointments WITH clinic and doctor names
  getAllAppointmentsWithDetails: async () => {
    try {
      console.log("🔄 Fetching all appointments with details...");
      const response = await api.get("/appointments/with-details/all");
      console.log("✅ All appointments with details fetched successfully!");
      return response.data.data || response.data;
    } catch (error) {
      console.error(
        "❌ All appointments with details fetch error:",
        error.message
      );
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Update appointment status only
  updateAppointmentStatus: async (id, status) => {
    try {
      console.log("🔄 Updating appointment status:", id, "to", status);
      const response = await api.patch(`/appointments/${id}/status`, {
        status,
      });
      console.log("✅ Appointment status updated successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Appointment status update error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    try {
      console.log("🔄 Deleting appointment:", id);
      const response = await api.delete(`/appointments/${id}`);
      console.log("✅ Appointment deleted successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Appointment deletion error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },
};

// Export all services together
export default appointmentServices;
