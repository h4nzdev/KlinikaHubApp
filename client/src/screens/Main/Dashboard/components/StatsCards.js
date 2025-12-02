import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const StatsCards = ({
  randomTip,
  setRandomTip,
  upcomingAppointments,
  nextAppointment,
  formatDate,
  formatTime,
  completedAppointments,
  appointments,
}) => {
  return (
    <View className="gap-4">
      <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                Health Tip of the Day
              </Text>
              <TouchableOpacity onPress={() => setRandomTip(getRandomTip())}>
                <Feather name="refresh-cw" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text className="text-slate-700 leading-relaxed font-medium">
              {randomTip}
            </Text>
          </View>
          <View className="bg-blue-500 p-4 rounded-2xl shadow-md">
            <Feather name="heart" size={32} color="#ffffff" />
          </View>
        </View>
      </View>

      <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide">
              Upcoming Appointments
            </Text>
            <Text className="text-4xl font-semibold text-cyan-600 mt-2">
              {upcomingAppointments.length}
            </Text>
            <View className="flex-row items-center mt-2">
              {nextAppointment ? (
                <>
                  <Feather name="trending-up" size={14} color="#059669" />
                  <Text className="text-sm text-emerald-600 ml-1 font-medium">
                    Next: {formatDate(nextAppointment.appointment_date)} at{" "}
                    {formatTime(nextAppointment.schedule)}
                  </Text>
                </>
              ) : (
                <Text className="text-sm text-slate-500 font-medium">
                  No upcoming appointments
                </Text>
              )}
            </View>
          </View>
          <View className="bg-cyan-500 p-4 rounded-2xl shadow-md">
            <Feather name="calendar" size={32} color="#ffffff" />
          </View>
        </View>
      </View>

      <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">
              Your Health Stats
            </Text>
            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-2xl font-semibold text-slate-800">
                  {completedAppointments.length}
                </Text>
                <Text className="text-slate-600 text-xs">Completed</Text>
              </View>
              <View>
                <Text className="text-2xl font-semibold text-slate-800">
                  {appointments.filter((app) => app.status === 3).length}
                </Text>
                <Text className="text-slate-600 text-xs">Cancelled</Text>
              </View>
              <View>
                <Text className="text-2xl font-semibold text-slate-800">
                  {appointments.length}
                </Text>
                <Text className="text-slate-600 text-xs">Total</Text>
              </View>
            </View>
          </View>
          <View className="bg-emerald-500 p-4 rounded-2xl shadow-md">
            <Feather name="activity" size={32} color="#ffffff" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default StatsCards;
