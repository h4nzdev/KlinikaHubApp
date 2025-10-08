import axios from "axios";

// Use the same base URL as your doctorServices
const API_BASE_URL = "http://192.168.1.35:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const chatServices = {
  // 🗣️ Send message to chatbot
  sendMessage: async (message, sessionId = null) => {
    try {
      console.log("🔄 Sending message to:", `${API_BASE_URL}/chat/message`);
      const response = await api.post("/chat/message", {
        message,
        sessionId,
      });
      console.log("✅ Chat response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Chat Error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // 🚨 Get emergency contacts
  getEmergencyContacts: async (severity, location = "Philippines") => {
    try {
      console.log("🔄 Getting emergency contacts for severity:", severity);
      const response = await api.post("/chat/emergency-contacts", {
        severity,
        location,
      });
      console.log("✅ Emergency contacts:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Emergency Contacts Error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },
};

export default chatServices;
