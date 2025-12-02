import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const EmergencyBanner = ({
  showEmergency,
  emergencyData,
  handleCloseEmergency,
  handleEmergencyContact,
}) => {
  if (!showEmergency || !emergencyData) return null;

  return (
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
  );
};

export default EmergencyBanner;
