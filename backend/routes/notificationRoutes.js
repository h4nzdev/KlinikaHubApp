import express from "express";
import notificationController from "../controller/notificationController.js";

const notificationRouter = express.Router();

// Initialize notification table
notificationRouter.get("/init", async (req, res) => {
  try {
    await notificationController.initTable();
    res.json({
      success: true,
      message: "Notification table initialized successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ALL NOTIFICATIONS FOR USER
notificationRouter.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🔄 Fetching notifications for user ID: ${userId}`);

    const notifications = await notificationController.getUserNotifications(
      userId
    );
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error("❌ Get user notifications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET UNREAD NOTIFICATIONS FOR USER
notificationRouter.get("/user/:userId/unread", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🔄 Fetching unread notifications for user ID: ${userId}`);

    const notifications = await notificationController.getUnreadNotifications(
      userId
    );
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error("❌ Get unread notifications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET NOTIFICATIONS BY TYPE
notificationRouter.get("/user/:userId/type/:type", async (req, res) => {
  try {
    const { userId, type } = req.params;
    console.log(`🔄 Fetching ${type} notifications for user ID: ${userId}`);

    const notifications = await notificationController.getNotificationsByType(
      userId,
      type
    );
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error("❌ Get notifications by type error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE NEW NOTIFICATION
notificationRouter.post("/", async (req, res) => {
  try {
    const notificationData = req.body;
    console.log("🔄 Creating new notification");

    // Validate required fields
    if (!notificationData.user_id || !notificationData.message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, message",
      });
    }

    const newNotification = await notificationController.createNotification(
      notificationData
    );
    res.status(201).json({ success: true, data: newNotification });
  } catch (error) {
    console.error("❌ Create notification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🌟 CREATE HEALTH TIP NOTIFICATION
notificationRouter.post("/health-tip", async (req, res) => {
  try {
    const { user_id, message } = req.body;
    console.log("🔄 Creating health tip notification");

    if (!user_id || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, message",
      });
    }

    const newNotification =
      await notificationController.createHealthTipNotification(
        user_id,
        message
      );
    res.status(201).json({ success: true, data: newNotification });
  } catch (error) {
    console.error("❌ Create health tip notification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// MARK NOTIFICATION AS READ
notificationRouter.patch("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Marking notification as read ID: ${id}`);

    const result = await notificationController.markAsRead(id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Mark as read error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// MARK ALL NOTIFICATIONS AS READ FOR USER
notificationRouter.patch("/user/:userId/read-all", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🔄 Marking all notifications as read for user ID: ${userId}`);

    const result = await notificationController.markAllAsRead(userId);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Mark all as read error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE NOTIFICATION
notificationRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Deleting notification ID: ${id}`);

    await notificationController.deleteNotification(id);
    res.json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    console.error("❌ Delete notification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET NOTIFICATION BY ID
notificationRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Fetching notification ID: ${id}`);

    // Since we don't have getNotificationById in controller, we'll implement it here
    const db = await notificationController.initDB();
    const [rows] = await db.execute(
      "SELECT * FROM notifications WHERE id = ?",
      [id]
    );

    const notification = rows[0];
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error("❌ Get notification by ID error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default notificationRouter;
