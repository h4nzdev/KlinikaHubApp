import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";

// Mock static data
const mockAppointments = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "2024-01-15T10:00:00",
    type: "checkup",
    status: "scheduled",
    time: "10:00 AM",
  },
  {
    id: "2",
    doctorName: "Dr. Mike Chen",
    specialty: "Dermatology",
    date: "2024-01-16T14:30:00",
    type: "consultation",
    status: "completed",
    time: "02:30 PM",
  },
];

const Appointments = ({ navigation }) => {
  const [appointments] = useState(mockAppointments);
  const [user] = useState({
    name: "Hanz Christian Angelo G Magbal",
    phone: "+1 234 567 8900",
    email: "hanz@example.com",
    clinicId: { subscriptionPlan: "free" },
  });

  // Plan limits
  const planLimits = {
    free: 10,
    basic: 20,
    pro: Infinity,
  };

  const plan = user.clinicId.subscriptionPlan;
  const maxAppointments = planLimits[plan];
  const clinicAppointmentCount = appointments.length;
  const limitReached = clinicAppointmentCount >= maxAppointments;

  const handleNewAppointmentClick = () => {
    if (limitReached) {
      alert(
        `The clinic has reached its appointment limit for the ${plan} plan.`
      );
    } else {
      navigation.navigate("Doctors");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: {
        bgColor: "bg-cyan-100",
        textColor: "text-cyan-600",
        text: "scheduled",
      },
      pending: {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-600",
        text: "pending",
      },
      completed: {
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-600",
        text: "completed",
      },
      cancelled: {
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        text: "cancelled",
      },
      rejected: {
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        text: "rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.scheduled;

    return (
      <View className={`px-2 py-1 rounded-md ${config.bgColor}`}>
        <Text
          className={`${config.textColor} text-sm font-semibold capitalize`}
        >
          {config.text}
        </Text>
      </View>
    );
  };

  // Stats data
  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: "calendar",
      color: "bg-slate-50",
      iconBg: "bg-slate-200",
      iconColor: "#475569",
      textColor: "text-slate-700",
    },
    {
      title: "Upcoming",
      value: appointments.filter((app) =>
        ["pending", "scheduled"].includes(app.status)
      ).length,
      icon: "clock",
      color: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "#0891b2",
      textColor: "text-cyan-700",
    },
    {
      title: "Completed",
      value: appointments.filter((app) => app.status === "completed").length,
      icon: "check-circle",
      color: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "#059669",
      textColor: "text-emerald-700",
    },
    {
      title: "Cancelled",
      value: appointments.filter((app) =>
        ["cancelled", "rejected"].includes(app.status)
      ).length,
      icon: "alert-circle",
      color: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "#d97706",
      textColor: "text-amber-700",
    },
  ];

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
          {/* Header Section */}
          <View>
            <View className="gap-6">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-slate-800">
                  My Appointments
                </Text>
                <Text className="text-slate-600 mt-3 text-lg">
                  View and manage your upcoming appointments.
                </Text>
                {limitReached && (
                  <View className="flex-row items-center mt-4 border border-red-500 bg-red-200 rounded-lg p-3 gap-2">
                    <Feather name="alert-triangle" size={20} color="#dc2626" />
                    <Text className="text-red-600 font-semibold flex-1">
                      The clinic has reached its appointment limit for the{" "}
                      {plan} plan.
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={handleNewAppointmentClick}
                className={`flex-row items-center justify-center px-8 py-4 rounded-2xl shadow-lg ${
                  limitReached ? "bg-slate-400" : "bg-cyan-500"
                }`}
              >
                <Feather name="plus" size={20} color="#ffffff" />
                <Text className="text-white font-semibold ml-3 text-lg">
                  New Appointment
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Section */}
          <View>
            <View className="gap-4">
              {/* First Row - 2 cards */}
              <View className="flex-row gap-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <View key={index} className="flex-1">
                    <View
                      className={`${stat.color} border border-white/20 rounded-2xl p-6 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-3 opacity-80`}
                          >
                            {stat.title}
                          </Text>
                          <Text className="text-3xl font-bold text-slate-800">
                            {stat.value}
                          </Text>
                        </View>
                        <View
                          className={`p-3 rounded-xl ${stat.iconBg} ml-3 shadow-md`}
                        >
                          <Feather
                            name={stat.icon}
                            size={24}
                            color={stat.iconColor}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Second Row - 2 cards */}
              <View className="flex-row gap-4">
                {stats.slice(2, 4).map((stat, index) => (
                  <View key={index + 2} className="flex-1">
                    <View
                      className={`${stat.color} border border-white/20 rounded-2xl p-6 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-3 opacity-80`}
                          >
                            {stat.title}
                          </Text>
                          <Text className="text-3xl font-bold text-slate-800">
                            {stat.value}
                          </Text>
                        </View>
                        <View
                          className={`p-3 rounded-xl ${stat.iconBg} ml-3 shadow-md`}
                        >
                          <Feather
                            name={stat.icon}
                            size={24}
                            color={stat.iconColor}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Appointments Section */}
          <View>
            <View className="mb-6">
              <Text className="text-2xl font-bold text-slate-800">
                All Appointments
              </Text>
              <Text className="text-slate-600 mt-2 text-lg">
                {appointments.length} appointment
                {appointments.length !== 1 ? "s" : ""} found
              </Text>
            </View>

            {/* Mobile Card Layout */}
            {appointments.length > 0 ? (
              <View className="gap-4">
                {appointments.map((appointment) => (
                  <View
                    key={appointment.id}
                    className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6"
                  >
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-1">
                        <Text className="font-bold text-slate-800 text-lg mb-2">
                          {appointment.doctorName}
                        </Text>
                        <Text className="text-slate-600 text-base font-medium mb-3">
                          {appointment.specialty}
                        </Text>
                      </View>
                      <View className="ml-4">
                        {getStatusBadge(appointment.status)}
                      </View>
                    </View>

                    <View className="flex-row gap-4 mb-4">
                      <View className="flex-1 bg-slate-50/80 rounded-xl p-3">
                        <Text className="text-slate-500 text-sm uppercase tracking-wide mb-1 font-semibold">
                          Date
                        </Text>
                        <Text className="font-bold text-slate-700">
                          {formatDate(appointment.date)}
                        </Text>
                      </View>
                      <View className="flex-1 bg-slate-50/80 rounded-xl p-3">
                        <Text className="text-slate-500 text-sm uppercase tracking-wide mb-1 font-semibold">
                          Time
                        </Text>
                        <Text className="font-bold text-slate-700">
                          {appointment.time}
                        </Text>
                      </View>
                    </View>

                    <View className="pt-4 border-t border-slate-200/50">
                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="text-base text-slate-700 font-medium">
                            {user.phone}
                          </Text>
                          <Text className="text-sm text-slate-500">
                            {user.email}
                          </Text>
                        </View>
                        <TouchableOpacity className="p-2">
                          <Feather
                            name="more-horizontal"
                            size={20}
                            color="#6b7280"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-12 items-center">
                <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                  <Feather name="calendar" size={64} color="#9ca3af" />
                </View>
                <Text className="text-xl font-bold text-slate-700 mb-2">
                  No appointments found
                </Text>
                <Text className="text-slate-500 text-lg text-center">
                  Click "New Appointment" to schedule one.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Appointments;
