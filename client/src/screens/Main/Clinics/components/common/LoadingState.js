import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

const LoadingState = () => (
  <View className="flex-1 justify-center items-center">
    <ActivityIndicator size="large" color="#0891b2" />
    <Text className="text-slate-600 mt-4 text-lg">Loading clinics...</Text>
  </View>
);

export default LoadingState;
