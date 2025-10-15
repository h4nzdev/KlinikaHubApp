import brevo from "@getbrevo/brevo";

class BrevoService {
  constructor() {
    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );
  }

  async sendVerificationEmail(to, code) {
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();

      sendSmtpEmail.sender = {
        name: "KlinikaHub",
        email: "hanzhmagbal@gmail.com",
      };

      sendSmtpEmail.to = [{ email: to }];
      sendSmtpEmail.subject = "KlinikaHub - Verify Your Email";
      sendSmtpEmail.htmlContent = this.getVerificationTemplate(code);

      const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      console.log(`✅ Email sent to ${to} with code ${code}`);
      return {
        success: true,
        messageId: data.messageId,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      console.error("❌ Brevo API error:", error);
      return {
        success: false,
        message: "Failed to send verification email",
      };
    }
  }

  getVerificationTemplate(code) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #0891b2; text-align: center;">KlinikaHub Email Verification</h2>
        <p>Hello!</p>
        <p>Thank you for registering with KlinikaHub. Your verification code is:</p>
        <div style="background: #f8fafc; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #0891b2; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #64748b; font-size: 12px; text-align: center;">
          © 2024 KlinikaHub. All rights reserved.
        </p>
      </div>
    `;
  }
  // Add to your existing BrevoService class
  async sendSMSReminder(phoneNumber, message) {
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();

      // Philippine carrier email gateways
      const smsEmails = [
        `${phoneNumber}@sms.globe.com.ph`,
        `${phoneNumber}@messaging.smart.com.ph`,
      ];

      sendSmtpEmail.sender = {
        name: "KlinikaHub",
        email: "hanzhmagbal@gmail.com",
      };

      sendSmtpEmail.to = smsEmails.map((email) => ({ email }));
      sendSmtpEmail.subject = "Reminder";
      sendSmtpEmail.textContent = message;

      await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      console.log(`✅ SMS sent to ${phoneNumber}`);
      return { success: true, message: "SMS reminder sent" };
    } catch (error) {
      console.error("❌ SMS send failed:", error);
      return { success: false, message: "Failed to send SMS" };
    }
  }
}

// Create and export a singleton instance
export default new BrevoService();
