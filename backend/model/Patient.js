// Patient Model - Defines the data structure and table schema
class Patient {
  // Table schema definition
  static tableName = "patients";

  // Column definitions matching your mock data
  static columns = {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    last_name: "TEXT NOT NULL",
    first_name: "TEXT NOT NULL",
    middle_name: "TEXT",
    patient_id: "TEXT UNIQUE",
    category_id: "INTEGER",
    birthday: "TEXT",
    sex: "TEXT",
    blood_group: "TEXT",
    blood_pressure: "TEXT",
    height: "TEXT",
    weight: "TEXT",
    marital_status: "TEXT",
    age: "TEXT",
    address: "TEXT",
    mobileno: "TEXT",
    email: "TEXT UNIQUE",
    password: "TEXT",
    photo: "TEXT",
    guardian: "TEXT",
    relationship: "TEXT",
    gua_mobileno: "TEXT",
    source: "INTEGER",
    created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    updated_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
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
