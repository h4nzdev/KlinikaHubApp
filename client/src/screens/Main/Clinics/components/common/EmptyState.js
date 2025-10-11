import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const EmptyState = ({ selectedCategory, onShowAll }) => (
  <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-12 items-center">
    <View className="bg-slate-100 rounded-2xl p-6 mb-6">
      <Feather name="search" size={64} color="#9ca3af" />
    </View>
    <Text className="text-xl font-bold text-slate-700 mb-2">
      No clinics found
    </Text>
    <Text className="text-slate-500 text-lg text-center mb-4">
      {selectedCategory !== "All"
        ? `No clinics found in "${selectedCategory}" category`
        : "No clinics available"}
    </Text>
    {selectedCategory !== "All" && (
      <TouchableOpacity
        onPress={onShowAll}
        className="flex-row items-center justify-center px-6 py-3 bg-cyan-500 rounded-xl"
      >
        <Feather name="list" size={16} color="#ffffff" />
        <Text className="text-white font-semibold ml-2">Show All Clinics</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default EmptyState;
