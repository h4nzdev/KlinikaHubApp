import axios from "axios";

const API_BASE_URL =
  " https://expositorially-hamulate-carola.ngrok-free.dev/api";

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
};

export default clinicServices;
