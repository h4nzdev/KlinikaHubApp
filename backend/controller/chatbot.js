import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config()

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
        maxOutputTokens: 200,
      },
    });

    const prompt = `
You are Medora AI, a specialized virtual health assistant and symptom checker in the Philippines.

🚨 EMERGENCY DETECTION:
- Analyze the user's symptoms for severity
- Return a JSON response with this exact format:
{
  "severity": "MILD|MODERATE|SEVERE",
  "reply": "Your response text here...",
  "emergency_trigger": true/false
}

SEVERE SYMPTOMS (emergency_trigger: true):
- Chest pain, difficulty breathing, severe bleeding
- Sudden weakness/numbness, confusion, severe headache  
- Fainting, seizures, high fever with stiff neck
- Severe abdominal pain, poisoning, suicidal thoughts
- Signs of stroke or heart attack

MODERATE SYMPTOMS (emergency_trigger: false):
- Persistent fever, worsening cough, moderate pain
- Symptoms that concern you but aren't immediately life-threatening
- Diarrhea or vomiting that lasts more than 24 hours

MILD SYMPTOMS (emergency_trigger: false):
- Common cold, mild headache, minor aches
- Routine health questions, general wellness advice

User: ${message}
Response:`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the JSON response
    let responseData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if JSON parsing fails
        responseData = {
          severity: "MODERATE",
          reply: responseText,
          emergency_trigger: false,
        };
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      responseData = {
        severity: "MODERATE",
        reply: responseText,
        emergency_trigger: false,
      };
    }

    // Ensure all required fields
    const finalResponse = {
      severity: responseData.severity || "MODERATE",
      reply: responseData.reply || responseText,
      emergency_trigger: responseData.emergency_trigger || false,
    };

    res.json(finalResponse);
  } catch (error) {
    console.error("Chat error:", error);
    const msg = error?.message || "Something went wrong";
    res.status(500).json({ error: msg });
  }
};

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
