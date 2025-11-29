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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalendarPicker from "../../../components/CalendarPicker";
import { TimeFormat } from "../../../utils/TimeFormat";

const Reschedule = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointment } = route.params;
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  console.log("SelectedTime value:", selectedTime);

  // Set max date (60 days from now)
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

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
      setSelectedTime(null); // Reset time when date changes
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

      // Show success message
      Toast.show({
        type: "success",
        text1: "Appointment Rescheduled!",
        text2: `New time: ${TimeFormat(selectedTime)} on ${new Date(
          selectedDate
        ).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
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

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return {
          text: "Pending",
          color: "text-amber-600",
          bg: "bg-amber-100",
        };
      case 1:
        return { text: "Scheduled", color: "text-blue-600", bg: "bg-blue-100" };
      case 2:
        return {
          text: "Completed",
          color: "text-green-600",
          bg: "bg-green-100",
        };
      case 3:
        return { text: "Cancelled", color: "text-red-600", bg: "bg-red-100" };
      default:
        return { text: "Unknown", color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  const currentStatus = getStatusText(appointment.status);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white px-5 py-4 border-b border-gray-200">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={20} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              Reschedule Appointment
            </Text>
            <View className="flex-row flex-wrap items-center gap-1 mt-1">
              <Text
                className="text-gray-600 text-sm flex-shrink"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {appointment.doctor_name}
              </Text>
              <Text className="text-gray-400 text-sm">•</Text>
              <Text
                className="text-gray-600 text-sm flex-1"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {appointment.clinic_name}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-5 gap-5">
          {/* Current Appointment Card */}
          <View className="bg-white rounded-xl border border-gray-200 p-5">
            <View className="flex-row items-center gap-4 mb-4">
              <View className="bg-amber-500 p-2 rounded-lg">
                <Feather name="calendar" size={18} color="#ffffff" />
              </View>
              <Text className="text-base font-semibold text-gray-900">
                Current Appointment
              </Text>
            </View>

            <View className="gap-3">
              <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600 font-medium text-sm">
                  Doctor:
                </Text>
                <Text
                  className="text-gray-900 font-medium text-sm text-right max-w-[60%]"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {appointment.doctor_name}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600 font-medium text-sm">
                  Clinic:
                </Text>
                <Text
                  className="text-gray-900 font-medium text-sm text-right max-w-[60%]"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {appointment.clinic_name}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600 font-medium text-sm">Date:</Text>
                <Text className="text-gray-900 font-medium text-sm text-right">
                  {originalDateTime.date}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600 font-medium text-sm">Time:</Text>
                <Text className="text-gray-900 font-medium text-sm">
                  {originalDateTime.time}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2">
                <Text className="text-gray-600 font-medium text-sm">
                  Status:
                </Text>
                <View className={`px-2 py-1 rounded-full ${currentStatus.bg}`}>
                  <Text
                    className={`text-xs font-medium ${currentStatus.color}`}
                  >
                    {currentStatus.text}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Calendar Section */}
          <View className="bg-white rounded-xl border border-gray-200 p-5">
            <View className="flex-row items-center gap-4 mb-4">
              <View className="bg-blue-500 p-2 rounded-lg">
                <Feather name="calendar" size={18} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  Select New Date
                </Text>
                <Text className="text-gray-500 text-xs mt-0.5">
                  Choose from available dates
                </Text>
              </View>
            </View>

            <CalendarPicker
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              maxDate={maxDate}
            />
          </View>

          {/* Available Times Section */}
          {selectedDate && (
            <View className="bg-white rounded-xl border border-gray-200 p-5">
              <View className="flex-row items-center gap-4 mb-4">
                <View className="bg-green-500 p-2 rounded-lg">
                  <Feather name="clock" size={18} color="#ffffff" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">
                    Select New Time
                  </Text>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    Available time slots for{" "}
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                {fetchingSlots && (
                  <ActivityIndicator size="small" color="#10b981" />
                )}
              </View>

              {availableTimes.length > 0 ? (
                <View className="flex-row flex-wrap gap-2">
                  {availableTimes.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedTime(slot.time)}
                      className={`px-3 py-2.5 rounded-lg flex-1 min-w-[48%] items-center ${
                        selectedTime === slot.time
                          ? "bg-green-500 border border-green-600"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selectedTime === slot.time
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {slot.formattedTime}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View className="items-center py-4 gap-2">
                  <Feather name="clock" size={32} color="#d1d5db" />
                  <Text className="text-gray-500 text-sm text-center">
                    No available times for this date
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Selected Appointment Summary */}
          {selectedDate && selectedTime && (
            <View className="bg-blue-50 rounded-xl border border-blue-200 p-5">
              <View className="flex-row items-center gap-4 mb-4">
                <View className="bg-blue-500 p-2 rounded-lg">
                  <Feather name="check-circle" size={18} color="#ffffff" />
                </View>
                <Text className="text-base font-semibold text-gray-900">
                  New Appointment Summary
                </Text>
              </View>

              <View className="gap-3">
                <View className="flex-row justify-between items-center py-2 border-b border-blue-100">
                  <Text className="text-gray-600 font-medium text-sm">
                    Date:
                  </Text>
                  <Text className="text-gray-900 font-medium text-sm text-right">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center py-2 border-b border-blue-100">
                  <Text className="text-gray-600 font-medium text-sm">
                    Time:
                  </Text>
                  <Text className="text-gray-900 font-medium text-sm">
                    {TimeFormat(selectedTime)}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-gray-600 font-medium text-sm">
                    New Status:
                  </Text>
                  <View className="bg-amber-100 px-2 py-1 rounded-full">
                    <Text className="text-amber-700 text-xs font-medium">
                      Pending Confirmation
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Information Note */}
          <View className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <View className="flex-row items-start gap-3">
              <Feather name="info" size={16} color="#d97706" />
              <Text className="text-amber-800 text-xs flex-1 leading-4">
                After rescheduling, your appointment status will be set to
                "Pending" and will require confirmation from the clinic.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="bg-white border-t border-gray-200 px-5 py-4">
        <TouchableOpacity
          onPress={handleReschedule}
          disabled={!selectedDate || !selectedTime || loading}
          className={`py-3 rounded-lg items-center justify-center ${
            !selectedDate || !selectedTime || loading
              ? "bg-gray-300"
              : "bg-blue-500"
          }`}
          activeOpacity={0.8}
        >
          {loading ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#ffffff" />
              <Text className="text-white font-semibold text-base">
                Rescheduling...
              </Text>
            </View>
          ) : (
            <Text className="text-white font-semibold text-base">
              Confirm Reschedule
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
          className="py-3 rounded-lg items-center mt-2"
          activeOpacity={0.7}
        >
          <Text className="text-gray-600 font-medium text-base">Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Reschedule;
