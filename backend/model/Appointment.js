class Appointment {
  static tableName = "appointment";

  // Status values from clinic database
  static STATUS = {
    NO_SHOW: "No Show",
    CONFIRMED: "Confirmed",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    PENDING: "Pending",
  };

  // Simple constructor matching CLINIC structure
  constructor(data = {}) {
    this.id = data.id || null;
    this.patient_id = data.patient_id || null;
    this.doctor_id = data.doctor_id || null;
    this.appointment_date = data.appointment_date || null;
    this.time_slot = data.time_slot || "";
    this.status = data.status || this.STATUS.NO_SHOW;
    this.notes = data.notes || null;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }
}

export default Appointment;
