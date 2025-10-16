// Patient Model - Defines the data structure and table schema
class Patient {
  // Table schema definition
  static tableName = "patients";

  // Column definitions for MySQL
  static columns = {
    id: "INT AUTO_INCREMENT PRIMARY KEY",
    last_name: "VARCHAR(255) NOT NULL",
    first_name: "VARCHAR(255) NOT NULL",
    middle_name: "VARCHAR(255)",
    patient_id: "VARCHAR(255) UNIQUE",
    category_id: "INT",
    birthday: "DATE",
    sex: "VARCHAR(50)",
    blood_group: "VARCHAR(10)",
    blood_pressure: "VARCHAR(50)",
    height: "VARCHAR(50)",
    weight: "VARCHAR(50)",
    marital_status: "VARCHAR(50)",
    age: "INT",
    address: "TEXT",
    mobileno: "VARCHAR(20)",
    email: "VARCHAR(255) UNIQUE",
    password: "VARCHAR(255)",
    photo: "TEXT",
    guardian: "VARCHAR(255)",
    relationship: "VARCHAR(100)",
    gua_mobileno: "VARCHAR(20)",
    source: "INT",
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

  // Constructor for creating patient instances
  constructor(data = {}) {
    Object.keys(this.constructor.columns).forEach((key) => {
      this[key] = data[key] || null;
    });
  }
}

export default Patient;
