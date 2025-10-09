// Clinic Model - Defines the data structure and table schema
class Clinic {
  // Table schema definition
  static tableName = "global_settings";

  // Column definitions matching existing database
  static columns = {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    institute_name: "TEXT NOT NULL",
    institute_email: "TEXT NOT NULL",
    address: "TEXT NOT NULL",
    mobileno: "TEXT NOT NULL",
    working_hours: "TEXT",
    facebook_url: "TEXT",
    twitter_url: "TEXT",
    linkedin_url: "TEXT",
    youtube_url: "TEXT",
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

  // Constructor for creating clinic instances
  constructor(data = {}) {
    Object.keys(this.constructor.columns).forEach((key) => {
      this[key] = data[key] || null;
    });
  }
}

export default Clinic;
