import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import clinicServices from "../services/clinicServices.js";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Simple in-memory storage for conversation context AND clinics cache
const conversationMemory = new Map();
let clinicsCache = null;
let lastClinicsFetch = 0;
const CLINICS_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Fetch and cache clinics
async function getClinicsWithCache() {
  const now = Date.now();

  if (!clinicsCache || now - lastClinicsFetch > CLINICS_CACHE_DURATION) {
    try {
      console.log("🔄 Fetching fresh clinics data...");
      const clinics = await clinicServices.getAllClinics();
      clinicsCache = clinics;
      lastClinicsFetch = now;
      console.log(`✅ Cached ${clinics.length} clinics`);
      return clinics;
    } catch (error) {
      console.error("❌ Failed to fetch clinics:", error);
      return clinicsCache || [];
    }
  }

  console.log(`💾 Using cached clinics (${clinicsCache.length} clinics)`);
  return clinicsCache;
}

// Generate clinic context for AI
function generateClinicsContext(clinics) {
  if (!clinics || clinics.length === 0) {
    return "No clinics available in the system.";
  }

  let context = "AVAILABLE CLINICS IN THE SYSTEM:\n\n";

  clinics.forEach((clinic, index) => {
    context += `🏥 CLINIC ${index + 1}:\n`;
    context += `- Name: ${
      clinic.clinic_name || clinic.institute_name || "Unnamed Clinic"
    }\n`;
    context += `- Type: ${
      clinic.clinic_type || clinic.primary_category || "General"
    }\n`;

    if (clinic.specialties) {
      try {
        const specialties =
          typeof clinic.specialties === "string"
            ? JSON.parse(clinic.specialties)
            : clinic.specialties;
        if (Array.isArray(specialties) && specialties.length > 0) {
          context += `- Specialties: ${specialties.join(", ")}\n`;
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    if (clinic.address) {
      context += `- Location: ${clinic.address.substring(0, 100)}${
        clinic.address.length > 100 ? "..." : ""
      }\n`;
    }

    context += `- Status: ${clinic.status || "active"}\n`;
    context += `- Contact: ${
      clinic.contact_number || clinic.mobileno || "N/A"
    }\n\n`;
  });

  return context;
}

// Enhanced session management with clinic awareness
function getSession(sessionId) {
  if (!conversationMemory.has(sessionId)) {
    conversationMemory.set(sessionId, {
      messages: [],
      lastActivity: Date.now(),
      patientInfo: {},
      mentionedSymptoms: new Set(),
      potentialClinics: [],
    });
  }

  const session = conversationMemory.get(sessionId);
  session.lastActivity = Date.now();
  return session;
}

// Enhanced patient info extraction with symptom-clinic matching
function extractPatientInfo(session, userMessage, aiResponse, allClinics) {
  const lowerMessage = userMessage.toLowerCase();

  // Extract symptoms with better matching
  const symptomKeywords = [
    "fever",
    "cough",
    "headache",
    "pain",
    "hurt",
    "stomach",
    "rash",
    "cold",
    "flu",
    "sore throat",
    "nausea",
    "vomiting",
    "diarrhea",
    "chest pain",
    "shortness of breath",
    "dizziness",
    "fatigue",
    "allergy",
    "asthma",
    "diabetes",
    "hypertension",
    "arthritis",
    "migraine",
    "back pain",
  ];

  const mentionedSymptoms = symptomKeywords.filter((symptom) =>
    lowerMessage.includes(symptom)
  );

  if (mentionedSymptoms.length > 0) {
    mentionedSymptoms.forEach((symptom) =>
      session.mentionedSymptoms.add(symptom)
    );
    session.patientInfo.symptoms = Array.from(session.mentionedSymptoms);

    // Match symptoms with relevant clinics
    session.potentialClinics = matchClinicsToSymptoms(
      session.mentionedSymptoms,
      allClinics
    );
  }

  // Extract duration
  const durationMatch = userMessage.match(
    /(\d+)\s*(day|days|hour|hours|week|weeks)/i
  );
  if (durationMatch) {
    session.patientInfo.duration = durationMatch[0];
  }

  // Store severity
  if (aiResponse.severity) {
    session.patientInfo.lastSeverity = aiResponse.severity;
  }
}

// Match symptoms to relevant clinics
function matchClinicsToSymptoms(symptoms, clinics) {
  if (!symptoms.size || !clinics.length) return [];

  const symptomSpecialtyMap = {
    // General symptoms
    fever: ["General Medicine", "Internal Medicine", "Family Medicine"],
    cough: ["Pulmonology", "Internal Medicine", "General Medicine"],
    cold: ["General Medicine", "Internal Medicine", "Family Medicine"],
    headache: ["Neurology", "General Medicine", "Internal Medicine"],

    // Pain-related
    pain: ["General Medicine", "Pain Management", "Internal Medicine"],
    "chest pain": ["Cardiology", "Emergency Medicine", "Internal Medicine"],
    "back pain": ["Orthopedics", "Physical Therapy", "General Medicine"],

    // Gastrointestinal
    stomach: ["Gastroenterology", "Internal Medicine", "General Medicine"],
    nausea: ["Gastroenterology", "Internal Medicine", "General Medicine"],
    vomiting: ["Gastroenterology", "Internal Medicine", "Emergency Medicine"],
    diarrhea: ["Gastroenterology", "Internal Medicine", "General Medicine"],

    // Chronic conditions
    asthma: ["Pulmonology", "Allergy and Immunology", "Internal Medicine"],
    diabetes: ["Endocrinology", "Internal Medicine", "General Medicine"],
    hypertension: ["Cardiology", "Internal Medicine", "General Medicine"],
    arthritis: ["Rheumatology", "Orthopedics", "General Medicine"],
    migraine: ["Neurology", "General Medicine", "Internal Medicine"],

    // Other
    rash: ["Dermatology", "General Medicine", "Allergy and Immunology"],
    allergy: ["Allergy and Immunology", "Dermatology", "General Medicine"],
    dizziness: ["Neurology", "Internal Medicine", "General Medicine"],
    fatigue: ["Internal Medicine", "General Medicine", "Endocrinology"],
  };

  const matchedClinics = clinics.filter((clinic) => {
    const clinicType = (
      clinic.clinic_type ||
      clinic.primary_category ||
      ""
    ).toLowerCase();
    const specialties = getClinicSpecialties(clinic);

    return Array.from(symptoms).some((symptom) => {
      const relevantSpecialties = symptomSpecialtyMap[symptom] || [
        "General Medicine",
      ];
      return relevantSpecialties.some(
        (specialty) =>
          clinicType.includes(specialty.toLowerCase()) ||
          specialties.some((s) =>
            s.toLowerCase().includes(specialty.toLowerCase())
          )
      );
    });
  });

  return matchedClinics.slice(0, 3); // Return top 3 matches
}

function getClinicSpecialties(clinic) {
  if (!clinic.specialties) return [];

  try {
    return typeof clinic.specialties === "string"
      ? JSON.parse(clinic.specialties)
      : clinic.specialties;
  } catch (e) {
    return [];
  }
}

// Enhanced context generation with clinic awareness
function generateContext(session, allClinics) {
  let context = "PREVIOUS CONVERSATION CONTEXT:\n";

  // Patient info summary
  if (Object.keys(session.patientInfo).length > 0) {
    context += "PATIENT INFORMATION SUMMARY:\n";
    if (session.patientInfo.symptoms) {
      context += `- Symptoms mentioned: ${session.patientInfo.symptoms.join(
        ", "
      )}\n`;
    }
    if (session.patientInfo.duration) {
      context += `- Duration: ${session.patientInfo.duration}\n`;
    }
    if (session.patientInfo.lastSeverity) {
      context += `- Last assessed severity: ${session.patientInfo.lastSeverity}\n`;
    }
    context += "\n";
  }

  // Relevant clinics based on symptoms
  if (session.potentialClinics.length > 0) {
    context += "RELEVANT CLINICS BASED ON SYMPTOMS:\n";
    session.potentialClinics.forEach((clinic, index) => {
      context += `${index + 1}. ${
        clinic.clinic_name || clinic.institute_name
      } (${clinic.clinic_type || "General"})\n`;
    });
    context += "\n";
  }

  // Recent conversation
  const recentMessages = session.messages.slice(-4);
  if (recentMessages.length > 0) {
    context += "RECENT MESSAGES:\n";
    recentMessages.forEach((msg) => {
      const role = msg.role === "user" ? "USER" : "MEDORA AI";
      context += `${role}: ${msg.content}\n`;
    });
    context += "\n";
  }

  // Available clinics context
  context += generateClinicsContext(allClinics);
  context += "\nCURRENT CONVERSATION:\n";

  return context;
}

// Enhanced chat endpoint with clinic awareness
export const chatWithGemini = async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;

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
        maxOutputTokens: 350, // Increased for clinic recommendations
      },
    });

    // Get clinics and session
    const allClinics = await getClinicsWithCache();
    const session = getSession(sessionId);
    const context = generateContext(session, allClinics);

    const prompt = `
You are Medora AI, a SMART clinic-aware health assistant in the Philippines. You have access to ALL clinics in our system.

${context}

🚨 CLINIC-AWARE HEALTH ASSISTANT:
- Analyze symptoms and match with relevant clinics from our system
- Suggest specific clinics when appropriate
- Consider clinic specialties, availability, and patient symptoms
- Return JSON with this exact format:
{
  "severity": "MILD|MODERATE|SEVERE",
  "reply": "Your response mentioning relevant clinics when appropriate...",
  "emergency_trigger": true/false,
  "suggest_appointment": true/false,
  "appointment_reason": "Brief reason",
  "suggested_clinics": ["Clinic Name 1", "Clinic Name 2"] // Optional: array of relevant clinic names
}

CLINIC MATCHING GUIDELINES:
- For fever/cough/cold → General Medicine, Internal Medicine clinics
- For chest pain → Cardiology, Emergency clinics  
- For skin issues → Dermatology clinics
- For stomach issues → Gastroenterology clinics
- For chronic conditions → Relevant specialty clinics
- Always consider clinic availability and status

EMERGENCY PROTOCOL (suggest_appointment: false):
- Severe symptoms → Direct to emergency, don't suggest clinics
- Life-threatening conditions → Emergency contacts only

CLINIC RECOMMENDATION PROTOCOL (suggest_appointment: true):
- Mild/Moderate symptoms → Suggest 1-3 relevant clinics
- Mention clinic names naturally in your response
- Consider clinic specialties and patient location when possible

IMPORTANT: 
- Return ONLY valid JSON
- suggest_appointment should be true for non-emergency consultations
- Use clinic names from the available clinics list
- Be specific about which clinics could help

User: ${message}
Response:`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // JSON parsing (same as before)
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

    // Clean response
    let cleanReply = responseData.reply || responseText;
    cleanReply = cleanReply
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Enhanced final response with clinic suggestions
    const finalResponse = {
      severity: responseData.severity || classifySeverity(cleanReply),
      reply: cleanReply,
      emergency_trigger: responseData.emergency_trigger || false,
      suggest_appointment:
        responseData.suggest_appointment ||
        shouldSuggestAppointment(message, cleanReply),
      appointment_reason:
        responseData.appointment_reason || generateAppointmentReason(message),
      suggested_clinics: responseData.suggested_clinics || [],
      sessionId: sessionId,
    };

    // Update session with clinic awareness
    updateSession(sessionId, message, finalResponse, allClinics);

    console.log(
      `🤖 AI Response with ${finalResponse.suggested_clinics.length} clinic suggestions`
    );
    res.json(finalResponse);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error?.message || "Something went wrong" });
  }
};

// Enhanced session update with clinic data
function updateSession(sessionId, userMessage, aiResponse, allClinics) {
  const session = getSession(sessionId);

  session.messages.push({
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
  });

  session.messages.push({
    role: "assistant",
    content: aiResponse.reply,
    severity: aiResponse.severity,
    suggested_clinics: aiResponse.suggested_clinics,
    timestamp: new Date().toISOString(),
  });

  if (session.messages.length > 10) {
    session.messages = session.messages.slice(-10);
  }

  extractPatientInfo(session, userMessage, aiResponse, allClinics);
  return session;
}

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

// 🚨 Philippines Emergency contact function (unchanged)
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
