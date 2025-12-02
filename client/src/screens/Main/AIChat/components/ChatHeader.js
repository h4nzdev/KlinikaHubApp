import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const ChatHeader = ({
  chatCredits,
  isSpeaking,
  stopSpeaking,
  handleClearHistory,
  navigation,
}) => {
  return (
    <View className="bg-white border-b border-gray-200 px-4 py-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 flex-1">
          <TouchableOpacity
            onPress={() => {
              stopSpeaking();
              navigation.goBack();
            }}
            className="p-1"
          >
            <Feather name="chevron-left" size={20} color="#4b5563" />
          </TouchableOpacity>

          <View className="bg-cyan-100 p-2 rounded-full">
            <Feather name="message-circle" size={18} color="#0891b2" />
          </View>

          <View className="flex-1 ml-1">
            <Text className="text-lg font-semibold text-gray-900">
              AI Symptom Checker
            </Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <Feather name="clock" size={14} color="#0891b2" />
              <Text
                className={`text-xs font-medium ${
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

        <View className="flex-row gap-1">
          <TouchableOpacity onPress={stopSpeaking} className="p-1">
            <Feather
              name={isSpeaking ? "volume-x" : "volume-2"}
              size={18}
              color={isSpeaking ? "#dc2626" : "#0891b2"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClearHistory}
            className="border border-cyan-200 px-2 py-1 rounded-md"
          >
            <Text className="text-xs text-cyan-700">Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatHeader;
