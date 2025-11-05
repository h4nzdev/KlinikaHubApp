// screens/Appointments/RescheduleScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { appointmentServices } from "../../../services/appointmentsServices";
import { generateSlot } from "../../../utils/generateSlot";

const Reschedule = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointment } = route.params;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  // Load available dates on component mount
  useEffect(() => {
    loadAvailableDates();
  }, []);

  // Load available dates
  const loadAvailableDates = async () => {
    setFetchingSlots(true);
    try {
      const dates = generateSlot.generateAvailableDates();
      setAvailableDates(dates);
      console.log("✅ Loaded", dates.length, "available dates");
    } catch (error) {
      console.error("Error loading dates:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load available dates",
      });
    } finally {
      setFetchingSlots(false);
    }
  };

  // Load available times when date is selected
  useEffect(() => {
    if (selectedDate) {
      loadAvailableTimes(selectedDate);
    }
  }, [selectedDate]);

  const loadAvailableTimes = async (date) => {
    setFetchingSlots(true);
    try {
      const times = generateSlot.generateTimeSlots(date);
      setAvailableTimes(times);
      console.log("✅ Loaded", times.length, "available times for", date);
    } catch (error) {
      console.error("Error loading times:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load available times",
      });
    } finally {
      setFetchingSlots(false);
    }
  };

  // Format the original appointment date/time
  const formatOriginalDateTime = () => {
    if (!appointment) return { date: "", time: "" };

    try {
      const date = new Date(appointment.appointment_date);
      const time = new Date(appointment.schedule);

      return {
        date: date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    } catch (error) {
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  };

  // Handle reschedule confirmation
  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Selection Required", "Please select both date and time");
      return;
    }

    Alert.alert(
      "Confirm Reschedule",
      "Are you sure you want to reschedule this appointment? The status will be set to pending.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Reschedule",
          onPress: performReschedule,
        },
      ]
    );
  };

  const performReschedule = async () => {
    console.log("🔍 Rescheduling appointment:", {
      appointmentId: appointment.id,
      newDate: selectedDate,
      newTime: selectedTime,
    });

    setLoading(true);

    try {
      // Create proper datetime format for the schedule
      const scheduleDateTime = `${selectedDate}T${selectedTime}`;

      console.log("📅 Formatted schedule:", scheduleDateTime);

      // Step 1: Reschedule the appointment (this updates date and time)
      await appointmentServices.rescheduleAppointment(
        appointment.id,
        selectedDate,
        scheduleDateTime
      );

      // Step 2: Update status to pending (0)
      await appointmentServices.updateAppointmentToPending(appointment.id);

      // Find the selected date and time details for display
      const selectedDateObj = availableDates.find(
        (d) => d.date === selectedDate
      );
      const selectedTimeObj = availableTimes.find(
        (t) => t.time === selectedTime
      );

      // Show success message
      Toast.show({
        type: "success",
        text1: "Appointment Rescheduled!",
        text2: `New time: ${selectedTimeObj?.formattedTime} on ${selectedDateObj?.fullFormattedDate}`,
      });

      if (route.params?.onRescheduleSuccess) {
        route.params.onRescheduleSuccess();
      }
      navigation.goBack();
    } catch (error) {
      console.error("❌ Reschedule error:", error);
      Alert.alert(
        "Reschedule Failed",
        error.message || "Please try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  const originalDateTime = formatOriginalDateTime();
  const selectedDateObj = availableDates.find((d) => d.date === selectedDate);
  const selectedTimeObj = availableTimes.find((t) => t.time === selectedTime);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return {
          text: "Pending",
          color: "text-yellow-600",
          bg: "bg-yellow-100",
        };
      case 1:
        return { text: "Scheduled", color: "text-cyan-600", bg: "bg-cyan-100" };
      case 2:
        return {
          text: "Completed",
          color: "text-emerald-600",
          bg: "bg-emerald-100",
        };
      case 3:
        return { text: "Cancelled", color: "text-red-600", bg: "bg-red-100" };
      default:
        return { text: "Unknown", color: "text-slate-600", bg: "bg-slate-100" };
    }
  };

  const currentStatus = getStatusText(appointment.status);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-slate-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 mr-3"
          >
            <Feather name="arrow-left" size={24} color="#64748b" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-slate-800">
              Reschedule Appointment
            </Text>
            <Text className="text-slate-500 text-sm mt-1">
              {appointment.doctor_name} • {appointment.clinic_name}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-6 gap-6">
          {/* Current Appointment Card */}
          <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-amber-500 p-3 rounded-xl mr-4">
                <Feather name="calendar" size={24} color="#ffffff" />
              </View>
              <Text className="text-lg font-bold text-slate-800">
                Current Appointment
              </Text>
            </View>

            <View className="space-y-3">
              <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
                <Text className="text-slate-600 font-medium">Doctor:</Text>
                <Text className="text-slate-800 font-semibold text-right">
                  {appointment.doctor_name}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
                <Text className="text-slate-600 font-medium">Clinic:</Text>
                <Text className="text-slate-800 font-semibold text-right">
                  {appointment.clinic_name}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
                <Text className="text-slate-600 font-medium">Date:</Text>
                <Text className="text-slate-800 font-semibold">
                  {originalDateTime.date}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
                <Text className="text-slate-600 font-medium">Time:</Text>
                <Text className="text-slate-800 font-semibold">
                  {originalDateTime.time}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2">
                <Text className="text-slate-600 font-medium">Status:</Text>
                <View className={`px-3 py-1 rounded-full ${currentStatus.bg}`}>
                  <Text
                    className={`text-xs font-semibold ${currentStatus.color}`}
                  >
                    {currentStatus.text}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Available Dates Section */}
          <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-500 p-3 rounded-xl mr-4">
                <Feather name="calendar" size={24} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-800">
                  Select New Date
                </Text>
                <Text className="text-slate-500 text-sm mt-1">
                  Choose from available dates
                </Text>
              </View>
              {fetchingSlots && !selectedDate && (
                <ActivityIndicator size="small" color="#3b82f6" />
              )}
            </View>

            {availableDates.length > 0 ? (
              <View className="flex-row flex-wrap gap-3">
                {availableDates.map((date) => (
                  <TouchableOpacity
                    key={date.date}
                    onPress={() => setSelectedDate(date.date)}
                    className={`px-4 py-3 rounded-xl flex-1 min-w-[48%] items-center ${
                      selectedDate === date.date
                        ? "bg-blue-500 border-2 border-blue-600"
                        : "bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <Text
                      className={
                        selectedDate === date.date
                          ? "text-white font-bold text-sm text-center"
                          : "text-slate-700 font-medium text-sm text-center"
                      }
                    >
                      {date.formattedDate}
                    </Text>
                    <Text
                      className={
                        selectedDate === date.date
                          ? "text-blue-100 text-xs mt-1 text-center"
                          : "text-slate-500 text-xs mt-1 text-center"
                      }
                    >
                      {date.day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="items-center py-4">
                <Feather name="calendar" size={48} color="#cbd5e1" />
                <Text className="text-slate-500 mt-2 text-center">
                  No available dates found
                </Text>
                <TouchableOpacity
                  onPress={loadAvailableDates}
                  className="mt-3 px-4 py-2 bg-slate-100 rounded-lg"
                >
                  <Text className="text-slate-700 font-medium">Retry</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Available Times Section */}
          {selectedDate && (
            <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <View className="flex-row items-center mb-4">
                <View className="bg-green-500 p-3 rounded-xl mr-4">
                  <Feather name="clock" size={24} color="#ffffff" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-slate-800">
                    Select New Time
                  </Text>
                  <Text className="text-slate-500 text-sm mt-1">
                    Available time slots for {selectedDateObj?.formattedDate}
                  </Text>
                </View>
                {fetchingSlots && (
                  <ActivityIndicator size="small" color="#10b981" />
                )}
              </View>

              {availableTimes.length > 0 ? (
                <View className="flex-row flex-wrap gap-3">
                  {availableTimes.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedTime(slot.time)}
                      className={`px-4 py-3 rounded-xl flex-1 min-w-[48%] items-center ${
                        selectedTime === slot.time
                          ? "bg-green-500 border-2 border-green-600"
                          : "bg-slate-50 border border-slate-200"
                      }`}
                    >
                      <Text
                        className={
                          selectedTime === slot.time
                            ? "text-white font-bold text-sm"
                            : "text-slate-700 font-medium text-sm"
                        }
                      >
                        {slot.formattedTime}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View className="items-center py-4">
                  <Feather name="clock" size={48} color="#cbd5e1" />
                  <Text className="text-slate-500 mt-2 text-center">
                    No available times for this date
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Selected Appointment Summary */}
          {selectedDate && selectedTime && (
            <View className="bg-purple-50 rounded-2xl border border-purple-200 p-6">
              <View className="flex-row items-center mb-4">
                <View className="bg-purple-500 p-3 rounded-xl mr-4">
                  <Feather name="check-circle" size={24} color="#ffffff" />
                </View>
                <Text className="text-lg font-bold text-slate-800">
                  New Appointment Summary
                </Text>
              </View>

              <View className="space-y-3">
                <View className="flex-row justify-between items-center py-2 border-b border-purple-100">
                  <Text className="text-slate-600 font-medium">Date:</Text>
                  <Text className="text-slate-800 font-semibold">
                    {selectedDateObj?.fullFormattedDate}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center py-2 border-b border-purple-100">
                  <Text className="text-slate-600 font-medium">Time:</Text>
                  <Text className="text-slate-800 font-semibold">
                    {selectedTimeObj?.formattedTime}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-slate-600 font-medium">
                    New Status:
                  </Text>
                  <View className="bg-yellow-100 px-3 py-1 rounded-full">
                    <Text className="text-yellow-700 text-xs font-semibold">
                      Pending Confirmation
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Information Note */}
          <View className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
            <View className="flex-row items-start">
              <Feather name="info" size={20} color="#d97706" />
              <Text className="text-amber-800 text-sm ml-3 flex-1">
                After rescheduling, your appointment status will be set to
                "Pending" and will require confirmation from the clinic.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="bg-white border-t border-slate-200 px-6 py-4">
        <TouchableOpacity
          onPress={handleReschedule}
          disabled={!selectedDate || !selectedTime || loading}
          className={`py-4 rounded-xl items-center justify-center ${
            !selectedDate || !selectedTime || loading
              ? "bg-slate-300"
              : "bg-cyan-500 active:bg-cyan-600"
          }`}
          activeOpacity={0.7}
        >
          {loading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-2">
                Rescheduling...
              </Text>
            </View>
          ) : (
            <Text className="text-white font-bold text-lg">
              Confirm Reschedule
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
          className="py-3 rounded-xl items-center mt-3"
          activeOpacity={0.7}
        >
          <Text className="text-slate-600 font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Reschedule;
