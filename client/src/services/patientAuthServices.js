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

export const patientAuthServices = {
  // ✅ NEW: Request verification code
  requestVerificationCode: async (email) => {
    try {
      console.log("🔄 Requesting verification code for:", email);
      const response = await api.post("/auth/request-verification", { email });
      console.log("✅ Verification code sent!");
      return response.data;
    } catch (error) {
      console.log("Verification request error:", error.response?.data || error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to send verification code";

      throw new Error(errorMessage);
    }
  },

  // ✅ NEW: Verify code and register
  verifyAndRegister: async (email, code, patientData) => {
    try {
      console.log("🔄 Verifying code and registering:", email);
      const response = await api.post("/auth/verify-and-register", {
        email,
        code,
        patientData,
      });
      console.log("✅ Email verified and registration completed!");
      return response.data;
    } catch (error) {
      console.log(
        "Verification & registration error:",
        error.response?.data || error
      );

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Verification failed";

      throw new Error(errorMessage);
    }
  },

  // ✅ NEW: Resend verification code
  resendVerificationCode: async (email) => {
    try {
      console.log("🔄 Resending verification code for:", email);
      const response = await api.post("/auth/resend-verification", { email });
      console.log("✅ Verification code resent!");
      return response.data;
    } catch (error) {
      console.log("Resend verification error:", error.response?.data || error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to resend verification code";

      throw new Error(errorMessage);
    }
  },

  // ⚠️ KEEP: Old login (unchanged)
  patientLogin: async (email, password) => {
    try {
      console.log("🔄 Logging in patient:", email);
      const response = await api.post("/auth/login", { email, password });
      console.log("✅ Login Success! Patient:", response.data);
      return response.data;
    } catch (error) {
      console.log("Full error details:", error.response?.data || error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";

      throw new Error(errorMessage);
    }
  },

  // ⚠️ KEEP: Old register (for backward compatibility)
  patientRegister: async (patientData) => {
    try {
      console.log("🔄 Registering patient:", patientData.email);
      const response = await api.post("/auth/register", patientData);
      console.log("✅ Registration Success! Patient:", response.data);
      return response.data;
    } catch (error) {
      console.log("Full error details:", error.response?.data || error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";

      throw new Error(errorMessage);
    }
  },

  // ✅ NEW: Check email exists
  checkEmailExists: async (email) => {
    try {
      console.log("🔄 Checking if email exists:", email);
      const response = await api.post("/auth/check-email", { email });
      return response.data;
    } catch (error) {
      console.log("Check email error:", error.response?.data || error);
      throw new Error("Failed to check email");
    }
  },

  // ✅ NEW: Upload patient photo
  uploadPatientPhoto: async (base64Image) => {
    try {
      console.log("🔄 Uploading patient photo...");
      const response = await api.post("/auth/upload-photo", {
        image: base64Image,
      });
      console.log("✅ Photo uploaded successfully!");
      return response.data;
    } catch (error) {
      console.log("Photo upload error:", error.response?.data || error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to upload photo";

      throw new Error(errorMessage);
    }
  },
  updatePatientProfile: async (patientId, updateData) => {
    try {
      console.log("🔄 Updating patient profile:", patientId);
      const response = await api.put(`/patients/${patientId}`, updateData);
      console.log("✅ Profile updated successfully!");
      return response.data;
    } catch (error) {
      console.log("Profile update error:", error.response?.data || error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";

      throw new Error(errorMessage);
    }
  },

  // ✅ NEW: Get patient profile
  getPatientProfile: async (patientId) => {
    try {
      console.log("🔄 Fetching patient profile:", patientId);
      const response = await api.get(`/patients/${patientId}`);
      console.log("✅ Profile fetched successfully!");
      return response.data;
    } catch (error) {
      console.log("Profile fetch error:", error.response?.data || error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch profile";

      throw new Error(errorMessage);
    }
  },
  // In patientAuthServices.js - make sure this is correct:
  // In your patientAuthServices.updatePatientProfilePicture
  updatePatientProfilePicture: async (patientId, base64Image) => {
    try {
      console.log("🔄 Updating profile picture for:", patientId);
      const response = await api.put(`/patients/${patientId}/profile-picture`, {
        image: base64Image,
      });
      console.log("✅ Profile picture update response:", response.data);
      return response.data;
    } catch (error) {
      console.log(
        "Profile picture update error:",
        error.response?.data || error
      );
      throw new Error(
        error.response?.data?.error || "Failed to update profile picture"
      );
    }
  },

  // ✅ NEW: Delete profile picture
  deletePatientProfilePicture: async (patientId) => {
    try {
      console.log("🔄 Deleting profile picture for:", patientId);
      const response = await api.delete(
        `/patients/${patientId}/profile-picture`
      );
      console.log("✅ Profile picture deleted successfully!");
      return response.data;
    } catch (error) {
      console.log(
        "Profile picture delete error:",
        error.response?.data || error
      );

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to delete profile picture";

      throw new Error(errorMessage);
    }
  },
};

export default patientAuthServices;
