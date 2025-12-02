import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const ChatMessages = ({
  chatHistory,
  loading,
  handleSpeakMessage,
  handleBookAppointment,
}) => {
  return (
    <>
      {chatHistory.map((chat, index) => (
        <ChatMessage
          key={index}
          chat={chat}
          handleSpeakMessage={handleSpeakMessage}
          handleBookAppointment={handleBookAppointment}
        />
      ))}

      {loading && <LoadingMessage />}
    </>
  );
};

const ChatMessage = ({ chat, handleSpeakMessage, handleBookAppointment }) => {
  return (
    <View
      className={`flex-row ${
        chat.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <View
        className={`max-w-[85%] px-4 py-3 rounded-lg mb-8 ${
          chat.role === "user"
            ? "bg-cyan-600"
            : chat.emergency
              ? "bg-red-50 border border-red-200"
              : "bg-white border border-gray-200"
        }`}
      >
        {chat.role === "bot" && (
          <View className="flex-row items-center justify-between">
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

        {chat.role === "bot" && chat.suggestAppointment && !chat.emergency && (
          <TouchableOpacity
            onPress={() => handleBookAppointment(chat.appointmentReason)}
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
  );
};

const LoadingMessage = () => {
  return (
    <View className="flex-row justify-start mb-8">
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
  );
};

export default ChatMessages;
