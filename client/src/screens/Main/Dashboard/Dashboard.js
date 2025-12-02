import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Header from "../../../components/Header";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import appointmentServices from "../../../services/appointmentsServices";
import { useReminder } from "../../../context/ReminderContext";
import Toast from "react-native-toast-message";
import { getRandomTip } from "../../../utils/healthTipsGenerator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRefresh } from "../../../context/RefreshContext";
import AppointmentDropdown from "./components/AppointmentDropdown";
import WelcomeSection from "./components/WelcomeSection";
import StatsCards from "./components/StatsCards";
import AppointmentsList from "./components/AppointmentList";

const Dashboard = ({ navigation }) => {
  const { user } = useContext(AuthenticationContext);
  const { refreshKey } = useRefresh();
  const insets = useSafeAreaInsets();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remindedAppointments, setRemindedAppointments] = useState(new Set());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [randomTip, setRandomTip] = useState(getRandomTip());
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  const shouldRefetch = useRef(false);
  const { addReminder, reminders } = useReminder();

  const fetchAppointments = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const appointmentsData =
        await appointmentServices.getAppointmentsByPatientId(user.id);
      setAppointments(appointmentsData || []);
    } catch (error) {
      console.error("❌ Error fetching dashboard appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refreshKey]);

  useEffect(() => {
    const tipInterval = setInterval(
      () => {
        setRandomTip(getRandomTip());
      },
      3 * 60 * 60 * 1000
    );

    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (shouldRefetch.current) {
        fetchAppointments(true);
        shouldRefetch.current = false;
      }
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments(true);
  };

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

  const formatTime = (schedule) => {
    if (!schedule) return "No time set";
    if (schedule.includes("-")) {
      return schedule.split("-")[0].trim();
    }
    return schedule;
  };

  const handleCancelAppointment = async (appointment) => {
    setDropdownVisible(false);
    try {
      await appointmentServices.updateAppointmentStatus(appointment.id, 3);
      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app.id === appointment.id ? { ...app, status: 3 } : app
        )
      );
      Toast.show({
        type: "success",
        text1: "Appointment cancelled successfully",
      });
    } catch (error) {
      console.error("❌ Error cancelling appointment:", error);
    }
  };

  const handleSaveReminder = (appointment) => {
    if (checkIfReminderExists(appointment)) {
      Toast.show({
        type: "info",
        text1: "Reminder already exists",
        text2: "This appointment already has an active reminder",
      });
      setDropdownVisible(false);
      return;
    }

    setDropdownVisible(false);

    const reminderFormData = {
      name: `Appointment with ${getDoctorName(appointment)} on ${formatDate(appointment.appointment_date)}`,
      time: formatTime(appointment.schedule),
      time24: `${new Date(appointment.schedule).getHours().toString().padStart(2, "0")}:${new Date(appointment.schedule).getMinutes().toString().padStart(2, "0")}`,
      date: appointment.appointment_date,
      appointmentId: appointment.id,
      isActive: true,
    };

    addReminder(reminderFormData);
    setRemindedAppointments((prev) => new Set(prev).add(appointment.id));

    Toast.show({
      type: "success",
      text1: "Reminder set successfully",
    });
  };

  const checkIfReminderExists = (appointment) => {
    if (!appointment) return false;
    return reminders.some(
      (reminder) =>
        reminder.appointmentId === appointment.id && reminder.isActive
    );
  };

  const showDropdown = (appointment, event) => {
    const { pageX, pageY } = event.nativeEvent;
    setSelectedAppointment(appointment);
    setDropdownPosition({ x: pageX - 120, y: pageY + 10 });
    setDropdownVisible(true);
  };

  const getDoctorName = (appointment) => {
    return appointment.remarks
      ? `Dr. ${appointment.remarks.split(" ")[0]}`
      : "Medical Consultation";
  };

  const getSpecialty = (appointment) => {
    return "General Medicine";
  };

  const getNextAppointment = () => {
    const upcoming = appointments
      .filter((app) => [0, 1].includes(app.status))
      .sort(
        (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date)
      );
    return upcoming.length > 0 ? upcoming[0] : null;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" />
        <Header navigation={navigation} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="text-slate-600 mt-4 text-lg">
            Loading your dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const nextAppointment = getNextAppointment();
  const upcomingAppointments = appointments.filter((app) =>
    [0, 1].includes(app.status)
  );
  const completedAppointments = appointments.filter((app) => app.status === 2);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      <Header navigation={navigation} />

      <AppointmentDropdown
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        selectedAppointment={selectedAppointment}
        checkIfReminderExists={checkIfReminderExists}
        handleSaveReminder={handleSaveReminder}
        handleCancelAppointment={handleCancelAppointment}
        getDoctorName={getDoctorName}
        insets={insets}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 gap-8">
          <WelcomeSection
            user={user}
            upcomingAppointments={upcomingAppointments}
          />

          <StatsCards
            randomTip={randomTip}
            setRandomTip={setRandomTip}
            upcomingAppointments={upcomingAppointments}
            nextAppointment={nextAppointment}
            formatDate={formatDate}
            formatTime={formatTime}
            completedAppointments={completedAppointments}
            appointments={appointments}
          />

          <AppointmentsList
            upcomingAppointments={upcomingAppointments}
            navigation={navigation}
            showAllAppointments={showAllAppointments}
            setShowAllAppointments={setShowAllAppointments}
            showDropdown={showDropdown}
            getDoctorName={getDoctorName}
            getSpecialty={getSpecialty}
            formatDate={formatDate}
            formatTime={formatTime}
            getStatusBadge={getStatusBadge}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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

export default Dashboard;
