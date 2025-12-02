import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

const WelcomeSection = ({ user, upcomingAppointments }) => {
  return (
    <View>
      <View className="flex-row items-center gap-3">
        <View className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
          <Feather name="star" size={24} color="#ffffff" />
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-semibold text-slate-800">
            Welcome, {user?.first_name || "there"}!
          </Text>
          <Text className="text-slate-600 mt-1">
            {upcomingAppointments.length > 0
              ? `You have ${upcomingAppointments.length} upcoming appointment${upcomingAppointments.length !== 1 ? "s" : ""}`
              : "No upcoming appointments scheduled"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WelcomeSection;
