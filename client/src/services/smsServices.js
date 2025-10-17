import axios from "axios";
import { API_URL } from "@env";

const API_BASE_URL = API_URL || "http://192.168.1.35:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const smsService = {
  // Send SMS reminder
  sendReminder: async (phoneNumber, message) => {
    try {
      console.log("🔄 Sending SMS to:", phoneNumber);

      const response = await api.post("/sms", {
        to: phoneNumber,
        message: message,
      });

      console.log("✅ SMS sent successfully!");
      return response.data;
    } catch (error) {
      console.log("SMS send error:", error.response?.data || error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to send SMS";

      throw new Error(errorMessage);
    }
  },

  // Send appointment reminder (formatted)
  sendAppointmentReminder: async (phoneNumber, appointmentDetails) => {
    try {
      const message = `🔔 KlinikaHub Reminder: Your appointment at ${appointmentDetails.clinicName} is on ${appointmentDetails.date} at ${appointmentDetails.time}.`;

      console.log("🔄 Sending appointment reminder to:", phoneNumber);

      const response = await api.post("/sms", {
        to: phoneNumber,
        message: message,
      });

      console.log("✅ Appointment reminder sent!");
      return response.data;
    } catch (error) {
      console.log("Appointment reminder error:", error.response?.data || error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to send appointment reminder";

      throw new Error(errorMessage);
    }
  },

  // Send medication reminder
  sendMedicationReminder: async (phoneNumber, medicationName, time) => {
    try {
      const message = `💊 KlinikaHub Reminder: Time to take your ${medicationName} at ${time}.`;

      console.log("🔄 Sending medication reminder to:", phoneNumber);

      const response = await api.post("/sms", {
        to: phoneNumber,
        message: message,
      });

      console.log("✅ Medication reminder sent!");
      return response.data;
    } catch (error) {
      console.log("Medication reminder error:", error.response?.data || error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to send medication reminder";

      throw new Error(errorMessage);
    }
  },
};

export default smsService;
