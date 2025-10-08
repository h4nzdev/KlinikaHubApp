import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../components/Header";

// Static data for the dashboard
const healthTips = [
  "Stay hydrated by drinking at least 8 glasses of water a day.",
  "Incorporate at least 30 minutes of moderate-intensity exercise into your daily routine.",
  "Ensure you get 7-9 hours of quality sleep per night for better health.",
  "A balanced diet rich in fruits, vegetables, and whole grains is key to a healthy lifestyle.",
];

// Mock appointment data
const mockAppointments = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "2024-01-15T10:00:00",
    type: "checkup",
    status: "scheduled",
  },
  {
    id: "2",
    doctorName: "Dr. Mike Chen",
    specialty: "Dermatology",
    date: "2024-01-16T14:30:00",
    type: "consultation",
    status: "scheduled",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-500", text: "Scheduled" },
      completed: { color: "bg-green-500", text: "Completed" },
      cancelled: { color: "bg-red-500", text: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.scheduled;

    return (
      <View className={`px-3 py-1 rounded-full ${config.color}`}>
        <Text className="text-white text-xs font-medium">{config.text}</Text>
      </View>
    );
  };

  const upcomingAppointments = mockAppointments.filter(
    (app) => app.status === "scheduled"
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header />
      {/* Main Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Welcome Section */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
              <Feather name="star" size={24} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-semibold text-gray-800">
                Welcome, Hanz Christian Angelo G Magbal!
              </Text>
              <Text className="text-gray-600 mt-1">
                Here's a summary of your health journey today.
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-6 mb-6">
          <View className="flex-column gap-4">
            {/* Upcoming Appointments Card */}
            <View className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Upcoming
                  </Text>
                  <Text className="text-2xl font-semibold text-cyan-600 mt-1">
                    {upcomingAppointments.length}
                  </Text>
                  <Text className="text-xs text-emerald-600 mt-1 flex-row items-center">
                    <Feather name="trending-up" size={12} color="#059669" />
                    <Text className="ml-1">Next: Tomorrow 9:00 AM</Text>
                  </Text>
                </View>
                <View className="bg-cyan-500 p-3 rounded-2xl shadow-md">
                  <Feather name="calendar" size={20} color="#ffffff" />
                </View>
              </View>
            </View>

            {/* Health Tip Card */}
            <View className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-2">
                  <Text className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                    Health Tip
                  </Text>
                  <Text className="text-gray-700 text-xs leading-tight font-medium">
                    {randomTip}
                  </Text>
                </View>
                <View className="bg-emerald-500 p-3 rounded-2xl shadow-md">
                  <Feather name="heart" size={20} color="#ffffff" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </Text>
          <View className="gap-3">
            {/* Book Appointment */}
            <TouchableOpacity className="flex-row items-center gap-4 p-4 bg-cyan-50 rounded-xl border border-cyan-200">
              <View className="bg-cyan-500 p-3 rounded-xl shadow-md">
                <Feather name="plus" size={20} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 text-lg">
                  Book Appointment
                </Text>
                <Text className="text-gray-600 text-sm">
                  Schedule your next visit
                </Text>
              </View>
            </TouchableOpacity>

            {/* Start AI Chat */}
            <TouchableOpacity className="flex-row items-center gap-4 p-4 bg-sky-50 rounded-xl border border-sky-200">
              <View className="bg-sky-500 p-3 rounded-xl shadow-md">
                <Feather name="message-square" size={20} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 text-lg">
                  Start AI Chat
                </Text>
                <Text className="text-gray-600 text-sm">
                  Get instant health advice
                </Text>
              </View>
            </TouchableOpacity>

            {/* Set Reminder */}
            <TouchableOpacity className="flex-row items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <View className="bg-blue-500 p-3 rounded-xl shadow-md">
                <Feather name="bell" size={20} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 text-lg">
                  Set Reminder
                </Text>
                <Text className="text-gray-600 text-sm">
                  Never miss medication
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View className="px-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Upcoming Appointments
          </Text>

          {upcomingAppointments.length === 0 ? (
            <View className="items-center py-8">
              <View className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 w-fit mb-4">
                <Feather name="calendar" size={40} color="#9ca3af" />
              </View>
              <Text className="text-lg font-bold text-gray-700 mb-2">
                No upcoming appointments yet
              </Text>
              <Text className="text-gray-500 text-center px-4">
                Your upcoming appointments will appear here.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {upcomingAppointments.map((appointment) => (
                <View
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3"
                >
                  {/* Doctor Info Row */}
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 mr-2">
                      <Text
                        className="font-bold text-gray-900 text-base mb-1"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {appointment.doctorName}
                      </Text>
                      <View className="flex-row items-center flex-wrap gap-1 mb-2">
                        <View className="bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                          <Text className="text-blue-700 text-xs font-medium">
                            {appointment.specialty}
                          </Text>
                        </View>
                        <View className="bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                          <Text className="text-gray-600 text-xs font-medium capitalize">
                            {appointment.type}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Status & Menu */}
                    <View className="items-end">
                      {getStatusBadge(appointment.status)}
                      <TouchableOpacity
                        className="p-2 -mr-2 -mt-1"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Feather
                          name="more-horizontal"
                          size={18}
                          color="#9ca3af"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Date & Time */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <Feather name="calendar" size={14} color="#6b7280" />
                      <Text className="text-gray-600 text-sm ml-2 font-medium">
                        {formatDate(appointment.date)}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Feather name="clock" size={14} color="#6b7280" />
                      <Text className="text-gray-600 text-sm ml-2 font-medium">
                        {formatTime(appointment.date)}
                      </Text>
                    </View>
                  </View>

                  {/* Quick Actions Footer */}
                  {/* Quick Actions Footer - Option 2 */}
                  <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <TouchableOpacity className="flex-row items-center">
                      <Feather name="user" size={14} color="#3b82f6" />
                      <Text className="text-blue-600 text-xs font-medium ml-1">
                        Profile
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center">
                      <Feather name="bell" size={14} color="#8b5cf6" />
                      <Text className="text-purple-600 text-xs font-medium ml-1">
                        Remind
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center">
                      <Feather name="x" size={14} color="#ef4444" />
                      <Text className="text-red-600 text-xs font-medium ml-1">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Add some space at the bottom for the navbar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
