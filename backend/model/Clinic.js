// Clinic Model - Defines the data structure and table schema
class Clinic {
  // Table schema definition
  static tableName = "clinics";

  // Column definitions for MySQL
  static columns = {
    id: "INT AUTO_INCREMENT PRIMARY KEY",
    institute_name: "VARCHAR(255) NOT NULL",
    institute_email: "VARCHAR(255) NOT NULL",
    address: "TEXT NOT NULL",
    mobileno: "VARCHAR(20) NOT NULL",
    working_hours: "VARCHAR(255)",
    facebook_url: "TEXT",
    twitter_url: "TEXT",
    linkedin_url: "TEXT",
    youtube_url: "TEXT",
    // NEW: Category fields
    primary_category: "VARCHAR(100) DEFAULT 'general'",
    categories: "JSON DEFAULT ('[\"general\"]')", // JSON array
    specialties: "JSON",
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

  // Constructor for creating clinic instances
  constructor(data = {}) {
    Object.keys(this.constructor.columns).forEach((key) => {
      this[key] = data[key] || null;
    });
  }
}

export default Clinic;
