// Doctor Model - Defines the data structure and table schema
class Doctor {
  // Table schema definition
  static tableName = "staff";

  // Column definitions for MySQL
  static columns = {
    id: "INT AUTO_INCREMENT PRIMARY KEY",
    staff_id: "VARCHAR(255) NOT NULL",
    clinic_id: "INT NOT NULL",
    name: "VARCHAR(255) NOT NULL",
    department: "INT NOT NULL DEFAULT 1",
    qualification: "TEXT",
    designation: "INT NOT NULL DEFAULT 1",
    joining_date: "DATE",
    birthday: "DATE",
    gender: "VARCHAR(50)",
    religion: "VARCHAR(100)",
    blood_group: "VARCHAR(10)",
    marital_status: "VARCHAR(50)",
    address: "TEXT",
    state: "VARCHAR(100)",
    city: "VARCHAR(100)",
    mobileno: "VARCHAR(20)",
    email: "VARCHAR(255)",
    salary_template_id: "INT DEFAULT 0",
    photo: "TEXT",
    nid: "VARCHAR(50)",
    facebook_url: "TEXT",
    linkedin_url: "TEXT",
    twitter_url: "TEXT",
    // Additional fields for doctor-specific data
    specialties: "JSON",
    experience_years: "INT DEFAULT 0",
    consultation_fee: "DECIMAL(10,2) DEFAULT 0.00",
    is_active: "TINYINT DEFAULT 1",
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

  // Constructor for creating doctor instances
  constructor(data = {}) {
    Object.keys(this.constructor.columns).forEach((key) => {
      this[key] = data[key] || null;
    });
  }
}

export default Doctor;
