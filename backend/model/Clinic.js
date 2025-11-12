// Clinic Model - Transformed to match tenants table schema
class Clinic {
  // Table schema definition
  static tableName = "tenants";

  // Column definitions for MySQL - transformed to match tenants table
  static columns = {
    id: "INT AUTO_INCREMENT PRIMARY KEY",
    clinic_name: "VARCHAR(255) NOT NULL",
    clinic_type: "VARCHAR(50) NOT NULL DEFAULT 'general'",
    staff_count: "VARCHAR(20) NOT NULL DEFAULT '1-5'",
    first_name: "VARCHAR(100) NOT NULL DEFAULT ''",
    middle_name: "VARCHAR(100) DEFAULT NULL",
    last_name: "VARCHAR(100) NOT NULL DEFAULT ''",
    subdomain: "VARCHAR(50) NOT NULL",
    database_name: "VARCHAR(100) DEFAULT NULL",
    db_username: "VARCHAR(100) DEFAULT NULL",
    db_password: "VARCHAR(255) DEFAULT NULL",
    db_host: "VARCHAR(100) DEFAULT 'localhost'",
    contact_number: "VARCHAR(20) DEFAULT NULL",
    address: "TEXT DEFAULT NULL",
    email: "VARCHAR(255) NOT NULL",
    password: "VARCHAR(255) NOT NULL",
    plan_id: "INT(11) DEFAULT NULL",
    hear_about_us: "VARCHAR(50) DEFAULT NULL",
    status:
      "ENUM('pending','active','suspended','cancelled') DEFAULT 'pending'",
    trial_ends_at: "DATETIME DEFAULT NULL",
    subscription_status:
      "ENUM('trial','active','past_due','cancelled','expired') DEFAULT 'trial'",
    current_period_start: "DATETIME DEFAULT NULL",
    current_period_end: "DATETIME DEFAULT NULL",
    payment_method_id: "VARCHAR(255) DEFAULT NULL",
    last_payment_date: "DATETIME DEFAULT NULL",
    next_billing_date: "DATETIME DEFAULT NULL",
    subscription_ends_at: "DATETIME DEFAULT NULL",
    created_at: "DATETIME NOT NULL",
    updated_at: "DATETIME NOT NULL",
  };

  // Returns SQL CREATE TABLE statement
  static getCreateTableSQL() {
    const columns = Object.entries(this.columns)
      .map(([name, definition]) => `${name} ${definition}`)
      .join(", ");

    return `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columns})`;
  }

  // Constructor for creating clinic instances
  constructor(data = {}) {
    Object.keys(this.constructor.columns).forEach((key) => {
      this[key] = data[key] || null;
    });
  }
}

export default Clinic;
