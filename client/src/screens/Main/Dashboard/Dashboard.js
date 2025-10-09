import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";
import { AuthenticationContext } from "../../../context/AuthenticationContext";

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

const Dashboard = ({ navigation }) => {
  const { user } = useContext(AuthenticationContext);
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

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: {
        bg: "bg-cyan-100",
        text: "text-cyan-700",
        label: "Scheduled",
      },
      completed: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Completed",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.scheduled;

    return (
      <View className={`px-3 py-1 rounded-full ${config.bg}`}>
        <Text className={`${config.text} text-xs font-semibold`}>
          {config.label}
        </Text>
      </View>
    );
  };

  const upcomingAppointments = mockAppointments.filter(
    (app) => app.status === "scheduled"
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-4 gap-8">
          {/* Welcome Section */}
          <View>
            <View className="flex-row items-center gap-3">
              <View className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
                <Feather name="star" size={24} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-semibold text-slate-800">
                  Welcome, {user.first_name}!
                </Text>
                <Text className="text-slate-600 mt-1">
                  Here's a summary of your health journey today.
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Cards */}
          <View>
            <View className="gap-4">
              {/* Upcoming Appointments Card */}
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
                      <Feather name="trending-up" size={14} color="#059669" />
                      <Text className="text-sm text-emerald-600 ml-1 font-medium">
                        Next: Tomorrow 9:00 AM
                      </Text>
                    </View>
                  </View>
                  <View className="bg-cyan-500 p-4 rounded-2xl shadow-md">
                    <Feather name="calendar" size={32} color="#ffffff" />
                  </View>
                </View>
              </View>

              {/* Health Tip Card */}
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">
                      Health Tip of the Day
                    </Text>
                    <Text className="text-slate-700 leading-relaxed font-medium">
                      {randomTip}
                    </Text>
                  </View>
                  <View className="bg-emerald-500 p-4 rounded-2xl shadow-md">
                    <Feather name="heart" size={32} color="#ffffff" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View>
            <Text className="text-2xl font-semibold text-slate-800 mb-6">
              Quick Actions
            </Text>
            <View className="gap-4">
              {/* Book Appointment */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Appointments")}
                className="flex-row items-center gap-4 p-6 bg-cyan-50 rounded-xl border border-cyan-200"
                activeOpacity={0.7}
              >
                <View className="bg-cyan-500 p-3 rounded-xl shadow-md">
                  <Feather name="plus" size={24} color="#ffffff" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-slate-800 text-lg">
                    Book Appointment
                  </Text>
                  <Text className="text-slate-600">
                    Schedule your next visit
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Start AI Chat */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Chat")}
                className="flex-row items-center gap-4 p-6 bg-sky-50 rounded-xl border border-sky-200"
                activeOpacity={0.7}
              >
                <View className="bg-sky-500 p-3 rounded-xl shadow-md">
                  <Feather name="message-square" size={24} color="#ffffff" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-slate-800 text-lg">
                    Start AI Chat
                  </Text>
                  <Text className="text-slate-600">
                    Get instant health advice
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Set Reminder */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Reminders")}
                className="flex-row items-center gap-4 p-6 bg-blue-50 rounded-xl border border-blue-200"
                activeOpacity={0.7}
              >
                <View className="bg-blue-500 p-3 rounded-xl shadow-md">
                  <Feather name="bell" size={24} color="#ffffff" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-slate-800 text-lg">
                    Set Reminder
                  </Text>
                  <Text className="text-slate-600">Never miss medication</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Upcoming Appointments */}
          <View>
            <Text className="text-2xl font-semibold text-slate-800 mb-6">
              Upcoming Appointments
            </Text>

            {upcomingAppointments.length === 0 ? (
              <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-12 items-center">
                <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                  <Feather name="calendar" size={64} color="#9ca3af" />
                </View>
                <Text className="text-xl font-bold text-slate-700 mb-2">
                  No upcoming appointments yet
                </Text>
                <Text className="text-slate-500 text-center">
                  Your upcoming appointments will appear here.
                </Text>
              </View>
            ) : (
              <View className="gap-4">
                {upcomingAppointments.map((appointment) => (
                  <View
                    key={appointment.id}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
                  >
                    {/* Doctor Info Row */}
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-1 mr-2">
                        <Text
                          className="font-bold text-slate-800 text-lg mb-2"
                          numberOfLines={1}
                        >
                          {appointment.doctorName}
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                          <View className="bg-slate-200 px-3 py-1 rounded-full">
                            <Text className="text-slate-600 text-xs font-medium">
                              {appointment.specialty}
                            </Text>
                          </View>
                          <View className="bg-slate-100 px-3 py-1 rounded-full">
                            <Text className="text-slate-700 text-xs font-medium capitalize">
                              {appointment.type}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Status & Menu */}
                      <View className="items-end gap-2">
                        {getStatusBadge(appointment.status)}
                        <TouchableOpacity
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          activeOpacity={0.7}
                        >
                          <Feather
                            name="more-horizontal"
                            size={20}
                            color="#64748b"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Date & Time */}
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-row items-center flex-1">
                        <Feather name="calendar" size={16} color="#64748b" />
                        <Text className="text-slate-600 ml-2 font-medium">
                          {formatDate(appointment.date)}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Feather name="clock" size={16} color="#64748b" />
                        <Text className="text-slate-600 ml-2 font-medium">
                          {formatTime(appointment.date)}
                        </Text>
                      </View>
                    </View>

                    {/* Quick Actions Footer */}
                    <View className="flex-row justify-between items-center pt-4 border-t border-slate-100">
                      <TouchableOpacity
                        className="flex-row items-center"
                        activeOpacity={0.7}
                      >
                        <Feather name="user" size={16} color="#3b82f6" />
                        <Text className="text-blue-600 font-medium ml-2">
                          Profile
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="flex-row items-center"
                        activeOpacity={0.7}
                      >
                        <Feather name="bell" size={16} color="#8b5cf6" />
                        <Text className="text-purple-600 font-medium ml-2">
                          Remind
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="flex-row items-center"
                        activeOpacity={0.7}
                      >
                        <Feather name="x" size={16} color="#ef4444" />
                        <Text className="text-red-600 font-medium ml-2">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
