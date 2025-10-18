import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// In your backend chat endpoint
export const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Missing GEMINI_API_KEY in environment." });
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({ error: "Message is required." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 250, // Increased for appointment logic
      },
    });

    const prompt = `
You are Medora AI, a specialized virtual health assistant and symptom checker in the Philippines.

🚨 EMERGENCY DETECTION & APPOINTMENT ANALYSIS:
- Analyze the user's symptoms for severity
- Detect if they need to book a clinic appointment
- Return a JSON response with this exact format:
{
  "severity": "MILD|MODERATE|SEVERE",
  "reply": "Your response text here...",
  "emergency_trigger": true/false,
  "suggest_appointment": true/false,
  "appointment_reason": "Brief reason for appointment suggestion"
}

SEVERE SYMPTOMS (emergency_trigger: true, suggest_appointment: false):
- Chest pain, difficulty breathing, severe bleeding
- Sudden weakness/numbness, confusion, severe headache  
- Fainting, seizures, high fever with stiff neck
- Severe abdominal pain, poisoning, suicidal thoughts
- Signs of stroke or heart attack
→ DIRECT TO EMERGENCY, NOT APPOINTMENT

MODERATE SYMPTOMS (emergency_trigger: false, suggest_appointment: true):
- Persistent fever > 3 days, worsening cough, moderate pain
- Symptoms lasting more than 1 week
- Need for prescription medication
- Follow-up consultations
- Chronic condition management
- Specialist referral needed

MILD SYMPTOMS (suggest_appointment: true if requested or persistent):
- Common cold lasting > 1 week
- Mild symptoms that aren't improving
- Routine check-ups requested
- Vaccination inquiries
- Health screenings

APPOINTMENT TRIGGERS (suggest_appointment: true):
- "book appointment", "see doctor", "consult", "check-up"
- "schedule", "make appointment", "want to see doctor"
- Symptoms persisting beyond expected duration
- Need for prescription or medical certificate
- Follow-up mentions
- Chronic condition discussions

IMPORTANT: 
- Return ONLY the JSON object, no additional text
- No markdown formatting
- suggest_appointment should be true for non-emergency medical consultations

User: ${message}
Response:`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    console.log("🔍 Raw Gemini response:", responseText);

    // ✅ IMPROVED JSON EXTRACTION (same as before)
    let responseData;
    try {
      responseText = responseText.replace(/```json\s*|\s*```/g, "").trim();
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.log("🔄 First parse failed, trying regex extraction...");
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          responseData = JSON.parse(jsonMatch[0]);
        } catch (secondError) {
          console.error("❌ JSON parse error:", secondError);
          responseData = createFallbackResponse(responseText);
        }
      } else {
        console.error("❌ No JSON found in response");
        responseData = createFallbackResponse(responseText);
      }
    }

    // ✅ CLEAN THE REPLY TEXT
    let cleanReply = responseData.reply || responseText;
    cleanReply = cleanReply
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // ✅ ENSURE ALL REQUIRED FIELDS + APPOINTMENT LOGIC
    const finalResponse = {
      severity: responseData.severity || classifySeverity(cleanReply),
      reply: cleanReply,
      emergency_trigger: responseData.emergency_trigger || false,
      suggest_appointment:
        responseData.suggest_appointment ||
        shouldSuggestAppointment(message, cleanReply),
      appointment_reason:
        responseData.appointment_reason || generateAppointmentReason(message),
    };

    console.log("✅ Final response with appointment:", finalResponse);
    res.json(finalResponse);
  } catch (error) {
    console.error("Chat error:", error);
    const msg = error?.message || "Something went wrong";
    res.status(500).json({ error: msg });
  }
};

// ✅ HELPER: Smart appointment suggestion
function shouldSuggestAppointment(userMessage, botReply) {
  const lowerMessage = userMessage.toLowerCase();
  const lowerReply = botReply.toLowerCase();

  const appointmentKeywords = [
    // Direct requests
    "book appointment",
    "make appointment",
    "schedule appointment",
    "see doctor",
    "see a doctor",
    "consult doctor",
    "consultation",
    "check-up",
    "check up",
    "medical check",
    "clinic visit",

    // Symptom-based triggers
    "persistent",
    "lasting",
    "not getting better",
    "not improving",
    "worsening",
    "getting worse",
    "chronic",
    "recurring",

    // Medication needs
    "prescription",
    "medication",
    "antibiotics",
    "medical certificate",

    // Follow-up needs
    "follow up",
    "follow-up",
    "test results",
    "lab results",
  ];

  const severityKeywords = [
    "moderate",
    "severe",
    "worsening",
    "persistent",
    "chronic",
  ];

  // Check if user directly requests appointment
  const directRequest = appointmentKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );

  // Check if bot reply suggests medical consultation
  const botSuggests =
    lowerReply.includes("doctor") ||
    lowerReply.includes("consult") ||
    lowerReply.includes("medical attention") ||
    lowerReply.includes("appointment");

  // Check severity in the conversation
  const hasSeverity = severityKeywords.some(
    (keyword) => lowerMessage.includes(keyword) || lowerReply.includes(keyword)
  );

  return directRequest || (botSuggests && hasSeverity);
}

// ✅ HELPER: Generate appointment reason
function generateAppointmentReason(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("fever") || lowerMessage.includes("temperature")) {
    return "Persistent fever evaluation";
  } else if (lowerMessage.includes("cough") || lowerMessage.includes("cold")) {
    return "Respiratory symptoms consultation";
  } else if (lowerMessage.includes("pain") || lowerMessage.includes("hurt")) {
    return "Pain assessment and management";
  } else if (lowerMessage.includes("headache")) {
    return "Headache evaluation";
  } else if (
    lowerMessage.includes("stomach") ||
    lowerMessage.includes("abdominal")
  ) {
    return "Abdominal symptoms check-up";
  } else if (lowerMessage.includes("skin") || lowerMessage.includes("rash")) {
    return "Dermatological consultation";
  } else if (
    lowerMessage.includes("check") ||
    lowerMessage.includes("routine")
  ) {
    return "General health check-up";
  } else {
    return "Medical consultation";
  }
}

// ✅ Keep your existing helper functions (createFallbackResponse, classifySeverity)

// ✅ HELPER FUNCTION: Create fallback response from raw text
function createFallbackResponse(rawText) {
  // Clean the raw text
  const cleanText = rawText
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .trim();

  return {
    reply: cleanText,
    severity: classifySeverity(cleanText),
    emergency_trigger: false,
  };
}

// ✅ HELPER FUNCTION: Classify severity based on content
function classifySeverity(text) {
  const lowerText = text.toLowerCase();

  const severeKeywords = [
    "emergency",
    "immediate",
    "911",
    "urgent",
    "severe",
    "chest pain",
    "difficulty breathing",
    "bleeding",
    "unconscious",
    "heart attack",
    "stroke",
    "fainting",
    "seizure",
    "poisoning",
  ];

  const moderateKeywords = [
    "persistent",
    "worsening",
    "fever",
    "consult doctor",
    "medical attention",
    "hospital",
    "clinic",
    "appointment",
  ];

  if (severeKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "SEVERE";
  } else if (moderateKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "MODERATE";
  } else {
    return "MILD";
  }
}

// 🚨 Philippines Emergency contact function
export const getEmergencyContacts = async (req, res) => {
  try {
    const { severity, location } = req.body;

    // Philippines-specific emergency contacts
    const emergencyContacts = {
      SEVERE: {
        message: "🚨 IMMEDIATE MEDICAL ATTENTION REQUIRED - PHILIPPINES",
        contacts: [
          {
            name: "National Emergency Hotline",
            number: "911",
            type: "emergency",
            description: "Nationwide emergency response",
          },
          {
            name: "Philippine Red Cross",
            number: "143",
            type: "emergency",
            description: "Ambulance and emergency services",
          },
          {
            name: "Philippine National Police (PNP) Hotline",
            number: "117",
            type: "emergency",
            description: "Police and emergency assistance",
          },
          {
            name: "Bureau of Fire Protection",
            number: "160",
            type: "emergency",
            description: "Fire and rescue services",
          },
          {
            name: "National Poison Control",
            number: "(02) 8524-1078",
            type: "specialty",
            description:
              "UP Manila National Poison Management and Control Center",
          },
          {
            name: "National Center for Mental Health",
            number: "(02) 8531-9001",
            type: "mental_health",
            description: "24/7 Mental health crisis line",
          },
        ],
        actions: [
          "Call 911 or 143 immediately for emergency medical response",
          "Do not drive yourself to the hospital - wait for ambulance",
          "Have someone stay with you while waiting for help",
          "Prepare your PhilHealth information and identification",
          "Keep your location address ready to provide to responders",
        ],
        hospitals: [
          "Philippine General Hospital (PGH) - Manila",
          "St. Luke's Medical Center - Quezon City & Global City",
          "Makati Medical Center - Makati",
          "The Medical City - Pasig",
          "Asian Hospital and Medical Center - Muntinlupa",
        ],
      },
      MODERATE: {
        message: "⚠️ Medical Attention Recommended - PHILIPPINES",
        contacts: [
          {
            name: "DOH Hotline",
            number: "(02) 8651-7800",
            type: "government",
            description: "Department of Health information line",
          },
          {
            name: "Telemedicine Services",
            number: "Varies by provider",
            type: "telehealth",
            description:
              "Consult doctors online via KonsultaMD, SeeYouDoc, or Medgate",
          },
          {
            name: "Local Health Center",
            number: "Check your barangay",
            type: "local_health",
            description: "Visit your nearest barangay health center",
          },
          {
            name: "Mercury Drug Patient Care Line",
            number: "(02) 8911-5073",
            type: "pharmacy",
            description: "Medication and pharmacy questions",
          },
        ],
        actions: [
          "Visit your nearest hospital emergency room or urgent care",
          "Consult with a doctor within 24 hours",
          "Check if your HMO (Maxicare, Intellicare, etc.) has telemedicine",
          "Monitor symptoms closely and rest",
          "Keep hydrated with clean water and oral rehydration solutions",
        ],
        recommendations: [
          "Public Hospitals: PGH, East Avenue Medical Center, Jose R. Reyes Memorial Medical Center",
          "Private Hospitals: St. Luke's, Makati Med, Medical City branches",
          "Urgent Care: Hi-Precision Diagnostics, Healthway Medical clinics",
        ],
      },
      MILD: {
        message: "ℹ️ Self-Care Recommended - PHILIPPINES",
        contacts: [
          {
            name: "Botika ng Barangay",
            number: "Visit local barangay",
            type: "pharmacy",
            description: "Affordable medicines at your local barangay",
          },
          {
            name: "Mercury Drug / Watsons",
            number: "Visit nearest branch",
            type: "pharmacy",
            description: "Over-the-counter medications and consultations",
          },
          {
            name: "Barangay Health Center",
            number: "Check local barangay",
            type: "local_health",
            description: "Free basic medical consultation and services",
          },
          {
            name: "DOH Health Education Line",
            number: "(02) 8651-7800",
            type: "information",
            description: "General health information and advice",
          },
        ],
        actions: [
          "Visit your barangay health center for free consultation",
          "Get adequate rest and stay hydrated with clean water",
          "Use over-the-counter medicines from trusted pharmacies",
          "Practice proper hygiene and handwashing",
          "Consult a doctor if symptoms persist beyond 3 days",
        ],
        home_remedies: [
          "Ginger tea for nausea or sore throat",
          "Calamansi juice with honey for cough and cold",
          "Warm salt water gargle for sore throat",
          "Proper rest in well-ventilated area",
          "Balanced diet with fruits and vegetables",
        ],
      },
    };

    const response = emergencyContacts[severity] || emergencyContacts.MODERATE;

    res.json(response);
  } catch (error) {
    console.error("Emergency contacts error:", error);
    res.status(500).json({ error: "Failed to get emergency contacts" });
  }
};
