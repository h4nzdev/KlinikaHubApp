import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const ClinicCard = ({ clinic, onPress }) => (
  <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6">
    {/* Clinic Header */}
    <View className="flex-row gap-4 mb-4">
      <View className="relative">
        <View className="w-16 h-16 rounded-xl bg-cyan-100 items-center justify-center">
          <Feather name="home" size={24} color="#0891b2" />
        </View>
        <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500" />
      </View>
      <View className="flex-1">
        <Text className="text-xl font-bold text-slate-800 mb-1">
          {clinic.institute_name}
        </Text>
        <Text className="text-slate-600 font-medium text-sm mb-2">
          {clinic.primary_category || "Healthcare Center"}
        </Text>
        <View className="flex-row items-center gap-1">
          <Feather name="phone" size={14} color="#64748b" />
          <Text className="text-slate-500 text-sm">{clinic.mobileno}</Text>
        </View>
      </View>
    </View>

    {/* Clinic Info Card */}
    <View className="bg-slate-50/80 rounded-xl p-4 mb-4">
      <View className="gap-3">
        {/* Address */}
        <View className="flex-col space-y-1">
          <Text className="text-slate-600 text-sm font-medium">Address</Text>
          <Text className="font-semibold text-slate-700 text-sm leading-5">
            {clinic.address}
          </Text>
        </View>

        {/* Hours and Status */}
        <View className="flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          {/* Hours */}
          <View className="flex-1">
            <Text className="text-slate-600 text-sm font-medium mb-1">
              Operating Hours
            </Text>
            <Text className="font-semibold text-slate-700 text-sm">
              {clinic.working_hours || "Mon-Sat: 8:00 AM - 5:00 PM"}
            </Text>
          </View>

          {/* Status */}
          <View className="flex-row items-center justify-between sm:justify-start sm:flex-col sm:items-end sm:space-y-1">
            <Text className="text-slate-600 text-sm font-medium sm:hidden">
              Status
            </Text>
            <View className="flex-row items-center bg-green-100 px-3 py-1 rounded-full">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              <Text className="font-semibold text-green-800 text-xs">
                Open Now
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>

    {/* Action Button */}
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-center px-4 py-3 bg-cyan-500 rounded-xl shadow-lg"
    >
      <Feather name="info" size={16} color="#ffffff" />
      <Text className="text-white font-semibold ml-2">View Full Details</Text>
      <Feather name="arrow-right" size={16} color="#ffffff" className="ml-2" />
    </TouchableOpacity>
  </View>
);

export default ClinicCard;
