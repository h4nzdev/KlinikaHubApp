import database from "../config/database.js";
import Review from "../model/Review.js";

// Review Controller for Node.js/Express
class ReviewController {
  constructor() {
    this.db = null;
  }

  // Initialize database connection
  async initDB() {
    if (!this.db) {
      this.db = await database.getDatabase();
    }
    return this.db;
  }

  // Initialize review table
  async initTable() {
    try {
      const db = await this.initDB();
      await db.execute(Review.getCreateTableSQL());
      console.log("✅ Review table initialized");
    } catch (err) {
      console.log("❌ Review table init error:", err);
      throw err;
    }
  }

  // Create a new review
  async createReview(reviewData) {
    try {
      const db = await this.initDB();
      // Generate unique review_id if not provided
      const processedData = { ...reviewData };
      if (!processedData.review_id) {
        processedData.review_id = this.generateReviewId();
      }

      // Build dynamic SQL
      const columns = Object.keys(Review.columns).join(", ");
      const placeholders = Object.keys(Review.columns)
        .map(() => "?")
        .join(", ");
      const values = Object.keys(Review.columns).map((key) =>
        processedData.hasOwnProperty(key) ? processedData[key] : null
      );

      const sql = `INSERT INTO ${Review.tableName} (${columns}) VALUES (${placeholders})`;
      const [result] = await db.execute(sql, values);

      console.log("✅ Review created with ID:", result.insertId);
      return { id: result.insertId, ...reviewData };
    } catch (err) {
      console.log("❌ Review creation error:", err);
      throw err;
    }
  }

  // Get all reviews
  async getAllReviews() {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Review.tableName} ORDER BY created_at DESC`
      );
      console.log("✅ Reviews found:", rows.length);
      return rows;
    } catch (err) {
      console.log("❌ Reviews fetch error:", err);
      throw err;
    }
  }

  // Get review by ID
  async getReviewById(id) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Review.tableName} WHERE id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      console.log("❌ Review find error:", err);
      throw err;
    }
  }

  // Get reviews by patient ID
  async getReviewsByPatientId(patientId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Review.tableName} WHERE patient_id = ? ORDER BY created_at DESC`,
        [patientId]
      );
      console.log(`✅ Found ${rows.length} reviews for patient: ${patientId}`);
      return rows;
    } catch (err) {
      console.log("❌ Patient reviews fetch error:", err);
      throw err;
    }
  }

  // Get reviews by clinic ID
  async getReviewsByClinicId(clinicId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Review.tableName} WHERE clinic_id = ? ORDER BY created_at DESC`,
        [clinicId]
      );
      console.log(`✅ Found ${rows.length} reviews for clinic: ${clinicId}`);
      return rows;
    } catch (err) {
      console.log("❌ Clinic reviews fetch error:", err);
      throw err;
    }
  }

  // Get reviews by rating
  async getReviewsByRating(rating) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Review.tableName} WHERE rating = ? ORDER BY created_at DESC`,
        [rating]
      );
      console.log(`✅ Found ${rows.length} reviews with rating: ${rating}`);
      return rows;
    } catch (err) {
      console.log("❌ Rating reviews fetch error:", err);
      throw err;
    }
  }

  // Get reviews by status
  async getReviewsByStatus(status) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Review.tableName} WHERE status = ? ORDER BY created_at DESC`,
        [status]
      );
      console.log(`✅ Found ${rows.length} reviews with status: ${status}`);
      return rows;
    } catch (err) {
      console.log("❌ Status reviews fetch error:", err);
      throw err;
    }
  }

  // Get verified reviews only
  async getVerifiedReviews() {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        `SELECT * FROM ${Review.tableName} WHERE is_verified = true AND status = 1 ORDER BY created_at DESC`
      );
      console.log(`✅ Found ${rows.length} verified reviews`);
      return rows;
    } catch (err) {
      console.log("❌ Verified reviews fetch error:", err);
      throw err;
    }
  }

  // Update review
  async updateReview(id, reviewData) {
    try {
      const db = await this.initDB();
      const updates = Object.keys(reviewData)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = Object.keys(reviewData)
        .filter((key) => key !== "id")
        .map((key) => reviewData[key])
        .concat(id);

      const sql = `UPDATE ${Review.tableName} SET ${updates} WHERE id = ?`;
      await db.execute(sql, values);

      console.log("✅ Review updated:", id);
      return { id, ...reviewData };
    } catch (err) {
      console.log("❌ Review update error:", err);
      throw err;
    }
  }

  // Get reviews by patient ID WITH clinic and patient details
  async getReviewsByPatientIdWithDetails(patientId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(Review.getReviewsByPatientIdSQL(), [
        patientId,
      ]);
      console.log(
        `✅ Found ${rows.length} detailed reviews for patient: ${patientId}`
      );
      return rows;
    } catch (err) {
      console.log("❌ Patient reviews with details error:", err);
      throw err;
    }
  }

  // Get reviews by clinic ID WITH patient details
  async getReviewsByClinicIdWithDetails(clinicId) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        Review.getReviewsByClinicIdWithDetailsSQL(),
        [clinicId]
      );
      console.log(
        `✅ Found ${rows.length} detailed reviews for clinic: ${clinicId}`
      );
      return rows;
    } catch (err) {
      console.log("❌ Clinic reviews with details error:", err);
      throw err;
    }
  }

  // Get all reviews WITH clinic and patient details
  async getAllReviewsWithDetails() {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(Review.getReviewsWithDetailsSQL());
      console.log("✅ Reviews with details found:", rows.length);
      return rows;
    } catch (err) {
      console.log("❌ Reviews with details fetch error:", err);
      throw err;
    }
  }

  // Get clinic rating statistics
  async getClinicRatingStats(clinicId = null) {
    try {
      const db = await this.initDB();

      if (clinicId) {
        // Get stats for specific clinic
        const [rows] = await db.execute(
          `SELECT 
            clinic_id,
            COUNT(*) as total_reviews,
            AVG(rating) as average_rating,
            COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
            COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
            COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
            COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
            COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
          FROM ${Review.tableName}
          WHERE clinic_id = ? AND status = 1
          GROUP BY clinic_id`,
          [clinicId]
        );
        return rows[0] || null;
      } else {
        // Get stats for all clinics
        const [rows] = await db.execute(Review.getClinicRatingStatsSQL());
        return rows;
      }
    } catch (err) {
      console.log("❌ Clinic rating stats error:", err);
      throw err;
    }
  }

  // Update review status
  async updateReviewStatus(id, status) {
    try {
      const db = await this.initDB();
      await db.execute(
        `UPDATE ${Review.tableName} SET status = ? WHERE id = ?`,
        [status, id]
      );
      console.log("✅ Review status updated:", id, "to", status);
      return { id, status };
    } catch (err) {
      console.log("❌ Review status update error:", err);
      throw err;
    }
  }

  // Mark review as helpful
  async markReviewAsHelpful(id) {
    try {
      const db = await this.initDB();
      await db.execute(
        `UPDATE ${Review.tableName} SET helpful_count = helpful_count + 1 WHERE id = ?`,
        [id]
      );
      console.log("✅ Review marked as helpful:", id);
      return { id, action: "helpful" };
    } catch (err) {
      console.log("❌ Review helpful update error:", err);
      throw err;
    }
  }

  // Delete review
  async deleteReview(id) {
    try {
      const db = await this.initDB();
      await db.execute(`DELETE FROM ${Review.tableName} WHERE id = ?`, [id]);
      console.log("✅ Review deleted:", id);
      return { deletedId: id };
    } catch (err) {
      console.log("❌ Review delete error:", err);
      throw err;
    }
  }

  // HELPER: Generate unique review ID
  generateReviewId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `REV${timestamp}${random}`;
  }
}

// Export controller instance
export default new ReviewController();
