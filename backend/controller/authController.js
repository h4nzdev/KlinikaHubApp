import database from "../config/database.js";
import Patient from "../model/Patient.js";
import cloudinary from "../config/cloudinary.js";
import brevoService from "../services/brevoService.js";
import { generateVerificationCode } from "../utils/generateCode.js";
import bcrypt from "bcrypt";

// In-memory storage for verification codes (replace with database later)
const verificationCodes = new Map(); // email -> { code, expiresAt, patientData }

class AuthController {
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

  // ✅ NEW: Request verification code
  async requestVerificationCode(email) {
    try {
      // Validate email
      if (!email || !email.includes("@")) {
        throw new Error("Valid email is required");
      }

      // Check if email already exists
      const exists = await this.checkPatientExists(email);
      if (exists) {
        throw new Error("Email already registered");
      }

      // Generate verification code
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store code in memory
      verificationCodes.set(email, { code, expiresAt });

      // Send email via Brevo
      const emailResult = await brevoService.sendVerificationEmail(email, code);

      if (!emailResult.success) {
        throw new Error("Failed to send verification email");
      }

      console.log(`✅ Verification code ${code} sent to ${email}`);

      return {
        success: true,
        message: "Verification code sent successfully",
        expiresIn: "10 minutes",
      };
    } catch (error) {
      console.error("❌ Error in requestVerificationCode:", error);
      throw error;
    }
  }

  async uploadPhotoDuringRegistration(base64Image) {
    try {
      console.log("🔄 Uploading patient photo during registration...");
      console.log(
        "📊 Base64 data sample:",
        base64Image?.substring(0, 100) + "..."
      );
      console.log("📏 Base64 data length:", base64Image?.length);

      // Test if it's a valid base64 string
      if (!base64Image || typeof base64Image !== "string") {
        throw new Error("Invalid base64 image data");
      }

      // Check if it starts with data:image/
      if (!base64Image.startsWith("data:image/")) {
        console.log(
          "⚠️ Base64 data doesn't start with data:image/, adding prefix..."
        );
        base64Image = `data:image/jpeg;base64,${base64Image}`;
      }

      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "patient_profiles",
        resource_type: "image",
        transformation: [
          { width: 300, height: 300, crop: "fill" },
          { quality: "auto" },
          { format: "jpg" },
        ],
      });

      console.log(
        "✅ Patient photo uploaded during registration:",
        result.secure_url
      );
      return result.secure_url;
    } catch (error) {
      console.error("❌ Cloudinary upload error during registration:", error);
      console.error("🔍 Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      throw new Error(
        "Failed to upload patient photo during registration: " + error.message
      );
    }
  }

  // ✅ NEW: Verify code and register patient
  async verifyAndRegister(email, code, patientData) {
    try {
      // Validate input
      if (!email || !code) {
        throw new Error("Email and verification code are required");
      }

      // Check if code exists and is valid
      const storedData = verificationCodes.get(email);

      if (!storedData) {
        throw new Error("No verification code found for this email");
      }

      // Check if code matches
      if (storedData.code !== code) {
        throw new Error("Invalid verification code");
      }

      // Check if code expired
      if (new Date() > storedData.expiresAt) {
        verificationCodes.delete(email); // Clean up expired code
        throw new Error("Verification code has expired");
      }

      // Code is valid! Proceed with registration
      let photoUrl = "";
      if (patientData.localImage) {
        console.log("🔄 Converting local image to base64 for upload...");

        // Convert local image URI to base64
        const base64Image = await this.convertImageToBase64(
          patientData.localImage
        );
        photoUrl = await this.uploadPhotoDuringRegistration(base64Image);
      }

      // Prepare final patient data with photo URL
      const finalPatientData = {
        ...patientData,
        photo: photoUrl,
        localImage: undefined, // Remove the temporary local image field
      };

      // Register the patient
      const registrationResult = await this.register(finalPatientData);

      console.log(
        `✅ Email ${email} verified and patient registered successfully`
      );

      return {
        success: true,
        message: "Email verified and registration completed",
        patient: registrationResult.patient,
      };
    } catch (error) {
      console.error("❌ Error in verifyAndRegister:", error);
      throw error;
    }
  }

  async convertImageToBase64(base64Data) {
    try {
      console.log("🔧 Processing base64 image data from frontend...");
      console.log(
        "📊 Received base64 sample:",
        base64Data?.substring(0, 100) + "..."
      );

      // The frontend already converted it, so we should just validate and use it
      if (!base64Data || typeof base64Data !== "string") {
        throw new Error("No base64 image data received");
      }

      // If it's already a data URL, use it directly
      if (base64Data.startsWith("data:image/")) {
        console.log("✅ Using frontend-provided base64 data URL");
        return base64Data;
      }

      // If it's raw base64, add the prefix
      console.log("🔄 Adding data URL prefix to raw base64");
      return `data:image/jpeg;base64,${base64Data}`;
    } catch (error) {
      console.error("❌ Error processing base64 image:", error);
      throw new Error("Failed to process image data: " + error.message);
    }
  }

  // ✅ UPDATED: Patient Registration (with verification check)
  async register(patientData) {
    try {
      const db = await this.initDB();

      // Check if email already exists
      const exists = await this.checkPatientExists(patientData.email);
      if (exists) {
        throw new Error("Email already registered");
      }

      // Hash password first
      const hashedPassword = patientData.password
        ? await bcrypt.hash(patientData.password, 10)
        : null;

      // Filter out id and timestamp fields (auto-generated)
      const insertableColumns = Object.keys(Patient.columns).filter(
        (key) => !["id", "created_at", "updated_at"].includes(key)
      );

      const columns = insertableColumns.join(", ");
      const placeholders = insertableColumns.map(() => "?").join(", ");

      const values = insertableColumns.map((key) => {
        // Handle password hashing
        if (key === "password") {
          return hashedPassword;
        }
        // Provide default values for required fields if missing
        if (key === "patient_id" && !patientData[key]) {
          return `PAT${Date.now()}`; // Generate unique patient ID
        }
        if (key === "category_id" && !patientData[key]) {
          return 1; // Default category
        }
        if (key === "source" && !patientData[key]) {
          return 1; // Default source
        }
        return patientData[key] || null;
      });

      const sql = `INSERT INTO patients (${columns}) VALUES (${placeholders})`;
      const [result] = await db.execute(sql, values);

      console.log("✅ Patient registered with ID:", result.insertId);
      return {
        success: true,
        patient: {
          id: result.insertId,
          ...patientData,
          password: undefined, // Don't return password
        },
      };
    } catch (err) {
      console.log("❌ Patient registration error:", err);
      throw err;
    }
  }

  // ✅ NEW: Resend verification code
  async resendVerificationCode(email) {
    try {
      // Check if there's an existing code
      const existingCode = verificationCodes.get(email);

      if (existingCode) {
        // Check if we should wait before resending (prevent spam)
        const timeSinceLastSent = Date.now() - existingCode.createdAt;
        if (timeSinceLastSent < 60000) {
          // 1 minute cooldown
          throw new Error("Please wait before requesting a new code");
        }

        // Remove existing code
        verificationCodes.delete(email);
      }

      // Generate new code and send
      return await this.requestVerificationCode(email);
    } catch (error) {
      console.error("❌ Error in resendVerificationCode:", error);
      throw error;
    }
  }

  // Patient Login
  async login(email, password) {
    try {
      const db = await this.initDB();

      // Check if email is provided
      if (!email || email.trim() === "") {
        throw new Error("Email is required");
      }

      // Check if password is provided
      if (!password || password.trim() === "") {
        throw new Error("Password is required");
      }

      // Check if email format is valid
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Check if password meets minimum length
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const [rows] = await db.execute(
        "SELECT * FROM patients WHERE email = ?",
        [email]
      );
      const patient = rows[0];

      if (!patient) {
        throw new Error("No account found with this email address");
      } else if (!(await bcrypt.compare(password, patient.password))) {
        throw new Error("Incorrect password. Please try again");
      } else {
        return {
          success: true,
          patient: {
            ...patient,
            password: undefined,
            role: "patient",
          },
        };
      }
    } catch (err) {
      console.log("❌ Login error:", err);

      // If it's already a specific error (like "Incorrect password"), just re-throw it
      if (
        err.message.includes("Incorrect password") ||
        err.message.includes("No account found") ||
        err.message.includes("Email is required") ||
        err.message.includes("Password is required") ||
        err.message.includes("valid email address")
      ) {
        throw err; // Just re-throw the original error
      } else {
        // Only throw "Database error" for actual database issues
        throw new Error("Database error occurred");
      }
    }
  }

  // Check if patient exists
  async checkPatientExists(email) {
    try {
      const db = await this.initDB();
      const [rows] = await db.execute(
        "SELECT id FROM patients WHERE email = ?",
        [email]
      );
      return rows.length > 0;
    } catch (err) {
      throw err;
    }
  }

  // Upload patient photo
  async uploadPatientPhoto(base64Image) {
    try {
      console.log("🔄 Uploading patient photo to Cloudinary...");

      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64Image}`,
        {
          folder: "patient_profiles",
          resource_type: "image",
          transformation: [
            { width: 300, height: 300, crop: "fill" },
            { quality: "auto" },
            { format: "jpg" },
          ],
        }
      );

      console.log(
        "✅ Patient photo uploaded to Cloudinary:",
        result.secure_url
      );
      return result.secure_url;
    } catch (error) {
      console.error("❌ Cloudinary upload error:", error);
      throw new Error("Failed to upload patient photo");
    }
  }
  // ✅ NEW: Update patient profile picture
  async updatePatientProfilePicture(patientId, base64Image) {
    try {
      console.log("🔄 Updating profile picture for patient:", patientId);

      // Upload to Cloudinary
      const photoUrl = await this.uploadPhotoDuringRegistration(base64Image);

      const db = await this.initDB();

      // Update the patient record with new photo URL
      const sql = "UPDATE patients SET photo = ? WHERE id = ?";
      const [result] = await db.execute(sql, [photoUrl, patientId]);

      if (result.affectedRows === 0) {
        throw new Error("Patient not found");
      }

      console.log("✅ Profile picture updated in database:", photoUrl);

      // ✅ Create the response object
      const response = {
        success: true,
        message: "Profile picture updated successfully",
        photo: photoUrl,
      };

      console.log("📤 Sending response:", response);

      return response;
    } catch (error) {
      console.error("❌ Error updating profile picture:", error);
      throw new Error("Failed to update profile picture: " + error.message);
    }
  }
  // Add to your existing AuthController class

  // Send password change verification
  async sendPasswordChangeVerification(email, currentPassword) {
    try {
      const db = await this.initDB();

      // 1. Find patient by email
      const [rows] = await db.execute(
        "SELECT * FROM patients WHERE email = ?",
        [email]
      );
      const patient = rows[0];

      if (!patient) {
        throw new Error("Patient not found");
      }

      // 2. Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        patient.password
      );
      if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // 3. Generate verification code
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store code in memory (you can reuse your existing verificationCodes map)
      verificationCodes.set(email, { code, expiresAt });

      // 4. Send email via Brevo
      const emailResult = await brevoService.sendVerificationEmail(email, code);

      if (!emailResult.success) {
        throw new Error("Failed to send verification email");
      }

      console.log(
        `✅ Password change verification code ${code} sent to ${email}`
      );

      return {
        success: true,
        message: "Verification code sent successfully",
      };
    } catch (error) {
      console.error("❌ Error in sendPasswordChangeVerification:", error);
      throw error;
    }
  }

  // Verify and change password
  async verifyAndChangePassword(
    email,
    verificationCode,
    currentPassword,
    newPassword
  ) {
    try {
      const db = await this.initDB();

      // 1. Verify the code
      const storedData = verificationCodes.get(email);
      if (!storedData) {
        throw new Error("No verification code found for this email");
      }

      if (storedData.code !== verificationCode) {
        throw new Error("Invalid verification code");
      }

      if (new Date() > storedData.expiresAt) {
        verificationCodes.delete(email);
        throw new Error("Verification code has expired");
      }

      // 2. Find patient and verify current password again
      const [rows] = await db.execute(
        "SELECT * FROM patients WHERE email = ?",
        [email]
      );
      const patient = rows[0];

      if (!patient) {
        throw new Error("Patient not found");
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        patient.password
      );
      if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // 3. Hash new password and update
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      const updateSql = "UPDATE patients SET password = ? WHERE email = ?";
      const [result] = await db.execute(updateSql, [hashedNewPassword, email]);

      if (result.affectedRows === 0) {
        throw new Error("Failed to update password");
      }

      // 4. Clean up verification code
      verificationCodes.delete(email);

      console.log(`✅ Password changed successfully for ${email}`);

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      console.error("❌ Error in verifyAndChangePassword:", error);
      throw error;
    }
  }
}

export default new AuthController();
