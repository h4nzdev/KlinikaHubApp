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

export const notificationServices = {
  // GET ALL NOTIFICATIONS FOR USER
  getUserNotifications: async (userId) => {
    try {
      console.log("🔄 Fetching notifications for user:", userId);

      const response = await api.get(`/notifications/user/${userId}`, {
        timeout: 10000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      });

      console.log("✅ Notifications fetched successfully!");

      if (!response.data.success) {
        throw new Error(
          response.data.message || "API returned unsuccessful response"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("❌ Notifications fetch error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });

      if (error.code === "ECONNREFUSED") {
        throw new Error("Cannot connect to server.");
      } else if (error.code === "NETWORK_ERROR") {
        throw new Error("Network error. Check your internet connection.");
      } else if (error.code === "TIMEOUT") {
        throw new Error("Request timeout.");
      }

      throw error;
    }
  },

  // GET UNREAD NOTIFICATIONS FOR USER
  getUnreadNotifications: async (userId) => {
    try {
      console.log("🔄 Fetching unread notifications for user:", userId);
      const response = await api.get(`/notifications/user/${userId}/unread`);
      console.log("✅ Unread notifications fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Unread notifications fetch error:", error.message);
      throw error;
    }
  },

  // GET NOTIFICATIONS BY TYPE
  getNotificationsByType: async (userId, type) => {
    try {
      console.log(`🔄 Fetching ${type} notifications for user:`, userId);
      const response = await api.get(
        `/notifications/user/${userId}/type/${type}`
      );
      console.log(`✅ ${type} notifications fetched successfully!`);
      return response.data;
    } catch (error) {
      console.error("❌ Notifications by type fetch error:", error.message);
      throw error;
    }
  },

  // CREATE NEW NOTIFICATION
  createNotification: async (notificationData) => {
    try {
      console.log("🔄 Creating notification");
      const response = await api.post("/notifications", notificationData);
      console.log("✅ Notification created successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Notification creation error:", error.message);
      throw error;
    }
  },

  // 🌟 CREATE HEALTH TIP NOTIFICATION
  createHealthTipNotification: async (userId, message) => {
    try {
      console.log("🔄 Creating health tip notification");
      const response = await api.post("/notifications/health-tip", {
        user_id: userId,
        message: message,
      });
      console.log("✅ Health tip notification created successfully!");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Health tip notification creation error:",
        error.message
      );
      throw error;
    }
  },

  // MARK NOTIFICATION AS READ
  markAsRead: async (notificationId) => {
    try {
      console.log("🔄 Marking notification as read:", notificationId);
      const response = await api.patch(`/notifications/${notificationId}/read`);
      console.log("✅ Notification marked as read!");
      return response.data;
    } catch (error) {
      console.error("❌ Mark as read error:", error.message);
      throw error;
    }
  },

  // MARK ALL NOTIFICATIONS AS READ FOR USER
  markAllAsRead: async (userId) => {
    try {
      console.log("🔄 Marking all notifications as read for user:", userId);
      const response = await api.patch(
        `/notifications/user/${userId}/read-all`
      );
      console.log("✅ All notifications marked as read!");
      return response.data;
    } catch (error) {
      console.error("❌ Mark all as read error:", error.message);
      throw error;
    }
  },

  // DELETE NOTIFICATION
  deleteNotification: async (notificationId) => {
    try {
      console.log("🔄 Deleting notification:", notificationId);
      const response = await api.delete(`/notifications/${notificationId}`);
      console.log("✅ Notification deleted successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Delete notification error:", error.message);
      throw error;
    }
  },

  // GET NOTIFICATION BY ID
  getNotificationById: async (notificationId) => {
    try {
      console.log("🔄 Fetching notification:", notificationId);
      const response = await api.get(`/notifications/${notificationId}`);
      console.log("✅ Notification fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Notification fetch error:", error.message);
      throw error;
    }
  },
};

export default notificationServices;
