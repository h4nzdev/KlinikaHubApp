import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const MessageInput = ({
  message,
  setMessage,
  handleSendMessage,
  loading,
  chatCredits,
  showEmergency,
  isShown,
  setIsShown,
}) => {
  return (
    <View className="bg-white border-t border-gray-200 p-4 relative">
      {!isShown && (
        <TouchableOpacity
          onPress={() => setIsShown(true)}
          className="absolute -top-4 self-center bg-white rounded-full w-8 h-8 items-center justify-center shadow-lg border border-gray-200 animate-bounce"
        >
          <Feather name="chevron-up" size={20} color="#0891b2" />
        </TouchableOpacity>
      )}

      <View className="flex-row gap-3 items-end">
        <View className="flex-1 relative">
          <TextInput
            placeholder={
              !chatCredits.canChat
                ? "Daily chat limit reached - Try again tomorrow"
                : showEmergency
                  ? "Emergency detected - Please use emergency options above"
                  : "Describe your symptoms or health concerns..."
            }
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSendMessage}
            editable={chatCredits.canChat && !showEmergency}
            multiline
            className={`px-4 py-3 border rounded-xl text-base ${
              !chatCredits.canChat || showEmergency
                ? "bg-gray-100 border-gray-300 text-gray-500"
                : "bg-white border-cyan-200 text-gray-800"
            }`}
            style={{
              maxHeight: 120,
              minHeight: 50,
              textAlignVertical: "center",
            }}
            placeholderTextColor={
              !chatCredits.canChat || showEmergency ? "#9ca3af" : "#6b7280"
            }
          />

          {message.length > 0 && chatCredits.canChat && !showEmergency && (
            <Text className="absolute bottom-1 right-3 text-xs text-gray-400">
              {message.length}/500
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={
            loading ||
            !chatCredits.canChat ||
            showEmergency ||
            message.trim().length === 0
          }
          className={`w-12 h-12 rounded-xl items-center justify-center shadow-sm ${
            !chatCredits.canChat || showEmergency || message.trim().length === 0
              ? "bg-gray-300"
              : loading
                ? "bg-cyan-400"
                : "bg-cyan-500 active:bg-cyan-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Feather
              name="send"
              size={20}
              color={
                !chatCredits.canChat ||
                showEmergency ||
                message.trim().length === 0
                  ? "#9ca3af"
                  : "#ffffff"
              }
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-row items-center gap-2">
          {!chatCredits.canChat ? (
            <View className="flex-row items-center gap-1">
              <Feather name="alert-circle" size={14} color="#ef4444" />
              <Text className="text-red-500 text-xs font-medium">
                Daily limit reached
              </Text>
            </View>
          ) : (
            <Text className="text-gray-500 text-xs">
              {chatCredits.maxCredits - chatCredits.credits} chats remaining
              today
            </Text>
          )}

          {showEmergency && (
            <View className="flex-row items-center gap-1 bg-red-50 px-2 py-1 rounded-full">
              <Feather name="alert-triangle" size={12} color="#dc2626" />
              <Text className="text-red-600 text-xs font-medium">
                Emergency Mode
              </Text>
            </View>
          )}
        </View>

        {chatCredits.canChat && !showEmergency && message.length === 0 && (
          <Text className="text-gray-400 text-xs">Press ↵ to send</Text>
        )}
      </View>
    </View>
  );
};

export default MessageInput;
