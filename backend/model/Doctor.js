// Doctor Model - Defines the data structure and table schema
class Doctor {
  // Table schema definition
  static tableName = "staff";

  // Column definitions matching existing database
  static columns = {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    staff_id: "TEXT NOT NULL",
    clinic_id: "INTEGER NOT NULL",
    name: "TEXT NOT NULL",
    department: "INTEGER NOT NULL DEFAULT 1",
    qualification: "TEXT",
    designation: "INTEGER NOT NULL DEFAULT 1",
    joining_date: "DATE",
    birthday: "DATE",
    gender: "TEXT",
    religion: "TEXT",
    blood_group: "TEXT",
    marital_status: "TEXT",
    address: "TEXT",
    state: "TEXT",
    city: "TEXT",
    mobileno: "TEXT",
    email: "TEXT",
    salary_template_id: "INTEGER DEFAULT 0",
    photo: "TEXT",
    nid: "TEXT",
    facebook_url: "TEXT",
    linkedin_url: "TEXT",
    twitter_url: "TEXT",
    // Additional fields for doctor-specific data
    specialties: "TEXT",
    experience_years: "INTEGER DEFAULT 0",
    consultation_fee: "DECIMAL(10,2) DEFAULT 0.00",
    is_active: "INTEGER DEFAULT 1",
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

  // Constructor for creating doctor instances
  constructor(data = {}) {
    Object.keys(this.constructor.columns).forEach((key) => {
      this[key] = data[key] || null;
    });
  }
}

export default Doctor;
