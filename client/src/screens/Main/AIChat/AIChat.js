import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Header from "../../../components/Header";
import { useNavigation } from "@react-navigation/native";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import chatServices from "../../../services/chatServices";
import ChatHeader from "./components/ChatHeader";
import EmergencyBanner from "./components/EmergencyBanner";
import ChatMessages from "./components/ChatMessage";
import MessageInput from "./components/MessageInput";
import SampleQuestions from "./components/SampleQuestions";
import ChatLimitMessage from "./components/ChatLimitMessage";

const AIChat = () => {
  const [message, setMessage] = useState("");
  const scrollViewRef = useRef(null);
  const [isShown, setIsShown] = useState(true);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const CHAT_STORAGE_KEY = "medora_ai_chat_history";
  const CREDITS_STORAGE_KEY = "medora_ai_chat_credits";

  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatCredits, setChatCredits] = useState({
    credits: 0,
    maxCredits: 5,
    canChat: true,
  });
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [sessionId] = useState(
    `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    loadSavedChats();
    loadSavedCredits();
  }, []);

  const loadSavedChats = async () => {
    try {
      const savedChats = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setChatHistory(parsedChats);
      } else {
        setChatHistory([
          {
            role: "bot",
            text: "Hello! I'm Medora, your clinic appointment and symptoms checker assistant. I can help you with:\n\n• Checking your symptoms\n• Providing basic health information\n• Guiding you through the appointment booking process\n• Answering questions about clinic services\n\nHow may I assist you today?",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("❌ Error loading saved chats:", error);
      setChatHistory([
        {
          role: "bot",
          text: "Hello! I'm Medora, your clinic appointment and symptoms checker assistant. I can help you with:\n\n• Checking your symptoms\n• Providing basic health information\n• Guiding you through the appointment booking process\n• Answering questions about clinic services\n\nHow may I assist you today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const loadSavedCredits = async () => {
    try {
      const savedCredits = await AsyncStorage.getItem(CREDITS_STORAGE_KEY);
      if (savedCredits) {
        const parsedCredits = JSON.parse(savedCredits);
        const lastResetDate = parsedCredits.lastResetDate;
        const today = new Date().toDateString();

        if (lastResetDate !== today) {
          const resetCredits = {
            credits: 0,
            maxCredits: 5,
            canChat: true,
            lastResetDate: today,
          };
          setChatCredits(resetCredits);
          await AsyncStorage.setItem(
            CREDITS_STORAGE_KEY,
            JSON.stringify(resetCredits)
          );
        } else {
          setChatCredits(parsedCredits);
        }
      } else {
        const initialCredits = {
          credits: 0,
          maxCredits: 5,
          canChat: true,
          lastResetDate: new Date().toDateString(),
        };
        setChatCredits(initialCredits);
        await AsyncStorage.setItem(
          CREDITS_STORAGE_KEY,
          JSON.stringify(initialCredits)
        );
      }
    } catch (error) {
      console.error("❌ Error loading saved credits:", error);
    }
  };

  const saveChatsToStorage = async (chats) => {
    try {
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error("❌ Error saving chats:", error);
    }
  };

  const saveCreditsToStorage = async (credits) => {
    try {
      await AsyncStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(credits));
    } catch (error) {
      console.error("❌ Error saving credits:", error);
    }
  };

  const speakText = (text) => {
    const cleanText = text.replace(/[👋💡🚨•\-]/g, "");

    Speech.speak(cleanText, {
      language: "en",
      rate: 0.9,
      pitch: 1.0,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const handleClearHistory = async () => {
    const newChatHistory = [
      {
        role: "bot",
        text: "Hello! I'm Medora, your clinic appointment and symptoms checker assistant. I can help you with:\n\n• Checking your symptoms\n• Providing basic health information\n• Guiding you through the appointment booking process\n• Answering questions about clinic services\n\nHow may I assist you today?",
        timestamp: new Date().toISOString(),
      },
    ];

    setChatHistory(newChatHistory);
    setShowEmergency(false);
    setEmergencyData(null);
    stopSpeaking();

    await saveChatsToStorage(newChatHistory);
  };

  const handleSendMessage = async () => {
    setIsShown(false);
    if (!message.trim()) return;

    if (!chatCredits.canChat) {
      const errorMessage = {
        role: "bot",
        text: "You've reached your daily chat limit. Please come back tomorrow for more assistance.",
        timestamp: new Date().toISOString(),
      };

      const updatedChats = [...chatHistory, errorMessage];
      setChatHistory(updatedChats);
      await saveChatsToStorage(updatedChats);
      return;
    }

    const userMessage = {
      role: "user",
      text: message,
      timestamp: new Date().toISOString(),
    };

    const updatedChatsWithUser = [...chatHistory, userMessage];
    setChatHistory(updatedChatsWithUser);
    await saveChatsToStorage(updatedChatsWithUser);

    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const response = await chatServices.sendMessage(
        currentMessage,
        sessionId
      );

      const botMessage = {
        role: "bot",
        text: response.reply,
        severity: response.severity,
        emergency: response.emergency_trigger,
        suggestAppointment: response.suggest_appointment,
        appointmentReason: response.appointment_reason,
        timestamp: new Date().toISOString(),
      };

      const updatedChatsWithBot = [...updatedChatsWithUser, botMessage];
      setChatHistory(updatedChatsWithBot);
      await saveChatsToStorage(updatedChatsWithBot);

      speakText(response.reply);

      if (response.emergency_trigger) {
        setShowEmergency(true);
        setEmergencyData({
          severity: response.severity,
          message: response.reply,
          timestamp: new Date().toLocaleTimeString(),
        });

        try {
          const emergencyContacts = await chatServices.getEmergencyContacts(
            response.severity
          );
          setEmergencyData((prev) => ({
            ...prev,
            contacts: emergencyContacts,
          }));
        } catch (error) {
          console.error("Failed to get emergency contacts:", error);
        }
      }

      const newCredits = {
        ...chatCredits,
        credits: chatCredits.credits + 1,
        canChat: chatCredits.credits + 1 < chatCredits.maxCredits,
        lastResetDate: new Date().toDateString(),
      };

      setChatCredits(newCredits);
      await saveCreditsToStorage(newCredits);
    } catch (error) {
      console.error("❌ Real API Error:", error);

      const fallbackResponse = getMockBotResponse(currentMessage);
      const botMessage = {
        role: "bot",
        text: fallbackResponse.reply,
        severity: fallbackResponse.severity,
        emergency: fallbackResponse.emergency_trigger,
        timestamp: new Date().toISOString(),
      };

      const updatedChatsWithFallback = [...updatedChatsWithUser, botMessage];
      setChatHistory(updatedChatsWithFallback);
      await saveChatsToStorage(updatedChatsWithFallback);

      speakText(fallbackResponse.reply);

      if (fallbackResponse.emergency_trigger) {
        setShowEmergency(true);
        setEmergencyData({
          severity: fallbackResponse.severity,
          message: fallbackResponse.reply,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      const newCredits = {
        ...chatCredits,
        credits: chatCredits.credits + 1,
        canChat: chatCredits.credits + 1 < chatCredits.maxCredits,
        lastResetDate: new Date().toDateString(),
      };

      setChatCredits(newCredits);
      await saveCreditsToStorage(newCredits);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (reason = "Medical consultation") => {
    navigation.navigate("Clinics");
  };

  const getMockBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    const emergencyKeywords = [
      "chest pain",
      "can't breathe",
      "severe pain",
      "bleeding heavily",
      "unconscious",
      "heart attack",
      "stroke",
    ];

    const isEmergency = emergencyKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    if (isEmergency) {
      return {
        reply:
          "⚠️ URGENT: Your symptoms may require immediate medical attention. Please call emergency services (911) or go to the nearest emergency room immediately. Do not wait.",
        severity: "SEVERE",
        emergency_trigger: true,
      };
    }

    if (lowerMessage.includes("headache") || lowerMessage.includes("tired")) {
      return {
        reply:
          "Headaches and fatigue can have various causes:\n\n• Dehydration\n• Lack of sleep\n• Stress\n• Eye strain\n\nI recommend:\n- Drink plenty of water\n- Get adequate rest\n- Take breaks from screens\n\nIf symptoms persist for more than 3 days or worsen, please book an appointment with a doctor.",
        severity: "MILD",
        emergency_trigger: false,
      };
    }

    return {
      reply:
        "I understand your concern. Could you provide more details about your symptoms? This will help me give you better advice. Remember, I'm here to provide general guidance, but always consult a healthcare professional for proper diagnosis and treatment.",
      severity: "MILD",
      emergency_trigger: false,
    };
  };

  const handleEmergencyContact = () => {
    // Handle emergency contact logic
  };

  const handleCloseEmergency = () => {
    setShowEmergency(false);
    setEmergencyData(null);
    stopSpeaking();
  };

  const handleSpeakMessage = (text) => {
    speakText(text);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory, loading]);

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ChatHeader
          chatCredits={chatCredits}
          isSpeaking={isSpeaking}
          stopSpeaking={stopSpeaking}
          handleClearHistory={handleClearHistory}
          navigation={navigation}
        />

        <EmergencyBanner
          showEmergency={showEmergency}
          emergencyData={emergencyData}
          handleCloseEmergency={handleCloseEmergency}
          handleEmergencyContact={handleEmergencyContact}
        />

        <ScrollView
          ref={scrollViewRef}
          className="flex-1 p-4"
          contentContainerStyle={{ gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <ChatMessages
            chatHistory={chatHistory}
            loading={loading}
            handleSpeakMessage={handleSpeakMessage}
            handleBookAppointment={handleBookAppointment}
          />

          {!chatCredits.canChat && (
            <ChatLimitMessage chatCredits={chatCredits} />
          )}

          <SampleQuestions
            chatCredits={chatCredits}
            showEmergency={showEmergency}
            isShown={isShown}
            setMessage={setMessage}
            setIsShown={setIsShown}
          />
        </ScrollView>

        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          loading={loading}
          chatCredits={chatCredits}
          showEmergency={showEmergency}
          isShown={isShown}
          setIsShown={setIsShown}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AIChat;
