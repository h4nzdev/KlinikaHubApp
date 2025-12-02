import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

const ChatLimitMessage = ({ chatCredits }) => {
  return (
    <View className="bg-red-50 rounded-xl p-4 border border-red-200 mb-8">
      <View className="flex-row items-center gap-2 mb-3">
        <Feather name="clock" size={20} color="#dc2626" />
        <Text className="font-medium text-red-900">
          Daily Chat Limit Reached
        </Text>
      </View>
      <Text className="text-sm text-red-800">
        You've used all {chatCredits.maxCredits} of your daily chat messages.
        Your chat credits will reset tomorrow. For urgent medical concerns,
        please contact your healthcare provider directly.
      </Text>
    </View>
  );
};

export default ChatLimitMessage;
