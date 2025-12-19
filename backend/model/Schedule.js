class Schedule {
  static tableName = "schedule";

  constructor(data = {}) {
    this.id = data.id || null;
    this.day = data.day || null;
    this.doctor_id = data.doctor_id || null;
    this.time_start = data.time_start || null;
    this.time_end = data.time_end || null;
    this.per_patient_time = data.per_patient_time || 10;
    this.consultation_fees = data.consultation_fees || 0;
    this.active = data.active || 1;
  }
}

export default Schedule;
