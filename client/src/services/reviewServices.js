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

export const reviewServices = {
  // Initialize review table
  initReviewsTable: async () => {
    try {
      console.log("🔄 Initializing reviews table...");
      const response = await api.get("/reviews/init", {
        timeout: 10000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      });

      console.log("✅ Reviews table init response:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "API returned unsuccessful response"
        );
      }

      return response.data;
    } catch (error) {
      console.error("❌ Reviews table init error:", {
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

  // Get all reviews
  getAllReviews: async () => {
    try {
      console.log("🔄 Fetching all reviews...");
      const response = await api.get("/reviews", {
        timeout: 10000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      });

      console.log("✅ Reviews fetch response:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "API returned unsuccessful response"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("❌ Reviews fetch error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });
      throw error;
    }
  },

  // Get review by ID
  getReviewById: async (id) => {
    try {
      console.log("🔄 Fetching review by ID:", id);
      const response = await api.get(`/reviews/${id}`);
      console.log("✅ Review fetched successfully!");
      return response.data.data;
    } catch (error) {
      console.error("❌ Review fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get reviews by patient ID
  getReviewsByPatientId: async (patientId) => {
    try {
      console.log("🔄 Fetching reviews by patient ID:", patientId);
      const response = await api.get(`/reviews/patient/${patientId}`);
      console.log("✅ Patient reviews fetched successfully!");
      return response.data.data;
    } catch (error) {
      console.error("❌ Patient reviews fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get reviews by clinic ID
  getReviewsByClinicId: async (clinicId) => {
    try {
      console.log("🔄 Fetching reviews by clinic ID:", clinicId);
      const response = await api.get(`/reviews/clinic/${clinicId}`);
      console.log("✅ Clinic reviews fetched successfully!");
      return response.data.data;
    } catch (error) {
      console.error("❌ Clinic reviews fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get reviews by rating
  getReviewsByRating: async (rating) => {
    try {
      console.log("🔄 Fetching reviews by rating:", rating);
      const response = await api.get(`/reviews/rating/${rating}`);
      console.log("✅ Rating reviews fetched successfully!");
      return response.data.data;
    } catch (error) {
      console.error("❌ Rating reviews fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get reviews by status
  getReviewsByStatus: async (status) => {
    try {
      console.log("🔄 Fetching reviews by status:", status);
      const response = await api.get(`/reviews/status/${status}`);
      console.log("✅ Status reviews fetched successfully!");
      return response.data.data;
    } catch (error) {
      console.error("❌ Status reviews fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get verified reviews only
  getVerifiedReviews: async () => {
    try {
      console.log("🔄 Fetching verified reviews...");
      const response = await api.get("/reviews/verified/all");
      console.log("✅ Verified reviews fetched successfully!");
      return response.data.data;
    } catch (error) {
      console.error("❌ Verified reviews fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Create new review
  createReview: async (reviewData) => {
    try {
      console.log("🔄 Creating review...");
      const response = await api.post("/reviews", reviewData);
      console.log("✅ Review created successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Review creation error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Update review
  updateReview: async (id, reviewData) => {
    try {
      console.log("🔄 Updating review:", id);
      const response = await api.put(`/reviews/${id}`, reviewData);
      console.log("✅ Review updated successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Review update error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get reviews by patient ID WITH clinic details
  getReviewsByPatientIdWithDetails: async (patientId) => {
    try {
      console.log("🔄 Fetching reviews with details for patient:", patientId);
      const response = await api.get(`/reviews/patient/${patientId}/details`);
      console.log("✅ Patient reviews with details fetched successfully!");
      return response.data.data || response.data;
    } catch (error) {
      console.error(
        "❌ Patient reviews with details fetch error:",
        error.message
      );
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get reviews by clinic ID WITH patient details
  getReviewsByClinicIdWithDetails: async (clinicId) => {
    try {
      console.log("🔄 Fetching reviews with details for clinic:", clinicId);
      const response = await api.get(`/reviews/clinic/${clinicId}/details`);
      console.log("✅ Clinic reviews with details fetched successfully!");
      return response.data.data || response.data;
    } catch (error) {
      console.error(
        "❌ Clinic reviews with details fetch error:",
        error.message
      );
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get all reviews WITH clinic and patient names
  getAllReviewsWithDetails: async () => {
    try {
      console.log("🔄 Fetching all reviews with details...");
      const response = await api.get("/reviews/with-details/all");
      console.log("✅ All reviews with details fetched successfully!");
      return response.data.data || response.data;
    } catch (error) {
      console.error("❌ All reviews with details fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Update review status only
  updateReviewStatus: async (id, status) => {
    try {
      console.log("🔄 Updating review status:", id, "to", status);
      const response = await api.patch(`/reviews/${id}/status`, {
        status,
      });
      console.log("✅ Review status updated successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Review status update error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Mark review as helpful
  markReviewAsHelpful: async (id) => {
    try {
      console.log("🔄 Marking review as helpful:", id);
      const response = await api.patch(`/reviews/${id}/helpful`);
      console.log("✅ Review marked as helpful successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Review helpful update error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get rating statistics for all clinics
  getAllClinicsRatingStats: async () => {
    try {
      console.log("🔄 Fetching rating stats for all clinics...");
      const response = await api.get("/reviews/stats/clinic");
      console.log("✅ All clinics rating stats fetched successfully!");
      return response.data.data;
    } catch (error) {
      console.error("❌ All clinics rating stats fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Get rating statistics for specific clinic
  getClinicRatingStats: async (clinicId) => {
    try {
      console.log("🔄 Fetching rating stats for clinic:", clinicId);
      const response = await api.get(`/reviews/stats/clinic/${clinicId}`);
      console.log("✅ Clinic rating stats fetched successfully!");
      return response.data.data;
    } catch (error) {
      console.error("❌ Clinic rating stats fetch error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },

  // Delete review
  deleteReview: async (id) => {
    try {
      console.log("🔄 Deleting review:", id);
      const response = await api.delete(`/reviews/${id}`);
      console.log("✅ Review deleted successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Review deletion error:", error.message);
      console.log("Full error details:", error.response?.data || error);
      throw error;
    }
  },
};

// Export all services together
export default reviewServices;
