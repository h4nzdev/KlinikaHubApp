class Notification {
  // Table schema definition
  static tableName = "notifications";

  // Column definitions for MySQL
  static columns = {
    id: "INT AUTO_INCREMENT PRIMARY KEY",
    user_id: "INT NOT NULL", // Who receives the notification
    title: "VARCHAR(255) NOT NULL",
    message: "TEXT NOT NULL", // This will store health tips like "💧 Drink water!"
    type: "VARCHAR(50) DEFAULT 'info'", // 'health_tip', 'appointment', 'reminder', etc.
    is_read: "BOOLEAN DEFAULT FALSE",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    updated_at:
      "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
  };

  // Returns SQL CREATE TABLE statement
  static getCreateTableSQL() {
    const columns = Object.entries(this.columns)
      .map(([name, definition]) => `${name} ${definition}`)
      .join(", ");

    return `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columns})`;
  }

  // Constructor for creating notification instances
  constructor(data = {}) {
    Object.keys(this.constructor.columns).forEach((key) => {
      this[key] = data[key] || null;
    });
  }

  // 🌟 Special method for health tip notifications
  static createHealthTip(userId, healthTipMessage) {
    return new Notification({
      user_id: userId,
      title: "🌟 Health Tip",
      message: healthTipMessage, // "💧 Drink water! Stay hydrated!"
      type: "health_tip",
    });
  }
}

export default Notification;
