// Appointment Model - Defines the data structure and table schema
class Appointment {
  // Table schema definition
  static tableName = "appointment";

  // Column definitions matching existing database
  static columns = {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    appointment_id: "TEXT NOT NULL",
    clinic_id: "INTEGER NOT NULL",
    doctor_id: "INTEGER NOT NULL",
    patient_id: "INTEGER NOT NULL",
    consultation_fees: "TEXT NOT NULL",
    discount: "DECIMAL(10,2) DEFAULT 0.00",
    schedule: "TEXT NOT NULL",
    remarks: "TEXT",
    appointment_date: "DATE NOT NULL",
    status: "INTEGER DEFAULT 0", // 0=pending, 1=confirmed, 2=completed, 3=cancelled
    created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
  };

  // Returns SQL CREATE TABLE statement
  static getCreateTableSQL() {
    const columns = Object.entries(this.columns)
      .map(([name, definition]) => `${name} ${definition}`)
      .join(", ");

    return `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columns})`;
  }

  // Constructor for creating appointment instances
  constructor(data = {}) {
    Object.keys(this.constructor.columns).forEach((key) => {
      this[key] = data[key] || null;
    });
  }
}

export default Appointment;
