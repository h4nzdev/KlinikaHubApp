import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import appointmentServices from "../../../services/appointmentsServices";
import { useReminder } from "../../../context/ReminderContext";
import Toast from "react-native-toast-message";

// Static data for the dashboard
const healthTips = [
  "Stay hydrated by drinking at least 8 glasses of water a day.",
  "Incorporate at least 30 minutes of moderate-intensity exercise into your daily routine.",
  "Ensure you get 7-9 hours of quality sleep per night for better health.",
  "A balanced diet rich in fruits, vegetables, and whole grains is key to a healthy lifestyle.",
  "Regular health checkups can help detect potential health issues early.",
  "Manage stress through meditation, deep breathing, or hobbies you enjoy.",
];

const Dashboard = ({ navigation }) => {
  const { user } = useContext(AuthenticationContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
  const [remindedAppointments, setRemindedAppointments] = useState(new Set());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const { addReminder } = useReminder();

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching appointments for dashboard...");

      const appointmentsData =
        await appointmentServices.getAppointmentsByPatientId(user.id);
      console.log("✅ Dashboard appointments fetched:", appointmentsData);

      setAppointments(appointmentsData || []);
    } catch (error) {
      console.error("❌ Error fetching dashboard appointments:", error);
      Alert.alert("Error", "Failed to load appointments. Please try again.");
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Effect to check for expired appointments every hour
  useEffect(() => {
    const checkExpiredAppointments = () => {
      const now = new Date();
      const expiredAppointments = appointments.filter((appointment) => {
        if ([0, 1].includes(appointment.status)) {
          // Only check pending or scheduled
          const appointmentDate = new Date(appointment.appointment_date);
          return appointmentDate < now;
        }
        return false;
      });

      // Auto-cancel expired appointments
      expiredAppointments.forEach(async (appointment) => {
        try {
          console.log(
            `🔄 Auto-cancelling expired appointment: ${appointment.id}`
          );
          await appointmentServices.updateAppointmentStatus(appointment.id, 3); // 3 = cancelled

          // Update local state
          setAppointments((prev) =>
            prev.map((app) =>
              app.id === appointment.id ? { ...app, status: 3 } : app
            )
          );
        } catch (error) {
          console.error("❌ Error auto-cancelling appointment:", error);
        }
      });
    };

    // Check immediately on mount
    checkExpiredAppointments();

    // Set up interval to check every hour (3600000 ms)
    const intervalId = setInterval(checkExpiredAppointments, 3600000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [appointments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
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
    if (!schedule) return "No time set";

    if (schedule.includes("-")) {
      return schedule.split("-")[0].trim();
    }

    return schedule;
  };

  // Handle cancel appointment
  const handleCancelAppointment = async (appointment) => {
    setDropdownVisible(false);

    Alert.alert(
      "Cancel Appointment",
      `Are you sure you want to cancel your appointment with ${getDoctorName(appointment)} on ${formatDate(appointment.appointment_date)}?`,
      [
        {
          text: "No, Keep It",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              console.log(`🔄 Cancelling appointment: ${appointment.id}`);
              await appointmentServices.updateAppointmentStatus(
                appointment.id,
                3
              );

              setAppointments((prev) =>
                prev.map((app) =>
                  app.id === appointment.id ? { ...app, status: 3 } : app
                )
              );

              Toast.show({
                type: "success",
                text1: "Appointment Cancelled",
                text2: "Your appointment has been cancelled successfully.",
              });
            } catch (error) {
              console.error("❌ Error cancelling appointment:", error);
              Toast.show({
                type: "error",
                text1: "Cancellation Failed",
                text2: "Failed to cancel appointment. Please try again.",
              });
            }
          },
        },
      ]
    );
  };

  const handleSaveReminder = (appointment) => {
    setDropdownVisible(false);

    const reminderFormData = {
      name: `Appointment with ${getDoctorName(appointment)} on ${formatDate(appointment.appointment_date)}`,
      time: formatTime(appointment.schedule),
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

  // Show dropdown menu
  const showDropdown = (appointment, event) => {
    const { pageX, pageY } = event.nativeEvent;
    setSelectedAppointment(appointment);
    setDropdownPosition({ x: pageX - 120, y: pageY + 10 }); // Position above the button
    setDropdownVisible(true);
  };

  // Get status badge
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
    return appointment.remarks
      ? `Dr. ${appointment.remarks.split(" ")[0]}`
      : "Medical Consultation";
  };

  // Get specialty from appointment data
  const getSpecialty = (appointment) => {
    return "General Medicine";
  };

  // Get next upcoming appointment
  const getNextAppointment = () => {
    const upcoming = appointments
      .filter((app) => [0, 1].includes(app.status)) // Pending or Scheduled
      .sort(
        (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date)
      );

    return upcoming.length > 0 ? upcoming[0] : null;
  };

  const nextAppointment = getNextAppointment();
  const upcomingAppointments = appointments.filter((app) =>
    [0, 1].includes(app.status)
  );
  const completedAppointments = appointments.filter((app) => app.status === 2);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" />
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="text-slate-600 mt-4 text-lg">
            Loading your dashboard...
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

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View className="flex-1">
            <View
              className="absolute bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 min-w-[180px]"
              style={{
                top: dropdownPosition.y,
                left: dropdownPosition.x,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setDropdownVisible(false);
                  Toast.show({
                    type: "info",
                    text1: "Feature Coming Soon",
                    text2: "View details will be available in the next update",
                  });
                }}
                className="flex-row items-center px-4 py-3 border-b border-slate-100"
                activeOpacity={0.7}
              >
                <Feather name="eye" size={16} color="#334155" />
                <Text className="text-slate-700 font-medium ml-3">
                  View Details
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setDropdownVisible(false);
                  Toast.show({
                    type: "info",
                    text1: "Feature Coming Soon",
                    text2: "Reschedule will be available in the next update",
                  });
                }}
                className="flex-row items-center px-4 py-3 border-b border-slate-100"
                activeOpacity={0.7}
              >
                <Feather name="calendar" size={16} color="#334155" />
                <Text className="text-slate-700 font-medium ml-3">
                  Reschedule
                </Text>
              </TouchableOpacity>

              {/* Set Reminder */}
              <TouchableOpacity
                onPress={() => handleSaveReminder(selectedAppointment)}
                className="flex-row items-center px-4 py-3 border-b border-slate-100"
                activeOpacity={0.7}
              >
                <Feather name="bell" size={16} color="#334155" />
                <Text className="text-slate-700 font-medium ml-3">
                  Set Reminder
                </Text>
              </TouchableOpacity>

              {/* Cancel Appointment */}
              <TouchableOpacity
                onPress={() => handleCancelAppointment(selectedAppointment)}
                className="flex-row items-center px-4 py-3"
                activeOpacity={0.7}
              >
                <Feather name="x-circle" size={16} color="#ef4444" />
                <Text className="text-red-500 font-medium ml-3">
                  Cancel Appointment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
          {/* Welcome Section */}
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
                      {nextAppointment ? (
                        <>
                          <Feather
                            name="trending-up"
                            size={14}
                            color="#059669"
                          />
                          <Text className="text-sm text-emerald-600 ml-1 font-medium">
                            Next: {formatDate(nextAppointment.appointment_date)}{" "}
                            at {formatTime(nextAppointment.schedule)}
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

              {/* Health Stats Card */}
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
                        <Text className="text-slate-600 text-xs">
                          Completed
                        </Text>
                      </View>
                      <View>
                        <Text className="text-2xl font-semibold text-slate-800">
                          {
                            appointments.filter((app) => app.status === 3)
                              .length
                          }
                        </Text>
                        <Text className="text-slate-600 text-xs">
                          Cancelled
                        </Text>
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
                  <View className="bg-blue-500 p-4 rounded-2xl shadow-md">
                    <Feather name="heart" size={32} color="#ffffff" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Upcoming Appointments */}
          <View>
            <Text className="text-2xl font-semibold text-slate-800 mb-6">
              Upcoming Appointments
            </Text>

            {upcomingAppointments.length === 0 ? (
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 items-center">
                <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                  <Feather name="calendar" size={64} color="#9ca3af" />
                </View>
                <Text className="text-xl font-bold text-slate-700 mb-2">
                  No upcoming appointments
                </Text>
                <Text className="text-slate-500 text-center mb-6">
                  Schedule your next appointment to get started
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Appointments")}
                  className="flex-row items-center px-6 py-3 bg-cyan-500 rounded-xl"
                >
                  <Feather name="plus" size={18} color="#ffffff" />
                  <Text className="text-white font-semibold ml-2">
                    Schedule Now
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="gap-4">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
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
                              {getSpecialty(appointment.doctor)}
                            </Text>
                          </View>
                          <View className="bg-slate-100 px-3 py-1 rounded-full">
                            <Text className="text-slate-700 text-xs font-medium capitalize">
                              Consultation
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
                          onPress={(event) => showDropdown(appointment, event)}
                        >
                          <Feather
                            name="more-vertical"
                            size={18}
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
                  </View>
                ))}

                {upcomingAppointments.length > 3 && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Appointments")}
                    className="bg-cyan-50 rounded-2xl border border-cyan-200 p-4 items-center"
                    activeOpacity={0.7}
                  >
                    <Text className="text-cyan-600 font-semibold">
                      View All {upcomingAppointments.length} Appointments
                    </Text>
                    <Text className="text-cyan-500 text-sm mt-1">
                      See your complete appointment schedule
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

export default Dashboard;
