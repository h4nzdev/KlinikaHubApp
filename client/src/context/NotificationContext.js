import React, { createContext, useContext, useState, useEffect } from "react";
import notificationServices from "../services/notificationServices";
import { AuthenticationContext } from "./AuthenticationContext";

// Create the context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useContext(AuthenticationContext);

  // Load notifications when user changes
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user?.id]);

  // Load all notifications for user
  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log("🔄 Loading notifications for user:", user.id);

      const notificationsData = await notificationServices.getUserNotifications(
        user.id
      );
      setNotifications(notificationsData || []);

      // Calculate unread count
      const unread = notificationsData?.filter((n) => !n.is_read)?.length || 0;
      setUnreadCount(unread);

      console.log("✅ Notifications loaded:", notificationsData?.length);
    } catch (error) {
      console.error("❌ Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh notifications (pull to refresh)
  const refreshNotifications = async () => {
    if (!user?.id) return;

    try {
      setRefreshing(true);
      await loadNotifications();
    } catch (error) {
      console.error("❌ Failed to refresh notifications:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationServices.markAsRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));

      console.log("✅ Notification marked as read:", notificationId);
    } catch (error) {
      console.error("❌ Failed to mark as read:", error);
      throw error;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await notificationServices.markAllAsRead(user.id);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );

      // Reset unread count
      setUnreadCount(0);

      console.log("✅ All notifications marked as read");
    } catch (error) {
      console.error("❌ Failed to mark all as read:", error);
      throw error;
    }
  };

  // Create a new notification
  const createNotification = async (notificationData) => {
    try {
      const newNotification = await notificationServices.createNotification({
        ...notificationData,
        user_id: user.id,
      });

      // Add to local state
      setNotifications((prev) => [newNotification.data, ...prev]);

      // If it's unread, increment count
      if (!newNotification.data.is_read) {
        setUnreadCount((prev) => prev + 1);
      }

      console.log("✅ Notification created:", newNotification.data.id);
      return newNotification;
    } catch (error) {
      console.error("❌ Failed to create notification:", error);
      throw error;
    }
  };

  // 🌟 Create health tip notification
  const createHealthTipNotification = async (healthTipMessage) => {
    try {
      const newNotification =
        await notificationServices.createHealthTipNotification(
          user.id,
          healthTipMessage
        );

      // Add to local state
      setNotifications((prev) => [newNotification.data, ...prev]);

      // Health tips are usually unread, so increment count
      setUnreadCount((prev) => prev + 1);

      console.log("✅ Health tip notification created:", healthTipMessage);
      return newNotification;
    } catch (error) {
      console.error("❌ Failed to create health tip notification:", error);
      throw error;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await notificationServices.deleteNotification(notificationId);

      // Remove from local state
      const deletedNotification = notifications.find(
        (n) => n.id === notificationId
      );
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      // Update unread count if deleted notification was unread
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      console.log("✅ Notification deleted:", notificationId);
    } catch (error) {
      console.error("❌ Failed to delete notification:", error);
      throw error;
    }
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter((notification) => notification.type === type);
  };

  // Get health tip notifications
  const getHealthTipNotifications = () => {
    return getNotificationsByType("health_tip");
  };

  // Value to be provided by context
  const value = {
    notifications,
    unreadCount,
    loading,
    refreshing,
    actions: {
      loadNotifications,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
      createNotification,
      createHealthTipNotification,
      deleteNotification,
      getNotificationsByType,
      getHealthTipNotifications,
    },
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
