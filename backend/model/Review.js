// Review Model - Defines the data structure and table schema for patient reviews
class Review {
  // Table schema definition
  static tableName = "reviews";

  // Column definitions for MySQL
  static columns = {
    id: "INT AUTO_INCREMENT PRIMARY KEY",
    review_id: "VARCHAR(255) NOT NULL UNIQUE",
    clinic_id: "INT NOT NULL",
    patient_id: "INT NOT NULL",
    appointment_id: "INT", // Optional: link to specific appointment
    doctor_id: "INT", // Optional: review for specific doctor
    rating: "TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5)",
    title: "VARCHAR(255)", // Optional review title
    comment: "TEXT", // The main review content
    is_verified: "BOOLEAN DEFAULT FALSE", // Whether the reviewer is verified patient
    is_anonymous: "BOOLEAN DEFAULT FALSE", // If patient wants to remain anonymous
    status: "TINYINT DEFAULT 2", // 0=rejected, 1=pending, 2=approved, 3=hidden
    helpful_count: "INT DEFAULT 0", // Number of users who found this helpful
    reply_message: "TEXT", // Clinic/doctor's reply to the review
    replied_by: "INT", // Staff ID who replied
    replied_at: "DATETIME",
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

  // SQL for getting reviews with patient, clinic, and doctor details
  static getReviewsWithDetailsSQL() {
    return `
      SELECT 
        r.*,
        p.first_name as patient_name,
        p.photo as patient_photo,
        c.institute_name as clinic_name,
        c.address as clinic_address,
        s.name as doctor_name,
        s.specialties as doctor_specialties,
        app.appointment_date,
        app.status as appointment_status,
        staff_replier.name as replied_by_name
      FROM ${this.tableName} r
      LEFT JOIN patients p ON r.patient_id = p.id
      LEFT JOIN clinics c ON r.clinic_id = c.id
      LEFT JOIN staff s ON r.doctor_id = s.id
      LEFT JOIN appointment app ON r.appointment_id = app.id
      LEFT JOIN staff staff_replier ON r.replied_by = staff_replier.id
      WHERE r.status = 2 -- Only approved reviews
      ORDER BY r.created_at DESC
    `;
  }

  // SQL for getting reviews by clinic ID with patient details
  static getReviewsByClinicIdWithDetailsSQL() {
    return `
      SELECT 
        r.*,
        p.first_name as patient_name,
        p.photo as patient_photo,
        s.name as doctor_name,
        s.specialties as doctor_specialties,
        app.appointment_date
      FROM ${this.tableName} r
      LEFT JOIN patients p ON r.patient_id = p.id
      LEFT JOIN staff s ON r.doctor_id = s.id
      LEFT JOIN appointment app ON r.appointment_id = app.id
      WHERE r.clinic_id = ? AND r.status = 2
      ORDER BY 
        r.created_at DESC,
        r.helpful_count DESC
    `;
  }

  // SQL for getting reviews by patient ID
  static getReviewsByPatientIdSQL() {
    return `
      SELECT 
        r.*,
        c.institute_name as clinic_name,
        s.name as doctor_name,
        s.specialties as doctor_specialties
      FROM ${this.tableName} r
      LEFT JOIN clinics c ON r.clinic_id = c.id
      LEFT JOIN staff s ON r.doctor_id = s.id
      WHERE r.patient_id = ?
      ORDER BY r.created_at DESC
    `;
  }

  // SQL for getting clinic rating statistics
  static getClinicRatingStatsSQL() {
    return `
      SELECT 
        clinic_id,
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM ${this.tableName}
      WHERE status = 2
      GROUP BY clinic_id
    `;
  }

  // SQL for getting doctor rating statistics
  static getDoctorRatingStatsSQL() {
    return `
      SELECT 
        doctor_id,
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating
      FROM ${this.tableName}
      WHERE doctor_id IS NOT NULL AND status = 2
      GROUP BY doctor_id
    `;
  }

  // SQL for checking if patient has already reviewed an appointment
  static getReviewByAppointmentAndPatientSQL() {
    return `
      SELECT * FROM ${this.tableName}
      WHERE appointment_id = ? AND patient_id = ?
      LIMIT 1
    `;
  }

  // Constructor for creating review instances
  constructor(data = {}) {
    Object.keys(this.constructor.columns).forEach((key) => {
      this[key] = data[key] || null;
    });

    // Add joined fields if they exist in data
    this.patient_name = data.patient_name || null;
    this.patient_photo = data.patient_photo || null;
    this.clinic_name = data.clinic_name || null;
    this.clinic_address = data.clinic_address || null;
    this.doctor_name = data.doctor_name || null;
    this.doctor_specialties = data.doctor_specialties || null;
    this.appointment_date = data.appointment_date || null;
    this.appointment_status = data.appointment_status || null;
    this.replied_by_name = data.replied_by_name || null;
  }
}

export default Review;
