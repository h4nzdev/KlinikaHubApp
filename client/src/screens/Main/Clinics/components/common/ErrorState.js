import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const ErrorState = ({ error, onRetry }) => (
  <View className="flex-1 justify-center items-center p-8">
    <View className="bg-red-100 rounded-2xl p-6 mb-6">
      <Feather name="alert-triangle" size={64} color="#dc2626" />
    </View>
    <Text className="text-xl font-bold text-slate-700 mb-2 text-center">
      Unable to Load Clinics
    </Text>
    <Text className="text-slate-500 text-lg text-center mb-6">{error}</Text>
    <TouchableOpacity
      onPress={onRetry}
      className="flex-row items-center justify-center px-6 py-3 bg-cyan-500 rounded-xl"
    >
      <Feather name="refresh-cw" size={16} color="#ffffff" />
      <Text className="text-white font-semibold ml-2">Try Again</Text>
    </TouchableOpacity>
  </View>
);

export default ErrorState;
