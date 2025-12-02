import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import appointmentServices from "../../../services/appointmentsServices";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppointmentDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointment } = route.params;
  const insets = useSafeAreaInsets();

  // Status configuration - using single color scheme
  const statusConfig = {
    0: {
      label: "Pending",
      color: "#f59e0b",
      icon: "clock",
    },
    1: {
      label: "Confirmed",
      color: "#10b981",
      icon: "check-circle",
    },
    2: {
      label: "Completed",
      color: "#3b82f6",
      icon: "check-square",
    },
    3: {
      label: "Cancelled",
      color: "#ef4444",
      icon: "x-circle",
    },
  };

  const currentStatus = statusConfig[appointment.status] || statusConfig[0];

  // Format date and time
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatTime = (schedule) => {
    try {
      return new Date(schedule).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid Time";
    }
  };

  const formatDateTime = (schedule) => {
    try {
      const date = new Date(schedule);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid Date/Time";
    }
  };

  // Handle cancel appointment
  const handleCancelAppointment = () => {
    if (appointment.status === 3) {
      Alert.alert(
        "Already Cancelled",
        "This appointment has already been cancelled."
      );
      return;
    }

    if (appointment.status === 2) {
      Alert.alert(
        "Cannot Cancel",
        "Completed appointments cannot be cancelled."
      );
      return;
    }

    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
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
              await appointmentServices.updateAppointmentStatus(
                appointment.id,
                3
              );
              Alert.alert(
                "Cancelled",
                "Appointment has been cancelled successfully."
              );
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to cancel appointment. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  // Handle reschedule
  const handleReschedule = () => {
    if (appointment.status === 3) {
      Alert.alert(
        "Cannot Reschedule",
        "Cancelled appointments cannot be rescheduled."
      );
      return;
    }

    if (appointment.status === 2) {
      Alert.alert(
        "Cannot Reschedule",
        "Completed appointments cannot be rescheduled."
      );
      return;
    }

    navigation.navigate("Reschedule", { appointment });
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Feather name="chevron-left" size={28} color="#0891b2" />
          </TouchableOpacity>
          <View className="flex-1 ml-3">
            <Text className="text-xl font-bold text-gray-800">
              Appointment Details
            </Text>
            <Text className="text-gray-500 text-sm">
              {appointment.appointment_id}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-6 pb-8">
          {/* Status Banner with better spacing */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${currentStatus.color}20` }}
                >
                  <Feather
                    name={currentStatus.icon}
                    size={24}
                    color={currentStatus.color}
                  />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm font-medium">
                    Status
                  </Text>
                  <Text
                    className="font-bold text-xl"
                    style={{ color: currentStatus.color }}
                  >
                    {currentStatus.label}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    ID: {appointment.appointment_id}
                  </Text>
                </View>
              </View>
            </View>

            {appointment.auto_cancelled && (
              <View className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <Text className="text-amber-800 text-sm text-center">
                  Automatically cancelled - appointment date passed
                </Text>
              </View>
            )}
          </View>

          {/* Healthcare Provider */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Healthcare Provider
            </Text>

            <View className="gap-4">
              {/* Doctor */}
              <View className="flex-row items-start gap-4">
                <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                  <Feather name="user" size={20} color="#0891b2" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-base">
                    {appointment.doctor_name || "Medical Consultation"}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">Doctor</Text>
                </View>
              </View>

              {/* Clinic */}
              <View className="flex-row items-start gap-4">
                <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                  <Feather name="home" size={20} color="#0891b2" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-base">
                    {appointment.clinic_name || "Main Clinic"}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Medical Facility
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Appointment Details */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Appointment Details
            </Text>

            <View className="gap-4">
              {/* Date & Time */}
              <View className="flex-row items-start gap-4">
                <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                  <Feather name="calendar" size={20} color="#0891b2" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-base">
                    {formatDate(appointment.appointment_date)}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    {formatTime(appointment.schedule)}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-2">
                    Scheduled: {formatDateTime(appointment.schedule)}
                  </Text>
                </View>
              </View>

              {/* Fees */}
              <View className="flex-row items-start gap-4">
                <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                  <Feather name="dollar-sign" size={20} color="#0891b2" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-base">
                    ₱{parseFloat(appointment.consultation_fees || 0).toFixed(2)}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Consultation Fee
                    {appointment.discount > 0 && (
                      <Text className="text-red-500">
                        {" "}
                        (Discount: ₱
                        {parseFloat(appointment.discount).toFixed(2)})
                      </Text>
                    )}
                  </Text>
                </View>
              </View>

              {/* Remarks */}
              {appointment.remarks && (
                <View className="flex-row items-start gap-4">
                  <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                    <Feather name="file-text" size={20} color="#0891b2" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800 text-base">
                      Additional Notes
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1 leading-5">
                      {appointment.remarks}
                    </Text>
                  </View>
                </View>
              )}

              {/* Cancellation Reason */}
              {appointment.status === 3 && appointment.cancellation_reason && (
                <View className="flex-row items-start gap-4">
                  <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                    <Feather name="alert-triangle" size={20} color="#0891b2" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800 text-base">
                      Cancellation Reason
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1 leading-5">
                      {appointment.cancellation_reason}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Created Date */}
          <View className="bg-gray-100 rounded-2xl p-4">
            <View className="flex-row items-center justify-center gap-2">
              <Feather name="clock" size={16} color="#6b7280" />
              <Text className="text-gray-600 text-sm">
                Created on {formatDateTime(appointment.created_at)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          {appointment.status !== 3 && appointment.status !== 2 && (
            <View className="gap-3">
              <TouchableOpacity
                onPress={handleReschedule}
                className="bg-cyan-500 rounded-xl py-4 items-center flex-row justify-center"
              >
                <Feather name="calendar" size={20} color="#ffffff" />
                <Text className="text-white font-semibold text-base ml-2">
                  Reschedule Appointment
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancelAppointment}
                className="border border-gray-300 rounded-xl py-4 items-center flex-row justify-center"
              >
                <Feather name="x" size={20} color="#6b7280" />
                <Text className="text-gray-600 font-semibold text-base ml-2">
                  Cancel Appointment
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Completed/Cancelled Message */}
          {(appointment.status === 2 || appointment.status === 3) && (
            <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor:
                      appointment.status === 2 ? "#3b82f620" : "#ef444420",
                  }}
                >
                  <Feather
                    name={
                      appointment.status === 2 ? "check-circle" : "x-circle"
                    }
                    size={24}
                    color={appointment.status === 2 ? "#3b82f6" : "#ef4444"}
                  />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm font-medium">
                    {appointment.status === 2 ? "Completed" : "Cancelled"}
                  </Text>
                  <Text className="font-bold text-xl text-gray-800">
                    {appointment.status === 2
                      ? "Appointment Completed"
                      : "Appointment Cancelled"}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-600 mt-3 leading-6">
                {appointment.status === 2
                  ? "This appointment has been marked as completed. Thank you for choosing our services."
                  : "This appointment has been cancelled. You can book a new appointment anytime."}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentDetails;
