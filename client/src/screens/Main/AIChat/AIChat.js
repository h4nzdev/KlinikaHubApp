import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";
import chatServices from "../../../services/chatServices";
import { useNavigation } from "@react-navigation/native";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AIChat = () => {
  const [message, setMessage] = useState("");
  const scrollViewRef = useRef(null);
  const [isShown, setIsShown] = useState(true);
  const navigation = useNavigation();

  // 💾 CHAT STORAGE KEYS
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

  // 💾 LOAD SAVED CHATS ON COMPONENT MOUNT
  useEffect(() => {
    loadSavedChats();
    loadSavedCredits();
  }, []);

  // 💾 LOAD CHATS FROM STORAGE
  const loadSavedChats = async () => {
    try {
      const savedChats = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setChatHistory(parsedChats);
      } else {
        // Default welcome message if no saved chats
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

  // 💾 LOAD CREDITS FROM STORAGE
  const loadSavedCredits = async () => {
    try {
      const savedCredits = await AsyncStorage.getItem(CREDITS_STORAGE_KEY);
      if (savedCredits) {
        const parsedCredits = JSON.parse(savedCredits);

        // Check if credits should reset (daily reset)
        const lastResetDate = parsedCredits.lastResetDate;
        const today = new Date().toDateString();

        if (lastResetDate !== today) {
          // Reset credits for new day
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
        // First time setup
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

  // 💾 SAVE CHATS TO STORAGE
  const saveChatsToStorage = async (chats) => {
    try {
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error("❌ Error saving chats:", error);
    }
  };

  // 💾 SAVE CREDITS TO STORAGE
  const saveCreditsToStorage = async (credits) => {
    try {
      await AsyncStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(credits));
    } catch (error) {
      console.error("❌ Error saving credits:", error);
    }
  };

  // 🎤 SPEECH FUNCTIONALITY
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

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to clear all chat messages? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
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

            // 💾 SAVE CLEARED CHAT HISTORY
            await saveChatsToStorage(newChatHistory);
          },
        },
      ]
    );
  };

  const handleSendMessage = async () => {
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

    // 💾 SAVE USER MESSAGE IMMEDIATELY
    await saveChatsToStorage(updatedChatsWithUser);

    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      console.log("🔄 Sending message to real API...");
      const response = await chatServices.sendMessage(
        currentMessage,
        sessionId
      );
      console.log("✅ Real API response:", response);

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

      // 💾 SAVE BOT RESPONSE
      await saveChatsToStorage(updatedChatsWithBot);

      // 🎤 AUTO-SPEAK THE RESPONSE
      speakText(response.reply);

      // Check for emergency
      if (response.emergency_trigger) {
        setShowEmergency(true);
        setEmergencyData({
          severity: response.severity,
          message: response.reply,
          timestamp: new Date().toLocaleTimeString(),
        });

        // Get emergency contacts
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

      // Update chat credits
      const newCredits = {
        ...chatCredits,
        credits: chatCredits.credits + 1,
        canChat: chatCredits.credits + 1 < chatCredits.maxCredits,
        lastResetDate: new Date().toDateString(),
      };

      setChatCredits(newCredits);
      // 💾 SAVE UPDATED CREDITS
      await saveCreditsToStorage(newCredits);
    } catch (error) {
      console.error("❌ Real API Error:", error);

      // Fallback to mock response if API fails
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

      // 💾 SAVE FALLBACK RESPONSE
      await saveChatsToStorage(updatedChatsWithFallback);

      // 🎤 SPEAK FALLBACK RESPONSE TOO
      speakText(fallbackResponse.reply);

      if (fallbackResponse.emergency_trigger) {
        setShowEmergency(true);
        setEmergencyData({
          severity: fallbackResponse.severity,
          message: fallbackResponse.reply,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // Still update credits even on fallback
      const newCredits = {
        ...chatCredits,
        credits: chatCredits.credits + 1,
        canChat: chatCredits.credits + 1 < chatCredits.maxCredits,
        lastResetDate: new Date().toDateString(),
      };

      setChatCredits(newCredits);
      // 💾 SAVE UPDATED CREDITS
      await saveCreditsToStorage(newCredits);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (reason = "Medical consultation") => {
    Alert.alert(
      "Book Appointment",
      `Would you like to schedule an appointment for:\n"${reason}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Book Now",
          onPress: () => {
            // Navigate to clinics screen
            navigation.navigate("Clinics");

            // Optional: Show confirmation
            Alert.alert(
              "Appointment Suggested",
              "You're being directed to our clinics list to book your appointment.",
              [{ text: "OK" }]
            );
          },
        },
      ]
    );
  };

  // Mock fallback function
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
    if (emergencyData?.contacts) {
      Alert.alert(
        "🚨 Emergency Contacts - PHILIPPINES",
        `Severity: ${emergencyData.severity}\n\n${emergencyData.contacts.actions.join("\n")}`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Call 911", onPress: () => Linking.openURL("tel:911") },
          { text: "Call 143", onPress: () => Linking.openURL("tel:143") },
          { text: "Show All Contacts", onPress: showAllEmergencyContacts },
        ]
      );
    } else {
      Alert.alert(
        "Emergency Services",
        "Would you like to call emergency services?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Call 911", onPress: () => Linking.openURL("tel:911") },
        ]
      );
    }
  };

  const showAllEmergencyContacts = () => {
    if (emergencyData?.contacts) {
      const contactList = emergencyData.contacts.contacts
        .map((contact) => `${contact.name}: ${contact.number}`)
        .join("\n\n");

      Alert.alert("📞 Emergency Contacts", contactList, [
        { text: "Call 911", onPress: () => Linking.openURL("tel:911") },
        { text: "Close", style: "cancel" },
      ]);
    }
  };

  const handleCloseEmergency = () => {
    setShowEmergency(false);
    setEmergencyData(null);
    stopSpeaking();
  };

  // 🎤 ADD SPEAKER BUTTON TO BOT MESSAGES
  const handleSpeakMessage = (text) => {
    speakText(text);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory, loading]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Chat Header - ADDED SPEAKER BUTTON */}
        <View className="bg-white border-b border-gray-200 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => {
                  stopSpeaking();
                  navigation.goBack();
                }}
                className="p-2"
              >
                <Feather name="chevron-left" size={24} color="#4b5563" />
              </TouchableOpacity>

              <View className="bg-cyan-100 p-3 rounded-full">
                <Feather name="message-circle" size={24} color="#0891b2" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900">
                  AI Symptom Checker
                </Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Feather name="clock" size={16} color="#0891b2" />
                  <Text
                    className={`text-sm font-medium ${
                      chatCredits.canChat ? "text-cyan-600" : "text-red-600"
                    }`}
                  >
                    {chatCredits.canChat
                      ? `${chatCredits.credits}/${chatCredits.maxCredits} chats left`
                      : "Limit reached"}
                  </Text>
                </View>
              </View>
            </View>

            {/* 🎤 ADDED SPEAKER BUTTON IN HEADER */}
            <View className="flex-row gap-2">
              <TouchableOpacity onPress={stopSpeaking} className="p-2">
                <Feather
                  name={isSpeaking ? "volume-x" : "volume-2"}
                  size={20}
                  color={isSpeaking ? "#dc2626" : "#0891b2"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClearHistory}
                className="border border-cyan-200 px-3 py-1 rounded-md"
              >
                <Text className="text-sm text-cyan-700">Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Emergency Banner */}
        {showEmergency && emergencyData && (
          <View className="bg-red-50 border-b border-red-200 p-4">
            <View className="flex-row gap-3">
              <View className="bg-red-100 p-2 rounded-full h-10 w-10 items-center justify-center">
                <Feather name="alert-triangle" size={20} color="#dc2626" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-bold text-red-900">
                    🚨 Medical Attention Required
                  </Text>
                  <TouchableOpacity onPress={handleCloseEmergency}>
                    <Text className="text-red-500 text-sm">Dismiss</Text>
                  </TouchableOpacity>
                </View>
                <Text className="text-red-800 text-sm mb-3">
                  {emergencyData.message}
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={handleEmergencyContact}
                    className="flex-row items-center gap-2 bg-red-600 px-4 py-2 rounded-lg"
                  >
                    <Feather name="phone" size={16} color="#ffffff" />
                    <Text className="text-white font-semibold text-sm">
                      Emergency Contacts
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center gap-2 bg-white border border-red-600 px-4 py-2 rounded-lg">
                    <Text className="text-red-600 font-semibold text-sm">
                      Contact Clinic
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Chat Messages - ADDED SPEAKER BUTTON TO BOT MESSAGES */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 p-4"
          contentContainerStyle={{ gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {chatHistory.map((chat, index) => (
            <View
              key={index}
              className={`flex-row ${
                chat.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <View
                className={`max-w-[85%] px-4 py-3 rounded-lg ${
                  chat.role === "user"
                    ? "bg-cyan-600"
                    : chat.emergency
                      ? "bg-red-50 border border-red-200"
                      : "bg-white border border-gray-200"
                }`}
              >
                {chat.role === "bot" && (
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                      <Feather
                        name="message-circle"
                        size={16}
                        color={chat.emergency ? "#dc2626" : "#0891b2"}
                      />
                      <Text
                        className={`text-sm font-medium ${
                          chat.emergency ? "text-red-600" : "text-cyan-600"
                        }`}
                      >
                        {chat.emergency ? "🚨 AI Assistant" : "AI Assistant"}
                      </Text>
                      {chat.severity && (
                        <View
                          className={`px-2 py-1 rounded-full ${
                            chat.severity === "SEVERE"
                              ? "bg-red-100"
                              : chat.severity === "MODERATE"
                                ? "bg-yellow-100"
                                : "bg-green-100"
                          }`}
                        >
                          <Text
                            className={`text-xs ${
                              chat.severity === "SEVERE"
                                ? "text-red-800"
                                : chat.severity === "MODERATE"
                                  ? "text-yellow-800"
                                  : "text-green-800"
                            }`}
                          >
                            {chat.severity}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* 🎤 SPEAKER BUTTON FOR BOT MESSAGES */}
                    {!chat.emergency && (
                      <TouchableOpacity
                        onPress={() => handleSpeakMessage(chat.text)}
                        className="p-1"
                      >
                        <Feather name="volume-2" size={14} color="#0891b2" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <Text
                  className={`text-base ${
                    chat.role === "user"
                      ? "text-white"
                      : chat.emergency
                        ? "text-red-900"
                        : "text-gray-900"
                  }`}
                >
                  {chat.text}
                </Text>

                {/* Appointment Suggestion Button */}
                {chat.role === "bot" &&
                  chat.suggestAppointment &&
                  !chat.emergency && (
                    <TouchableOpacity
                      onPress={() =>
                        handleBookAppointment(chat.appointmentReason)
                      }
                      className="mt-3 flex-row items-center gap-2 bg-cyan-600 px-4 py-2 rounded-lg border border-green-600"
                    >
                      <Feather name="calendar" size={16} color="#ffffff" />
                      <Text className="text-white font-semibold text-sm">
                        Book Appointment
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          ))}

          {loading && (
            <View className="flex-row justify-start">
              <View className="max-w-[85%] px-4 py-3 rounded-lg bg-white border border-gray-200">
                <View className="flex-row items-center gap-2 mb-2">
                  <Feather name="message-circle" size={16} color="#0891b2" />
                  <Text className="text-sm font-medium text-cyan-600">
                    AI Assistant
                  </Text>
                </View>
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-base text-gray-900">Medora AI</Text>
                  <View className="animate-spin">
                    <Feather name="loader" size={18} color="#4b5563" />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Chat Limit Reached Message */}
          {!chatCredits.canChat && (
            <View className="bg-red-50 rounded-xl p-4 border border-red-200">
              <View className="flex-row items-center gap-2 mb-3">
                <Feather name="clock" size={20} color="#dc2626" />
                <Text className="font-medium text-red-900">
                  Daily Chat Limit Reached
                </Text>
              </View>
              <Text className="text-sm text-red-800">
                You've used all {chatCredits.maxCredits} of your daily chat
                messages. Your chat credits will reset tomorrow. For urgent
                medical concerns, please contact your healthcare provider
                directly.
              </Text>
            </View>
          )}

          {/* Sample Questions */}
          {chatCredits.canChat && !showEmergency && isShown ? (
            <View>
              <View className="bg-blue-50 rounded-xl p-4 border border-blue-200 relative">
                <TouchableOpacity
                  onPress={() => setIsShown(false)}
                  className="absolute h-8 w-8 bg-cyan-100 -top-4 self-center rounded-full flex items-center justify-center"
                >
                  <Feather name="chevron-down" size={18} color="#0891b2" />
                </TouchableOpacity>
                <Text className="font-medium text-blue-900 mb-3">
                  Try asking about:
                </Text>
                <View className="gap-3">
                  <TouchableOpacity
                    onPress={() =>
                      setMessage("I have a headache and feel tired")
                    }
                    className="p-3 bg-white rounded-lg border border-blue-200"
                  >
                    <Text className="text-sm text-blue-800">
                      "I have a headache and feel tired"
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      setMessage("I want to book an appointment for a check-up")
                    }
                    className="p-3 bg-white rounded-lg border border-blue-200"
                  >
                    <Text className="text-sm text-blue-800">
                      "I want to book an appointment for a check-up"
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      setMessage("My cough has been persistent for 1 week")
                    }
                    className="p-3 bg-white rounded-lg border border-blue-200"
                  >
                    <Text className="text-sm text-blue-800">
                      "My cough has been persistent for 1 week"
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      setMessage("I need to see a doctor for prescription")
                    }
                    className="p-3 bg-white rounded-lg border border-blue-200"
                  >
                    <Text className="text-sm text-blue-800">
                      "I need to see a doctor for prescription"
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="bg-cyan-50 rounded-xl p-4 mt-5 mb-5 border border-cyan-200">
                <View className="flex-row items-center gap-2 mb-3">
                  <Feather name="cpu" size={20} color="#0891b2" />
                  <Text className="font-medium text-cyan-900">
                    Powered by Medora AI
                  </Text>
                </View>
                <Text className="text-sm text-cyan-800">
                  Real-time symptom analysis with emergency detection. Your
                  conversations are secure and private.
                </Text>
              </View>
            </View>
          ) : (
            <View className="mt-6"></View>
          )}
        </ScrollView>

        {/* Message Input */}
        <View className="bg-white border-t border-gray-200 p-4 relative">
          {!isShown && (
            <TouchableOpacity
              onPress={() => setIsShown(true)}
              className="absolute -top-6 self-center rounded-full flex items-center justify-center animate-bounce"
            >
              <Feather name="chevron-up" size={24} color="#0891b2" />
            </TouchableOpacity>
          )}
          <View className="flex-row gap-3">
            <TextInput
              placeholder={
                !chatCredits.canChat
                  ? "Daily chat limit reached"
                  : showEmergency
                    ? "Emergency detected - use buttons above"
                    : "Describe your symptoms..."
              }
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
              editable={chatCredits.canChat && !showEmergency}
              multiline
              className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg ${
                !chatCredits.canChat || showEmergency
                  ? "bg-gray-100"
                  : "bg-white"
              }`}
              style={{ maxHeight: 100 }}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={loading || !chatCredits.canChat || showEmergency}
              className={`px-4 py-3 rounded-lg items-center justify-center min-w-[56px] ${
                !chatCredits.canChat || showEmergency
                  ? "bg-gray-400"
                  : "bg-cyan-600"
              }`}
            >
              <Feather name="send" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AIChat;
