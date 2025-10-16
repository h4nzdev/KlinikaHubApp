// Appointment Model - Defines the data structure and table schema
class Appointment {
  // Table schema definition
  static tableName = "appointment";

  // Column definitions for MySQL
  static columns = {
    id: "INT AUTO_INCREMENT PRIMARY KEY",
    appointment_id: "VARCHAR(255) NOT NULL",
    clinic_id: "INT NOT NULL",
    doctor_id: "INT NOT NULL",
    patient_id: "INT NOT NULL",
    consultation_fees: "DECIMAL(10,2) NOT NULL",
    discount: "DECIMAL(10,2) DEFAULT 0.00",
    schedule: "DATETIME",
    remarks: "TEXT",
    appointment_date: "DATE NOT NULL",
    status: "TINYINT DEFAULT 0", // 0=pending, 1=confirmed, 2=completed, 3=cancelled
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  };

  // Returns SQL CREATE TABLE statement
  static getCreateTableSQL() {
    const columns = Object.entries(this.columns)
      .map(([name, definition]) => `${name} ${definition}`)
      .join(", ");

    return `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columns})`;
  }

  // SQL for getting appointments with clinic and doctor details
  static getAppointmentsWithDetailsSQL() {
    return `
      SELECT 
        a.*,
        gs.institute_name as clinic_name,
        s.name as doctor_name,
        s.specialties as doctor_specialties,
        s.qualification as doctor_qualification
      FROM ${this.tableName} a
      LEFT JOIN clinics gs ON a.clinic_id = gs.id
      LEFT JOIN staff s ON a.doctor_id = s.id
    `;
  }

  // SQL for getting appointments by patient ID with details
  static getAppointmentsByPatientIdWithDetailsSQL() {
    return `
      SELECT 
        a.*,
        gs.institute_name as clinic_name,
        s.name as doctor_name,
        s.specialties as doctor_specialties,
        s.qualification as doctor_qualification
      FROM ${this.tableName} a
      LEFT JOIN clinics gs ON a.clinic_id = gs.id
      LEFT JOIN staff s ON a.doctor_id = s.id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC, a.created_at DESC
    `;
  }

  // SQL for getting single appointment with details
  static getAppointmentWithDetailsSQL() {
    return `
      SELECT 
        a.*,
        gs.institute_name as clinic_name,
        gs.address as clinic_address,
        gs.mobileno as clinic_phone,
        s.name as doctor_name,
        s.specialties as doctor_specialties,
        s.qualification as doctor_qualification,
        s.experience_years as doctor_experience,
        s.photo as doctor_photo
      FROM ${this.tableName} a
      LEFT JOIN clinics gs ON a.clinic_id = gs.id
      LEFT JOIN staff s ON a.doctor_id = s.id
      WHERE a.id = ? OR a.appointment_id = ?
    `;
  }

  // Constructor for creating appointment instances
  constructor(data = {}) {
    Object.keys(this.constructor.columns).forEach((key) => {
      this[key] = data[key] || null;
    });

    // Add joined fields if they exist in data
    this.clinic_name = data.clinic_name || null;
    this.doctor_name = data.doctor_name || null;
    this.doctor_specialties = data.doctor_specialties || null;
    this.doctor_qualification = data.doctor_qualification || null;
    this.clinic_address = data.clinic_address || null;
    this.clinic_phone = data.clinic_phone || null;
    this.doctor_experience = data.doctor_experience || null;
    this.doctor_photo = data.doctor_photo || null;
  }
}

export default Appointment;
