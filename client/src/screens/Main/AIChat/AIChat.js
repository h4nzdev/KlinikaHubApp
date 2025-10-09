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

const AIChat = () => {
  const [message, setMessage] = useState("");
  const scrollViewRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "bot",
      text: "Hello! I'm Medora, your clinic appointment and symptoms checker assistant. I can help you with:\n\n• Checking your symptoms\n• Providing basic health information\n• Guiding you through the appointment booking process\n• Answering questions about clinic services\n\nHow may I assist you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [chatCredits, setChatCredits] = useState({
    credits: 0,
    maxCredits: 20, // Increased for real API
    canChat: true,
  });
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [sessionId] = useState(
    `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );
  const [user] = useState({
    _id: "user123",
    name: "Hanz Christian Angelo G Magbal",
    phone: "+1 234 567 8900",
    email: "hanz@example.com",
  });

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to clear all chat messages?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: () => {
            setChatHistory([
              {
                role: "bot",
                text: "Hello! I'm Medora, your clinic appointment and symptoms checker assistant. I can help you with:\n\n• Checking your symptoms\n• Providing basic health information\n• Guiding you through the appointment booking process\n• Answering questions about clinic services\n\nHow may I assist you today?",
              },
            ]);
            setShowEmergency(false);
            setEmergencyData(null);
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Check if user can still chat
    if (!chatCredits.canChat) {
      const errorMessage = {
        role: "bot",
        text: "You've reached your daily chat limit. Please come back tomorrow for more assistance.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      role: "user",
      text: message,
    };

    setChatHistory((prev) => [...prev, userMessage]);
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
      };

      setChatHistory((prev) => [...prev, botMessage]);

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
      setChatCredits((prev) => ({
        ...prev,
        credits: prev.credits + 1,
        canChat: prev.credits + 1 < prev.maxCredits,
      }));
    } catch (error) {
      console.error("❌ Real API Error:", error);

      // Fallback to mock response if API fails
      const fallbackResponse = getMockBotResponse(currentMessage);
      const botMessage = {
        role: "bot",
        text: fallbackResponse.reply,
        severity: fallbackResponse.severity,
        emergency: fallbackResponse.emergency_trigger,
      };

      setChatHistory((prev) => [...prev, botMessage]);

      if (fallbackResponse.emergency_trigger) {
        setShowEmergency(true);
        setEmergencyData({
          severity: fallbackResponse.severity,
          message: fallbackResponse.reply,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // Still update credits even on fallback
      setChatCredits((prev) => ({
        ...prev,
        credits: prev.credits + 1,
        canChat: prev.credits + 1 < prev.maxCredits,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Mock fallback function (same as before)
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

    // ... rest of your mock responses (keep them as backup)
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
      // Show emergency contacts from API
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
      // Fallback emergency contact
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
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory, loading]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Chat Header */}
        <View className="bg-white border-b border-gray-200 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
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
            <TouchableOpacity
              onPress={handleClearHistory}
              className="border border-cyan-200 px-3 py-1 rounded-md"
            >
              <Text className="text-sm text-cyan-700">Clear</Text>
            </TouchableOpacity>
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

        {/* Chat Messages */}
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
                  <View className="flex-row items-center gap-2 mb-2">
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
                <Text className="text-base text-gray-900">
                  Medora AI is thinking...
                </Text>
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
          {chatCredits.canChat && !showEmergency && (
            <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <Text className="font-medium text-blue-900 mb-3">
                Try asking about:
              </Text>
              <View className="gap-3">
                <TouchableOpacity
                  onPress={() => setMessage("I have a headache and feel tired")}
                  className="p-3 bg-white rounded-lg border border-blue-200"
                >
                  <Text className="text-sm text-blue-800">
                    "I have a headache and feel tired"
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMessage("What are symptoms of flu?")}
                  className="p-3 bg-white rounded-lg border border-blue-200"
                >
                  <Text className="text-sm text-blue-800">
                    "What are symptoms of flu?"
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setMessage("I have chest pain and difficulty breathing")
                  }
                  className="p-3 bg-white rounded-lg border border-blue-200"
                >
                  <Text className="text-sm text-blue-800">
                    "I have chest pain and difficulty breathing"
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* API Status */}
          <View className="bg-cyan-50 rounded-xl p-4 mb-5 border border-cyan-200">
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
        </ScrollView>

        {/* Message Input */}
        <View className="bg-white border-t border-gray-200 p-4">
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
