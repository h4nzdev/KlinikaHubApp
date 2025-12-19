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

export const tenantAppointmentServices = {
  // Book appointment for a clinic
  bookAppointment: async (clinicId, appointmentData) => {
    try {
      console.log(`🔄 Booking appointment for clinic: ${clinicId}`);
      const response = await api.post(
        `/klinikah/${clinicId}/appointments`,
        appointmentData
      );
      console.log("✅ Appointment booked successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Appointment booking error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get all appointments for a clinic
  getAppointmentsByClinic: async (
    clinicId,
    startDate = null,
    endDate = null
  ) => {
    try {
      console.log(`🔄 Fetching appointments for clinic: ${clinicId}`);
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const response = await api.get(`/klinikah/${clinicId}/appointments`, {
        params,
      });
      console.log("✅ Appointments fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Appointments fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (
    clinicId,
    appointmentId,
    status,
    schedule = null
  ) => {
    try {
      console.log(
        `🔄 Updating appointment status for clinic: ${clinicId}, appointment: ${appointmentId}`
      );
      const data = { status };
      if (schedule) data.schedule = schedule;
      const response = await api.put(
        `/klinikah/${clinicId}/appointments/${appointmentId}/status`,
        data
      );
      console.log("✅ Appointment status updated successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Appointment status update error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get patient's appointments
  getPatientAppointments: async (clinicId, patientId) => {
    try {
      console.log(
        `🔄 Fetching patient appointments for clinic: ${clinicId}, patient: ${patientId}`
      );
      const response = await api.get(
        `/klinikah/${clinicId}/appointments/patient/${patientId}`
      );
      console.log("✅ Patient appointments fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Patient appointments fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Delete appointment
  deleteAppointment: async (clinicId, appointmentId) => {
    try {
      console.log(
        `🔄 Deleting appointment for clinic: ${clinicId}, appointment: ${appointmentId}`
      );
      const response = await api.delete(
        `/klinikah/${clinicId}/appointments/${appointmentId}`
      );
      console.log("✅ Appointment deleted successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Appointment deletion error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get requested appointments
  getRequestedAppointments: async (
    clinicId,
    startDate = null,
    endDate = null
  ) => {
    try {
      console.log(`🔄 Fetching requested appointments for clinic: ${clinicId}`);
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const response = await api.get(
        `/klinikah/${clinicId}/appointments/requested`,
        { params }
      );
      console.log("✅ Requested appointments fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Requested appointments fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Patient books own appointment
  bookMyAppointment: async (
    clinicId,
    patientId,
    doctorId,
    appointmentDate,
    schedule,
    remarks = ""
  ) => {
    try {
      console.log(`🔄 Booking my appointment for clinic: ${clinicId}`);
      const data = {
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_date: appointmentDate,
        schedule: schedule,
        remarks: remarks,
      };
      const response = await api.post(
        `/klinikah/${clinicId}/appointments/my-appointments`,
        data
      );
      console.log("✅ My appointment booked successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ My appointment booking error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },
};

// Export all services together
export default tenantAppointmentServices;
