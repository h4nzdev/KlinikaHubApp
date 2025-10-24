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
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";
import appointmentServices from "../../../services/appointmentsServices";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import { useReminder } from "../../../context/ReminderContext";
import Toast from "react-native-toast-message";
import { getSpecialty } from "../../../utils/getSpecialty";

const Appointments = ({ navigation }) => {
  const { user } = useContext(AuthenticationContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remindedAppointments, setRemindedAppointments] = useState(new Set());
  const { addReminder } = useReminder();
  const [filter, setFilter] = useState("all"); // "all", "upcoming", "completed", "cancelled"
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by status
    const statusMatch =
      filter === "all" ||
      (filter === "upcoming" && [0, 1].includes(appointment.status)) ||
      (filter === "completed" && appointment.status === 2) ||
      (filter === "cancelled" && appointment.status === 3);

    // Filter by search query
    const searchMatch =
      searchQuery === "" ||
      getDoctorName(appointment)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      getClinicName(appointment)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const filterTabs = [
    { key: "all", label: "All", count: appointments.length },
    {
      key: "upcoming",
      label: "Upcoming",
      count: appointments.filter((app) => [0, 1].includes(app.status)).length,
    },
    {
      key: "completed",
      label: "Completed",
      count: appointments.filter((app) => app.status === 2).length,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: appointments.filter((app) => app.status === 3).length,
    },
  ];

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
      <Header />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 gap-6">
          {/* Header Section */}
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
                  {filteredAppointments.length} of {appointments.length}{" "}
                  appointments
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

          {/* Search Bar */}
          <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
            <View className="flex-row items-center">
              <Feather name="search" size={20} color="#64748b" />
              <TextInput
                placeholder="Search doctors or clinics..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 text-slate-800"
                placeholderTextColor="#94a3b8"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Feather name="x" size={20} color="#64748b" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row -mx-4 px-4"
          >
            {filterTabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setFilter(tab.key)}
                className={`flex-row items-center px-4 py-3 rounded-2xl mr-3 ${
                  filter === tab.key
                    ? "bg-cyan-500"
                    : "bg-white border border-slate-200"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    filter === tab.key ? "text-white" : "text-slate-700"
                  }`}
                >
                  {tab.label}
                </Text>
                <View
                  className={`ml-2 px-2 py-1 rounded-full ${
                    filter === tab.key ? "bg-cyan-600" : "bg-slate-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      filter === tab.key ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Quick Stats Summary (instead of detailed cards) */}
          <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
            <View className="flex-row justify-between items-center">
              {[
                {
                  label: "Total",
                  value: appointments.length,
                  color: "text-slate-700",
                },
                {
                  label: "Upcoming",
                  value: appointments.filter((app) =>
                    [0, 1].includes(app.status)
                  ).length,
                  color: "text-cyan-600",
                },
                {
                  label: "Completed",
                  value: appointments.filter((app) => app.status === 2).length,
                  color: "text-emerald-600",
                },
                {
                  label: "Cancelled",
                  value: appointments.filter((app) => app.status === 3).length,
                  color: "text-red-600",
                },
              ].map((stat, index) => (
                <View key={index} className="items-center">
                  <Text className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </Text>
                  <Text className="text-slate-500 text-xs mt-1">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Action */}
          <TouchableOpacity
            onPress={handleNewAppointmentClick}
            className={`flex-row items-center justify-between p-4 rounded-2xl ${
              limitReached
                ? "bg-slate-100"
                : "bg-cyan-50 border border-cyan-200"
            }`}
            disabled={limitReached}
          >
            <View className="flex-row items-center">
              <View
                className={`p-3 rounded-xl ${
                  limitReached ? "bg-slate-300" : "bg-cyan-500"
                }`}
              >
                <Feather name="plus" size={20} color="#ffffff" />
              </View>
              <View className="ml-3">
                <Text
                  className={`font-semibold text-lg ${
                    limitReached ? "text-slate-500" : "text-slate-800"
                  }`}
                >
                  New Appointment
                </Text>
                <Text className="text-slate-600">
                  {limitReached ? "Limit reached" : "Schedule your next visit"}
                </Text>
              </View>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={limitReached ? "#94a3b8" : "#0891b2"}
            />
          </TouchableOpacity>

          {/* Appointments List */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-semibold text-slate-800">
                Appointments
                {filter !== "all" && ` (${filteredAppointments.length})`}
              </Text>
              {filteredAppointments.length > 0 && (
                <Text className="text-slate-500 text-sm">
                  Showing {Math.min(filteredAppointments.length, 10)} of{" "}
                  {filteredAppointments.length}
                </Text>
              )}
            </View>

            {filteredAppointments.length > 0 ? (
              <View className="gap-3">
                {/* Show only first 10, user can filter/search for more */}
                {filteredAppointments.slice(0, 10).map((appointment) => (
                  <TouchableOpacity
                    key={appointment.id}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 active:bg-slate-50"
                    activeOpacity={0.7}
                    onPress={() => {
                      // You can add view details functionality here
                      console.log("View appointment details", appointment.id);
                    }}
                  >
                    {/* Appointment Card - Simplified */}
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="font-bold text-slate-800 text-base mb-1">
                          {getDoctorName(appointment)}
                        </Text>
                        <Text className="text-slate-600 text-sm">
                          {getClinicName(appointment)}
                        </Text>
                      </View>
                      {getStatusBadge(appointment.status)}
                    </View>

                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-slate-700 font-medium text-sm">
                          {formatDate(appointment.appointment_date)}
                        </Text>
                        <Text className="text-slate-500 text-xs">
                          {formatTime(appointment.schedule)}
                        </Text>
                      </View>

                      <View className="flex-row gap-3">
                        <TouchableOpacity
                          onPress={() => handleSaveReminder(appointment)}
                          disabled={remindedAppointments.has(appointment.id)}
                        >
                          <Feather
                            name="bell"
                            size={18}
                            color={
                              remindedAppointments.has(appointment.id)
                                ? "#9ca3af"
                                : "#8b5cf6"
                            }
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              "Quick Actions",
                              `What would you like to do with your appointment with ${getDoctorName(appointment)}?`,
                              [
                                {
                                  text: "View Details",
                                  onPress: () =>
                                    console.log("View details", appointment.id),
                                },
                                {
                                  text: "Set Reminder",
                                  onPress: () =>
                                    handleSaveReminder(appointment),
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
                            size={18}
                            color="#64748b"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

                {/* Show "Load More" if there are more appointments */}
                {filteredAppointments.length > 10 && (
                  <View className="items-center py-4">
                    <Text className="text-slate-500 text-sm">
                      And {filteredAppointments.length - 10} more
                      appointments...
                    </Text>
                    <Text className="text-cyan-600 text-sm mt-1">
                      Use search or filters to find specific appointments
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              // No appointments state
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 items-center">
                <View className="bg-slate-100 rounded-2xl p-6 mb-4">
                  <Feather name="calendar" size={48} color="#9ca3af" />
                </View>
                <Text className="text-lg font-bold text-slate-700 mb-2 text-center">
                  No appointments found
                </Text>
                <Text className="text-slate-500 text-center mb-6">
                  {searchQuery || filter !== "all"
                    ? "Try changing your search or filter"
                    : "Schedule your first appointment to get started"}
                </Text>
                {searchQuery || filter !== "all" ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery("");
                      setFilter("all");
                    }}
                    className="flex-row items-center px-6 py-3 bg-cyan-500 rounded-xl"
                  >
                    <Feather name="refresh-cw" size={18} color="#ffffff" />
                    <Text className="text-white font-semibold ml-2">
                      Show All Appointments
                    </Text>
                  </TouchableOpacity>
                ) : (
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
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Appointments;
