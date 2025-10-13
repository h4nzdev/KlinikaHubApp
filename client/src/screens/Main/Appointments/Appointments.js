import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";
import appointmentServices from "../../../services/appointmentsServices";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import { useReminder } from "../../../context/ReminderContext";
import Toast from "react-native-toast-message";

const Appointments = ({ navigation }) => {
  const { user } = useContext(AuthenticationContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remindedAppointments, setRemindedAppointments] = useState(new Set());
  const { addReminder } = useReminder();

  // Plan limits
  const planLimits = {
    free: 10,
    basic: 20,
    pro: Infinity,
  };

  const plan = user?.clinicId?.subscriptionPlan || "free";
  const maxAppointments = planLimits[plan];
  const clinicAppointmentCount = appointments.length;
  const limitReached = clinicAppointmentCount >= maxAppointments;

  // Fetch appointments from API - UPDATED TO USE DETAILS
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching appointments with details from API...");

      // USE THE NEW METHOD WITH DETAILS!
      const appointmentsData =
        await appointmentServices.getAppointmentsByPatientIdWithDetails(
          user.id
        );
      console.log("✅ Appointments with details fetched:", appointmentsData);

      setAppointments(appointmentsData || []);
    } catch (error) {
      console.error("❌ Error fetching appointments with details:", error);
      // Fallback to regular method if details fail
      try {
        console.log("🔄 Trying regular appointments fetch...");
        const fallbackData =
          await appointmentServices.getAppointmentsByPatientId(user.id);
        setAppointments(fallbackData || []);
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
        Alert.alert("Error", "Failed to load appointments. Please try again.");
        setAppointments([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const handleNewAppointmentClick = () => {
    if (limitReached) {
      Alert.alert(
        "Appointment Limit Reached",
        `The clinic has reached its appointment limit for the ${plan} plan.`
      );
    } else {
      navigation.navigate("Clinics");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format time for display
  const formatTime = (schedule) => {
    return new Date(schedule).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge with proper API status mapping - MATCHING DASHBOARD STYLE
  const getStatusBadge = (status) => {
    const statusMap = {
      0: "pending",
      1: "scheduled",
      2: "completed",
      3: "cancelled",
    };

    const uiStatus = statusMap[status] || "pending";

    const statusConfig = {
      scheduled: {
        bg: "bg-cyan-100",
        text: "text-cyan-700",
        label: "Scheduled",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pending",
      },
      completed: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Completed",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Cancelled",
      },
    };

    const config = statusConfig[uiStatus] || statusConfig.pending;

    return (
      <View className={`px-3 py-1 rounded-full ${config.bg}`}>
        <Text className={`${config.text} text-xs font-semibold`}>
          {config.label}
        </Text>
      </View>
    );
  };

  // UPDATED: Get doctor name from appointment data - NOW USES REAL DATA
  const getDoctorName = (appointment) => {
    return appointment.doctor_name || "Medical Consultation";
  };

  // UPDATED: Get specialty from appointment data - NOW USES REAL DATA
  const getSpecialty = (appointment) => {
    return appointment.doctor_specialties || "General Medicine";
  };

  // UPDATED: Get clinic name from appointment data
  const getClinicName = (appointment) => {
    return appointment.clinic_name || "Main Clinic";
  };

  // Stats data based on real appointments - MATCHING DASHBOARD STYLE
  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: "calendar",
      color: "bg-white",
      iconColor: "#0891b2",
      textColor: "text-slate-800",
      accentColor: "bg-cyan-500",
    },
    {
      title: "Upcoming",
      value: appointments.filter((app) => [0, 1].includes(app.status)).length,
      icon: "clock",
      color: "bg-white",
      iconColor: "#0891b2",
      textColor: "text-slate-800",
      accentColor: "bg-cyan-500",
    },
    {
      title: "Completed",
      value: appointments.filter((app) => app.status === 2).length,
      icon: "check-circle",
      color: "bg-white",
      iconColor: "#059669",
      textColor: "text-slate-800",
      accentColor: "bg-emerald-500",
    },
    {
      title: "Cancelled",
      value: appointments.filter((app) => app.status === 3).length,
      icon: "x-circle",
      color: "bg-white",
      iconColor: "#dc2626",
      textColor: "text-slate-800",
      accentColor: "bg-red-500",
    },
  ];

  const handleSaveReminder = (reminderData) => {
    const reminderFormData = {
      name: `Appointment with ${getDoctorName(reminderData)} on ${formatDate(reminderData.appointment_date)}`,
      time: formatTime(reminderData.schedule),
      isActive: true,
    };

    addReminder(reminderFormData);

    // Add to reminded appointments set
    setRemindedAppointments((prev) => new Set(prev).add(reminderData.id));

    Toast.show({
      type: "success",
      text1: "Reminder Added Successfully",
    });
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" />
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="text-slate-600 mt-4 text-lg">
            Loading appointments...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 gap-8">
          {/* Header Section - MATCHING DASHBOARD STYLE */}
          <View>
            <View className="flex-row items-center gap-3">
              <View className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
                <Feather name="calendar" size={24} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-semibold text-slate-800">
                  My Appointments
                </Text>
                <Text className="text-slate-600 mt-1">
                  Manage and track your medical appointments
                </Text>
              </View>
            </View>

            {limitReached && (
              <View className="flex-row items-center mt-4 bg-red-50 rounded-xl border border-red-200 p-3 gap-2">
                <Feather name="alert-triangle" size={18} color="#dc2626" />
                <Text className="text-red-600 font-medium flex-1 text-sm">
                  Appointment limit reached ({plan} plan)
                </Text>
              </View>
            )}
          </View>

          {/* Stats Section - MATCHING DASHBOARD CARDS */}
          <View>
            <View>
              {/* Quick Actions Card */}
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">
                      Quick Actions
                    </Text>
                    <TouchableOpacity
                      onPress={handleNewAppointmentClick}
                      className={`flex-row items-center justify-between py-3 px-4 rounded-xl ${
                        limitReached
                          ? "bg-slate-100"
                          : "bg-cyan-50 border border-cyan-200"
                      }`}
                      disabled={limitReached}
                    >
                      <View className="flex-row items-center">
                        <View
                          className={`p-2 rounded-lg ${limitReached ? "bg-slate-300" : "bg-cyan-500"}`}
                        >
                          <Feather name="plus" size={18} color="#ffffff" />
                        </View>
                        <View className="ml-3">
                          <Text
                            className={`font-semibold ${limitReached ? "text-slate-500" : "text-slate-800"}`}
                          >
                            New Appointment
                          </Text>
                          <Text className="text-slate-600 text-sm">
                            Schedule your next visit
                          </Text>
                        </View>
                      </View>
                      <Feather name="chevron-right" size={18} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                  <View className="bg-emerald-500 p-4 rounded-2xl shadow-md">
                    <Feather name="clock" size={32} color="#ffffff" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Detailed Stats - MATCHING DASHBOARD GRID */}
          <View>
            <Text className="text-2xl font-semibold text-slate-800 mb-6">
              Appointment Details
            </Text>

            <View className="flex-row flex-wrap -mx-2">
              {stats.map((stat, index) => (
                <View key={index} className="w-1/2 px-2 mb-4">
                  <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">
                          {stat.title}
                        </Text>
                        <Text className="text-2xl font-semibold text-slate-800">
                          {stat.value}
                        </Text>
                      </View>
                      <View
                        className={`p-3 rounded-xl ${stat.accentColor} shadow-md`}
                      >
                        <Feather name={stat.icon} size={20} color="#ffffff" />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Appointments List - MATCHING DASHBOARD STYLE */}
          <View>
            <Text className="text-2xl font-semibold text-slate-800 mb-6">
              All Appointments
            </Text>

            {appointments.length > 0 ? (
              <View className="gap-4">
                {appointments.map((appointment) => (
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
                          {getDoctorName(appointment)}
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                          <View className="bg-slate-200 px-3 py-1 rounded-full">
                            <Text className="text-slate-600 text-xs font-medium">
                              {getSpecialty(appointment)}
                            </Text>
                          </View>
                          <View className="bg-slate-100 px-3 py-1 rounded-full">
                            <Text className="text-slate-700 text-xs font-medium capitalize">
                              {getClinicName(appointment)}
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
                          onPress={() => {
                            Alert.alert(
                              "Appointment Options",
                              "What would you like to do?",
                              [
                                {
                                  text: "View Details",
                                  onPress: () =>
                                    console.log("View details", appointment.id),
                                },
                                {
                                  text: "Reschedule",
                                  onPress: () =>
                                    console.log("Reschedule", appointment.id),
                                },
                                {
                                  text: "Cancel",
                                  style: "destructive",
                                  onPress: () =>
                                    console.log("Cancel", appointment.id),
                                },
                                {
                                  text: "Close",
                                  style: "cancel",
                                },
                              ]
                            );
                          }}
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
                          {formatDate(appointment.appointment_date)}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Feather name="clock" size={16} color="#64748b" />
                        <Text className="text-slate-600 ml-2 font-medium">
                          {formatTime(appointment.schedule)}
                        </Text>
                      </View>
                    </View>

                    {/* Fees & Quick Actions Footer */}
                    <View className="flex-row justify-between items-center pt-4 border-t border-slate-100">
                      <View>
                        <Text className="text-slate-700 font-semibold">
                          ₱{appointment.consultation_fees || "0.00"}
                        </Text>
                        <Text className="text-slate-500 text-xs">
                          Consultation Fee
                        </Text>
                      </View>

                      <View className="flex-row gap-4">
                        <TouchableOpacity
                          className="flex-row items-center"
                          activeOpacity={0.7}
                          onPress={() => handleSaveReminder(appointment)}
                          disabled={remindedAppointments.has(appointment.id)}
                        >
                          <Feather
                            name="bell"
                            size={16}
                            color={
                              remindedAppointments.has(appointment.id)
                                ? "#9ca3af"
                                : "#8b5cf6"
                            }
                          />
                          <Text
                            className={`font-medium ml-1 text-sm ${
                              remindedAppointments.has(appointment.id)
                                ? "text-slate-400"
                                : "text-purple-600"
                            }`}
                          >
                            {remindedAppointments.has(appointment.id)
                              ? "Reminded"
                              : "Remind"}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          className="flex-row items-center"
                          activeOpacity={0.7}
                        >
                          <Feather name="phone" size={16} color="#3b82f6" />
                          <Text className="text-blue-600 font-medium ml-1 text-sm">
                            Call
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 items-center">
                <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                  <Feather name="calendar" size={64} color="#9ca3af" />
                </View>
                <Text className="text-xl font-bold text-slate-700 mb-2">
                  No appointments yet
                </Text>
                <Text className="text-slate-500 text-center mb-6">
                  Schedule your first appointment to get started
                </Text>
                <TouchableOpacity
                  onPress={handleNewAppointmentClick}
                  className={`flex-row items-center px-6 py-3 rounded-xl ${
                    limitReached ? "bg-slate-300" : "bg-cyan-500"
                  }`}
                  disabled={limitReached}
                >
                  <Feather name="plus" size={18} color="#ffffff" />
                  <Text className="text-white font-semibold ml-2">
                    Schedule Appointment
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Appointments;
