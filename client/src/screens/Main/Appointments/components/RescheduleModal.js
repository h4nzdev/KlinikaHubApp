import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { appointmentServices } from "../../../../services/appointmentsServices";
import { generateSlot } from "../../../../utils/generateSlot";

const RescheduleModal = ({ visible, onClose, appointment, onReschedule }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (visible && appointment) {
      setSelectedDate(null);
      setSelectedTime(null);
      setAvailableDates([]);
      setAvailableTimes([]);
      loadAvailableDates();
    }
  }, [visible, appointment]);

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
    if (selectedDate && appointment) {
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

  // Handle reschedule confirmation - UPDATED FUNCTION
  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      Toast.show({
        type: "error",
        text1: "Please select both date and time",
      });
      return;
    }

    console.log("🔍 Rescheduling appointment:", {
      appointmentId: appointment.id,
      newDate: selectedDate,
      newTime: selectedTime,
    });

    setLoading(true);

    try {
      // Step 1: Reschedule the appointment (this updates date and time)
      await appointmentServices.rescheduleAppointment(
        appointment.id,
        selectedDate,
        selectedTime
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
        text2: `New time: ${selectedTimeObj?.formattedTime} on ${selectedDateObj?.fullFormattedDate}. Status set to pending.`,
      });

      // Call parent callback to refresh appointments
      if (onReschedule) {
        onReschedule({
          appointmentId: appointment.id,
          newDate: selectedDate,
          newTime: selectedTime,
          newStatus: 0, // pending
        });
      }

      onClose();
    } catch (error) {
      console.error("❌ Reschedule error:", error);
      Toast.show({
        type: "error",
        text1: "Reschedule Failed",
        text2: error.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!visible || !appointment) {
    return null;
  }

  const originalDateTime = formatOriginalDateTime();
  const selectedDateObj = availableDates.find((d) => d.date === selectedDate);
  const selectedTimeObj = availableTimes.find((t) => t.time === selectedTime);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-3xl mx-2 mb-2 flex-1 max-h-[95%]">
              {/* Drag Handle */}
              <View className="items-center py-3">
                <View className="w-12 h-1 bg-slate-300 rounded-full" />
              </View>

              {/* Header */}
              <View className="px-6 pb-4 border-b border-slate-100">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-slate-800">
                      Reschedule Appointment
                    </Text>
                    <Text className="text-slate-500 text-sm mt-1">
                      {appointment.doctor_name} • {appointment.clinic_name}
                    </Text>
                    <Text className="text-amber-600 text-xs mt-1">
                      💡 Status will be set to pending after reschedule
                    </Text>
                  </View>
                  <TouchableOpacity onPress={onClose} className="p-2">
                    <Feather name="x" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Scrollable Content */}
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <View className="p-6 gap-6">
                  {/* Current Appointment */}
                  <View className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                    <View className="flex-row items-center mb-3">
                      <View className="bg-amber-500 p-3 rounded-xl mr-4">
                        <Feather name="clock" size={24} color="#ffffff" />
                      </View>
                      <Text className="text-lg font-bold text-slate-800">
                        Current Appointment
                      </Text>
                    </View>

                    <View className="gap-2">
                      <View className="flex-row justify-between items-center py-2 border-b border-amber-100">
                        <Text className="text-slate-600 font-medium">
                          Date:
                        </Text>
                        <Text className="text-slate-800 font-semibold">
                          {originalDateTime.date}
                        </Text>
                      </View>

                      <View className="flex-row justify-between items-center py-2">
                        <Text className="text-slate-600 font-medium">
                          Time:
                        </Text>
                        <Text className="text-slate-800 font-semibold">
                          {originalDateTime.time}
                        </Text>
                      </View>

                      <View className="flex-row justify-between items-center py-2">
                        <Text className="text-slate-600 font-medium">
                          Status:
                        </Text>
                        <View
                          className={`px-3 py-1 rounded-full ${
                            appointment.status === 0
                              ? "bg-yellow-100"
                              : appointment.status === 1
                                ? "bg-cyan-100"
                                : appointment.status === 2
                                  ? "bg-emerald-100"
                                  : "bg-red-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              appointment.status === 0
                                ? "text-yellow-700"
                                : appointment.status === 1
                                  ? "text-cyan-700"
                                  : appointment.status === 2
                                    ? "text-emerald-700"
                                    : "text-red-700"
                            }`}
                          >
                            {appointment.status === 0
                              ? "Pending"
                              : appointment.status === 1
                                ? "Scheduled"
                                : appointment.status === 2
                                  ? "Completed"
                                  : "Cancelled"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Available Dates */}
                  <View className="bg-blue-50 rounded-2xl p-5">
                    <View className="flex-row items-center mb-4">
                      <View className="bg-blue-500 p-3 rounded-xl mr-4">
                        <Feather name="calendar" size={24} color="#ffffff" />
                      </View>
                      <Text className="text-lg font-bold text-slate-800">
                        Select New Date
                        {fetchingSlots && !selectedDate && (
                          <ActivityIndicator
                            size="small"
                            color="#3b82f6"
                            className="ml-2"
                          />
                        )}
                      </Text>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <View className="flex-row gap-3">
                        {availableDates.map((date) => (
                          <TouchableOpacity
                            key={date.date}
                            onPress={() => setSelectedDate(date.date)}
                            className={`px-4 py-3 rounded-xl min-w-[100px] items-center ${
                              selectedDate === date.date
                                ? "bg-blue-500 border-2 border-blue-600"
                                : "bg-white border border-slate-200"
                            }`}
                          >
                            <Text
                              className={
                                selectedDate === date.date
                                  ? "text-white font-bold text-sm"
                                  : "text-slate-700 font-medium text-sm"
                              }
                            >
                              {date.formattedDate}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  {/* Available Times */}
                  {selectedDate && (
                    <View className="bg-green-50 rounded-2xl p-5">
                      <View className="flex-row items-center mb-4">
                        <View className="bg-green-500 p-3 rounded-xl mr-4">
                          <Feather name="clock" size={24} color="#ffffff" />
                        </View>
                        <Text className="text-lg font-bold text-slate-800">
                          Select New Time
                          {fetchingSlots && (
                            <ActivityIndicator
                              size="small"
                              color="#10b981"
                              className="ml-2"
                            />
                          )}
                        </Text>
                      </View>

                      {availableTimes.length > 0 ? (
                        <View className="flex-row flex-wrap gap-3">
                          {availableTimes.map((slot, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => setSelectedTime(slot.time)}
                              className={`px-4 py-3 rounded-xl ${
                                selectedTime === slot.time
                                  ? "bg-green-500 border-2 border-green-600"
                                  : "bg-white border border-slate-200"
                              }`}
                            >
                              <Text
                                className={
                                  selectedTime === slot.time
                                    ? "text-white font-bold"
                                    : "text-slate-700 font-medium"
                                }
                              >
                                {slot.formattedTime}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ) : (
                        <Text className="text-slate-500 text-center py-4">
                          No available times for this date
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Selected Appointment Summary */}
                  {selectedDate && selectedTime && selectedTimeObj && (
                    <View className="bg-purple-50 rounded-2xl p-5 border border-purple-200">
                      <View className="flex-row items-center mb-3">
                        <View className="bg-purple-500 p-3 rounded-xl mr-4">
                          <Feather
                            name="check-circle"
                            size={24}
                            color="#ffffff"
                          />
                        </View>
                        <Text className="text-lg font-bold text-slate-800">
                          New Appointment Time
                        </Text>
                      </View>

                      <View className="gap-2">
                        <View className="flex-row justify-between items-center py-2 border-b border-purple-100">
                          <Text className="text-slate-600 font-medium">
                            Date:
                          </Text>
                          <Text className="text-slate-800 font-semibold">
                            {selectedDateObj.fullFormattedDate}
                          </Text>
                        </View>

                        <View className="flex-row justify-between items-center py-2">
                          <Text className="text-slate-600 font-medium">
                            Time:
                          </Text>
                          <Text className="text-slate-800 font-semibold">
                            {selectedTimeObj.formattedTime}
                          </Text>
                        </View>

                        <View className="flex-row justify-between items-center py-2">
                          <Text className="text-slate-600 font-medium">
                            New Status:
                          </Text>
                          <View className="bg-yellow-100 px-3 py-1 rounded-full">
                            <Text className="text-yellow-700 text-xs font-semibold">
                              Pending
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View className="px-4 pb-4 gap-3">
                <TouchableOpacity
                  onPress={handleReschedule}
                  disabled={!selectedDate || !selectedTime || loading}
                  className={`py-4 rounded-xl items-center justify-center flex-row ${
                    !selectedDate || !selectedTime || loading
                      ? "bg-slate-300"
                      : "bg-cyan-500 active:bg-cyan-600"
                  }`}
                  activeOpacity={0.7}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text className="text-white font-bold text-lg ml-2">
                        Rescheduling...
                      </Text>
                    </>
                  ) : (
                    <Text className="text-white font-bold text-lg">
                      Confirm Reschedule
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onClose}
                  disabled={loading}
                  className="py-4 rounded-xl items-center bg-slate-100 active:bg-slate-200"
                  activeOpacity={0.7}
                >
                  <Text className="text-slate-600 font-semibold text-base">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default RescheduleModal;
