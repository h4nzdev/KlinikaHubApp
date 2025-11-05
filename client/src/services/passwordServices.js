// services/passwordServices.js
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

export const passwordServices = {
  // Send password change verification
  async sendPasswordChangeVerification(email, currentPassword) {
    try {
      console.log("🔄 Sending password change verification for:", email);
      const response = await api.post("/auth/send-password-verification", {
        email,
        currentPassword,
      });
      console.log("✅ Password verification code sent!");
      return response.data;
    } catch (error) {
      console.log(
        "Password verification error:",
        error.response?.data || error
      );

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to send verification code";

      throw new Error(errorMessage);
    }
  },

  // Verify and change password
  async verifyAndChangePassword(
    email,
    verificationCode,
    currentPassword,
    newPassword
  ) {
    try {
      console.log("🔄 Verifying and changing password for:", email);
      const response = await api.post("/auth/verify-change-password", {
        email,
        verificationCode,
        currentPassword,
        newPassword,
      });
      console.log("✅ Password changed successfully!");
      return response.data;
    } catch (error) {
      console.log("Password change error:", error.response?.data || error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to change password";

      throw new Error(errorMessage);
    }
  },
};

export default passwordServices;
