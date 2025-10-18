// /frontend/services/api.js (if you don't have this)
import axios from "axios";
import { API_URL } from "@env";
import Config from "../config/api";

const API_BASE_URL = Config.API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for image uploads
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const cloudinaryService = {
  // Convert image to base64
  imageToBase64: async (imageUri) => {
    try {
      console.log("🔄 Converting image to base64...");

      const response = await fetch(imageUri);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Remove the data:image/jpeg;base64, prefix
          const base64 = reader.result.split(",")[1];
          console.log("✅ Image converted to base64");
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("❌ Base64 conversion error:", error);
      throw new Error("Failed to process image");
    }
  },

  // Upload image via backend
  uploadImage: async (imageUri) => {
    try {
      console.log("🔄 Starting image upload process...");

      // Step 1: Convert image to base64
      const base64Image = await cloudinaryService.imageToBase64(imageUri);

      // Step 2: Send to backend for Cloudinary upload
      console.log("🔄 Sending to backend...");
      const response = await api.post("/auth/upload-photo", {
        image: base64Image,
      });

      console.log("✅ Image uploaded successfully:", response.data.photoUrl);
      return { secure_url: response.data.photoUrl };
    } catch (error) {
      console.error("❌ Upload failed:", error);
      throw new Error(error.response?.data?.error || "Failed to upload image");
    }
  },
};

export default cloudinaryService;
