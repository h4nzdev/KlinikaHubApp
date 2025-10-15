import brevoService from "../services/brevoService.js"; // Your existing Brevo service

// Function to send SMS via Brevo Email-to-SMS
export const sendSMS = async (req, res) => {
  const { to, message } = req.body;

  try {
    // Use your existing Brevo service to send email-to-SMS
    const result = await brevoService.sendSMSReminder(to, message);

    if (result.success) {
      console.log("✅ SMS sent via Brevo to:", to);
      res
        .status(200)
        .json({ success: true, message: "SMS sent successfully!" });
    } else {
      console.error("❌ Brevo SMS failed:", result.message);
      res.status(500).json({ success: false, error: result.message });
    }
  } catch (error) {
    console.error("❌ Error sending SMS via Brevo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
