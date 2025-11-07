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
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";
import appointmentServices from "../../../services/appointmentsServices";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import { useReminder } from "../../../context/ReminderContext";
import Toast from "react-native-toast-message";
import AppointmentModal from "./components/AppointmentModal";
import AppointmentDetails from "./components/AppointmentDetails";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

// ==================== MAIN APPOINTMENTS COMPONENT ====================
const Appointments = ({ navigation }) => {
  const { user } = useContext(AuthenticationContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remindedAppointments, setRemindedAppointments] = useState(new Set());
  const { addReminder, reminders } = useReminder();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Modal state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Advanced filter state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("all"); // all, upcoming, past
  const [statusFilter, setStatusFilter] = useState("all"); // all, scheduled, pending, completed, cancelled
  const [clinicFilter, setClinicFilter] = useState("all");

  //Show Details
  const [showDetails, setShowDetails] = useState(false);

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

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching appointments with details from API...");

      const appointmentsData =
        await appointmentServices.getAppointmentsByPatientIdWithDetails(
          user.id
        );
      console.log("✅ Appointments with details fetched:", appointmentsData);

      setAppointments(appointmentsData || []);
    } catch (error) {
      console.error("❌ Error fetching appointments with details:", error);
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

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const checkIfReminderExists = (appointment) => {
    if (!appointment) {
      return false;
    }
    return reminders.some(
      (reminder) =>
        reminder.appointmentId === appointment.id && reminder.isActive
    );
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

  // Show dropdown menu
  const showDropdown = (appointment) => {
    setSelectedAppointment(appointment);
    setDropdownVisible(true);
  };

  // Handle cancel appointment
  const handleCancelAppointment = async (appointment) => {
    setDropdownVisible(false);

    try {
      console.log(`🔄 Cancelling appointment: ${appointment.id}`);
      await appointmentServices.updateAppointmentStatus(appointment.id, 3);

      // Update UI immediately using functional update
      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app.id === appointment.id ? { ...app, status: 3 } : app
        )
      );

      Toast.show({
        type: "success",
        text1: "Appointment cancelled successfully",
      });
      console.log("✅ Appointment cancelled successfully");
    } catch (error) {
      console.error("❌ Error cancelling appointment:", error);
      Toast.show({
        type: "error",
        text1: "Failed to cancel appointment",
      });
    }
  };

  // Handle set reminder
  const handleSaveReminder = (appointment) => {
    // ✅ Check if reminder already exists FIRST
    if (checkIfReminderExists(appointment)) {
      Toast.show({
        type: "info",
        text1: "Reminder already exists",
        text2: "This appointment already has an active reminder",
      });
      return;
    }

    const reminderFormData = {
      name: `Appointment with ${getDoctorName(appointment)} on ${formatDate(appointment.appointment_date)}`,
      time: formatTime(appointment.schedule),
      time24: `${new Date(appointment.schedule).getHours().toString().padStart(2, "0")}:${new Date(appointment.schedule).getMinutes().toString().padStart(2, "0")}`,
      date: appointment.appointment_date, // NEW: Use appointment date
      appointmentId: appointment.id, // NEW: Link to appointment
      isActive: true,
    };

    addReminder(reminderFormData);

    // Add to reminded appointments set
    setRemindedAppointments((prev) => new Set(prev).add(appointment.id));

    Toast.show({
      type: "success",
      text1: "Reminder Added Successfully",
    });
  };

  // Get status badge with proper API status mapping
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

  // Get doctor name from appointment data
  const getDoctorName = (appointment) => {
    return appointment.doctor_name || "Medical Consultation";
  };

  // Get clinic name from appointment data
  const getClinicName = (appointment) => {
    return appointment.clinic_name || "Main Clinic";
  };

  // Get unique clinics for filter
  const uniqueClinics = [
    ...new Set(appointments.map((app) => getClinicName(app))),
  ];

  // ADVANCED FILTERING LOGIC
  const filteredAppointments = appointments.filter((appointment) => {
    const today = new Date();
    const appointmentDate = new Date(appointment.appointment_date);

    // Date filtering
    const dateMatch =
      dateFilter === "all" ||
      (dateFilter === "upcoming" && appointmentDate >= today) ||
      (dateFilter === "past" && appointmentDate < today);

    // Status filtering
    const statusMap = {
      0: "pending",
      1: "scheduled",
      2: "completed",
      3: "cancelled",
    };
    const currentStatus = statusMap[appointment.status] || "pending";
    const statusMatch =
      statusFilter === "all" || currentStatus === statusFilter;

    // Clinic filtering
    const clinicMatch =
      clinicFilter === "all" || getClinicName(appointment) === clinicFilter;

    // Search query filtering
    const searchMatch =
      searchQuery === "" ||
      getDoctorName(appointment)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      getClinicName(appointment)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return dateMatch && statusMatch && clinicMatch && searchMatch;
  });

  // Display appointments with showAll logic
  const displayAppointments = showAll
    ? filteredAppointments
    : filteredAppointments.slice(0, 5);

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

  // Reset all filters
  const resetFilters = () => {
    setFilter("all");
    setSearchQuery("");
    setDateFilter("all");
    setStatusFilter("all");
    setClinicFilter("all");
    setShowAdvancedFilters(false);
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
      <Header />

      {/* REUSABLE MODAL COMPONENT */}
      <AppointmentModal
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        appointment={selectedAppointment}
        onSetReminder={handleSaveReminder}
        onCancelAppointment={handleCancelAppointment}
        onViewDetails={setShowDetails}
        fetchAppointments={fetchAppointments}
      />

      <AppointmentDetails
        appointment={selectedAppointment}
        visible={showDetails}
        onClose={() => setShowDetails(false)}
      />

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
                  {filteredAppointments.length !== appointments.length &&
                    " (filtered)"}
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

          {/* Advanced Filter Toggle */}
          <TouchableOpacity
            onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex-row items-center justify-between bg-white rounded-2xl shadow-lg border border-slate-200 p-4"
          >
            <View className="flex-row items-center">
              <Feather name="filter" size={20} color="#64748b" />
              <Text className="text-slate-800 font-medium ml-3">
                Advanced Filters
              </Text>
              {(dateFilter !== "all" ||
                statusFilter !== "all" ||
                clinicFilter !== "all") && (
                <View className="bg-cyan-500 rounded-full w-5 h-5 items-center justify-center ml-2">
                  <Text className="text-white text-xs font-bold">!</Text>
                </View>
              )}
            </View>
            <Feather
              name={showAdvancedFilters ? "chevron-up" : "chevron-down"}
              size={20}
              color="#64748b"
            />
          </TouchableOpacity>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-800 font-semibold">
                  Advanced Filters
                </Text>
                <TouchableOpacity onPress={resetFilters}>
                  <Text className="text-cyan-600 font-medium">Reset All</Text>
                </TouchableOpacity>
              </View>

              {/* Date Filter */}
              <View>
                <Text className="text-slate-600 text-sm font-medium mb-2">
                  Date
                </Text>
                <View className="flex-row gap-2">
                  {[
                    { key: "all", label: "All Dates" },
                    { key: "upcoming", label: "Upcoming" },
                    { key: "past", label: "Past" },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => setDateFilter(item.key)}
                      className={`px-3 py-2 rounded-xl ${
                        dateFilter === item.key ? "bg-cyan-500" : "bg-slate-100"
                      }`}
                    >
                      <Text
                        className={
                          dateFilter === item.key
                            ? "text-white font-medium"
                            : "text-slate-700"
                        }
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Status Filter */}
              <View>
                <Text className="text-slate-600 text-sm font-medium mb-2">
                  Status
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { key: "all", label: "All Status" },
                    { key: "scheduled", label: "Scheduled" },
                    { key: "pending", label: "Pending" },
                    { key: "completed", label: "Completed" },
                    { key: "cancelled", label: "Cancelled" },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => setStatusFilter(item.key)}
                      className={`px-3 py-2 rounded-xl ${
                        statusFilter === item.key
                          ? "bg-cyan-500"
                          : "bg-slate-100"
                      }`}
                    >
                      <Text
                        className={
                          statusFilter === item.key
                            ? "text-white font-medium"
                            : "text-slate-700"
                        }
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Clinic Filter */}
              {uniqueClinics.length > 1 && (
                <View>
                  <Text className="text-slate-600 text-sm font-medium mb-2">
                    Clinic
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => setClinicFilter("all")}
                        className={`px-3 py-2 rounded-xl ${
                          clinicFilter === "all"
                            ? "bg-cyan-500"
                            : "bg-slate-100"
                        }`}
                      >
                        <Text
                          className={
                            clinicFilter === "all"
                              ? "text-white font-medium"
                              : "text-slate-700"
                          }
                        >
                          All Clinics
                        </Text>
                      </TouchableOpacity>
                      {uniqueClinics.map((clinic) => (
                        <TouchableOpacity
                          key={clinic}
                          onPress={() => setClinicFilter(clinic)}
                          className={`px-3 py-2 rounded-xl ${
                            clinicFilter === clinic
                              ? "bg-cyan-500"
                              : "bg-slate-100"
                          }`}
                        >
                          <Text
                            className={
                              clinicFilter === clinic
                                ? "text-white font-medium"
                                : "text-slate-700"
                            }
                          >
                            {clinic}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {/* Quick Stats Summary */}
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
                {filteredAppointments.length !== appointments.length &&
                  ` (${filteredAppointments.length} filtered)`}
              </Text>
              {filteredAppointments.length > 0 && (
                <Text className="text-slate-500 text-sm">
                  Showing {displayAppointments.length} of{" "}
                  {filteredAppointments.length}
                </Text>
              )}
            </View>

            {filteredAppointments.length > 0 ? (
              <View className="gap-3">
                {displayAppointments.map((appointment) => (
                  <TouchableOpacity
                    key={appointment.id}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 active:bg-slate-50"
                    activeOpacity={0.7}
                    onPress={() => {
                      console.log("View appointment details", appointment.id);
                    }}
                  >
                    {/* Appointment Card */}
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
                          disabled={
                            checkIfReminderExists(appointment) ||
                            remindedAppointments.has(appointment.id)
                          }
                        >
                          <Feather
                            name={
                              checkIfReminderExists(appointment)
                                ? "check"
                                : "bell"
                            }
                            size={18}
                            color={
                              checkIfReminderExists(appointment) ||
                              remindedAppointments.has(appointment.id)
                                ? "#059669" // Green for active reminder
                                : "#8b5cf6" // Purple for new reminder
                            }
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => showDropdown(appointment)}
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

                {/* SHOW ALL / SHOW LESS TOGGLE */}
                {filteredAppointments.length > 5 && (
                  <TouchableOpacity
                    onPress={() => setShowAll(!showAll)}
                    className="bg-cyan-50 rounded-2xl border border-cyan-200 p-4 items-center"
                    activeOpacity={0.7}
                  >
                    <Text className="text-cyan-600 font-semibold">
                      {showAll
                        ? `Show Less`
                        : `View All ${filteredAppointments.length} Appointments`}
                    </Text>
                    <Text className="text-cyan-500 text-sm mt-1">
                      {showAll
                        ? "Collapse the list"
                        : "See your complete appointment schedule"}
                    </Text>
                  </TouchableOpacity>
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
                  {searchQuery ||
                  dateFilter !== "all" ||
                  statusFilter !== "all" ||
                  clinicFilter !== "all"
                    ? "Try changing your search or filters"
                    : "Schedule your first appointment to get started"}
                </Text>
                {searchQuery ||
                dateFilter !== "all" ||
                statusFilter !== "all" ||
                clinicFilter !== "all" ? (
                  <TouchableOpacity
                    onPress={resetFilters}
                    className="flex-row items-center px-6 py-3 bg-cyan-500 rounded-xl"
                  >
                    <Feather name="refresh-cw" size={18} color="#ffffff" />
                    <Text className="text-white font-semibold ml-2">
                      Clear All Filters
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
