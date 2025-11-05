import database from "../config/database.js";
import Notification from "../model/Notification.js";

// Notification Controller - Simple and clean
class NotificationController {
  constructor() {
    this.db = null;
  }

  // Initialize database connection
  async initDB() {
    if (!this.db) {
      this.db = await database.getDatabase();
    }
    return this.db;
  }

  // Initialize notification table
  async initTable() {
    try {
      const db = await this.initDB();
      await db.execute(Notification.getCreateTableSQL());
      console.log("✅ Notification table initialized");
    } catch (err) {
      console.log("❌ Notification table init error:", err);
      throw err;
    }
  }

  // 🌟 Create a new notification
  async createNotification(notificationData) {
    try {
      const db = await this.initDB();

      const columns = Object.keys(Notification.columns).join(", ");
      const placeholders = Object.keys(Notification.columns)
        .map(() => "?")
        .join(", ");
      const values = Object.keys(Notification.columns).map(
        (key) => notificationData[key] || null
      );

      const sql = `INSERT INTO notifications (${columns}) VALUES (${placeholders})`;
      const [result] = await db.execute(sql, values);

      console.log("✅ Notification created with ID:", result.insertId);
      return { id: result.insertId, ...notificationData };
    } catch (err) {
      console.log("❌ Notification creation error:", err);
      throw err;
    }
  }

  // 🌟 Create health tip notification (special method)
  async createHealthTipNotification(userId, healthTipMessage) {
    try {
      const healthTipNotification = Notification.createHealthTip(
        userId,
        healthTipMessage
      );

      return await this.createNotification(healthTipNotification);
    } catch (err) {
      console.log("❌ Health tip notification error:", err);
      throw err;
    }
  }

  // Get all notifications for a user
  async getUserNotifications(userId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
      console.log(
        "✅ Notifications found for user:",
        userId,
        "count:",
        rows.length
      );
      return rows;
    } catch (err) {
      console.log("❌ Notifications fetch error:", err);
      throw err;
    }
  }

  // Get unread notifications for a user
  async getUnreadNotifications(userId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        "SELECT * FROM notifications WHERE user_id = ? AND is_read = FALSE ORDER BY created_at DESC",
        [userId]
      );
      console.log("✅ Unread notifications:", rows.length);
      return rows;
    } catch (err) {
      console.log("❌ Unread notifications error:", err);
      throw err;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const db = await this.initDB();
      await db.execute("UPDATE notifications SET is_read = TRUE WHERE id = ?", [
        notificationId,
      ]);
      console.log("✅ Notification marked as read:", notificationId);
      return { id: notificationId, is_read: true };
    } catch (err) {
      console.log("❌ Mark as read error:", err);
      throw err;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      const db = await this.initDB();
      await db.execute(
        "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
        [userId]
      );
      console.log("✅ All notifications marked as read for user:", userId);
      return { user_id: userId, all_read: true };
    } catch (err) {
      console.log("❌ Mark all as read error:", err);
      throw err;
    }
  }

  // Delete a notification
  async deleteNotification(notificationId) {
    try {
      const db = await this.initDB();
      await db.execute("DELETE FROM notifications WHERE id = ?", [
        notificationId,
      ]);
      console.log("✅ Notification deleted:", notificationId);
      return { deletedId: notificationId };
    } catch (err) {
      console.log("❌ Notification delete error:", err);
      throw err;
    }
  }

  // Get notifications by type (e.g., 'health_tip')
  async getNotificationsByType(userId, type) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        "SELECT * FROM notifications WHERE user_id = ? AND type = ? ORDER BY created_at DESC",
        [userId, type]
      );
      console.log(`✅ ${type} notifications:`, rows.length);
      return rows;
    } catch (err) {
      console.log("❌ Notifications by type error:", err);
      throw err;
    }
  }
}

// Export controller instance
export default new NotificationController();
