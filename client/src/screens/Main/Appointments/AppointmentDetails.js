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

  // Status configuration
  const statusConfig = {
    0: {
      label: "Pending",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      icon: "clock",
    },
    1: {
      label: "Confirmed",
      color: "text-green-600",
      bg: "bg-green-100",
      icon: "check-circle",
    },
    2: {
      label: "Completed",
      color: "text-blue-600",
      bg: "bg-blue-100",
      icon: "check-square",
    },
    3: {
      label: "Cancelled",
      color: "text-red-600",
      bg: "bg-red-100",
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
      <View className="px-4 py-3 border-b border-slate-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Feather name="chevron-left" size={28} color="#0891b2" />
          </TouchableOpacity>
          <View className="flex-1 ml-3">
            <Text className="text-xl font-bold text-slate-800">
              Appointment Details
            </Text>
            <Text className="text-slate-500 text-sm">
              {appointment.appointment_id}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-6 pb-8">
          {/* Status Banner */}
          <View
            className={`${currentStatus.bg} rounded-2xl p-5 border ${currentStatus.bg.replace("bg-", "border-")}200`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Feather
                  name={currentStatus.icon}
                  size={24}
                  color={currentStatus.color
                    .replace("text-", "#")
                    .replace("-600", "")}
                />
                <Text
                  className={`${currentStatus.color} font-bold text-lg ml-3`}
                >
                  {currentStatus.label}
                </Text>
              </View>
              <Text className="text-slate-600 text-sm">
                ID: {appointment.appointment_id}
              </Text>
            </View>
            {appointment.auto_cancelled && (
              <View className="bg-amber-100 rounded-lg p-2 mt-3">
                <Text className="text-amber-800 text-sm text-center">
                  ⚠️ Automatically cancelled - appointment date passed
                </Text>
              </View>
            )}
          </View>

          {/* Doctor & Clinic Info */}
          <View className="bg-white rounded-2xl p-5 border border-slate-200">
            <Text className="text-lg font-bold text-slate-800 mb-4">
              Healthcare Provider
            </Text>

            <View className="gap-4">
              {/* Doctor */}
              <View className="flex-row items-start gap-3">
                <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                  <Feather name="user" size={20} color="#0891b2" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-slate-800 text-base">
                    {appointment.doctor_name || "Medical Consultation"}
                  </Text>
                  <Text className="text-slate-600 text-sm mt-1">Doctor</Text>
                </View>
              </View>

              {/* Clinic */}
              <View className="flex-row items-start gap-3">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                  <Feather name="home" size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-slate-800 text-base">
                    {appointment.clinic_name || "Main Clinic"}
                  </Text>
                  <Text className="text-slate-600 text-sm mt-1">
                    Medical Facility
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Appointment Details */}
          <View className="bg-white rounded-2xl p-5 border border-slate-200">
            <Text className="text-lg font-bold text-slate-800 mb-4">
              Appointment Details
            </Text>

            <View className="gap-4">
              {/* Date & Time */}
              <View className="flex-row items-start gap-3">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                  <Feather name="calendar" size={20} color="#8b5cf6" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-slate-800 text-base">
                    {formatDate(appointment.appointment_date)}
                  </Text>
                  <Text className="text-slate-600 text-sm mt-1">
                    {formatTime(appointment.schedule)}
                  </Text>
                  <Text className="text-slate-500 text-xs mt-1">
                    Scheduled: {formatDateTime(appointment.schedule)}
                  </Text>
                </View>
              </View>

              {/* Fees */}
              <View className="flex-row items-start gap-3">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
                  <Feather name="dollar-sign" size={20} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-slate-800 text-base">
                    ₱{parseFloat(appointment.consultation_fees || 0).toFixed(2)}
                  </Text>
                  <Text className="text-slate-600 text-sm mt-1">
                    Consultation Fee
                    {appointment.discount > 0 && (
                      <Text className="text-red-600">
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
                <View className="flex-row items-start gap-3">
                  <View className="w-12 h-12 bg-amber-100 rounded-full items-center justify-center">
                    <Feather name="file-text" size={20} color="#d97706" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-slate-800 text-base">
                      Additional Notes
                    </Text>
                    <Text className="text-slate-600 text-sm mt-1 leading-5">
                      {appointment.remarks}
                    </Text>
                  </View>
                </View>
              )}

              {/* Cancellation Reason */}
              {appointment.status === 3 && appointment.cancellation_reason && (
                <View className="flex-row items-start gap-3">
                  <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center">
                    <Feather name="alert-triangle" size={20} color="#dc2626" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-slate-800 text-base">
                      Cancellation Reason
                    </Text>
                    <Text className="text-slate-600 text-sm mt-1 leading-5">
                      {appointment.cancellation_reason}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Created Date */}
          <View className="bg-slate-50 rounded-2xl p-4">
            <View className="flex-row items-center justify-center gap-2">
              <Feather name="clock" size={16} color="#64748b" />
              <Text className="text-slate-600 text-sm">
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
                className="border border-red-500 rounded-xl py-4 items-center flex-row justify-center"
              >
                <Feather name="x" size={20} color="#dc2626" />
                <Text className="text-red-600 font-semibold text-base ml-2">
                  Cancel Appointment
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Completed/Cancelled Message */}
          {(appointment.status === 2 || appointment.status === 3) && (
            <View
              className={`rounded-2xl p-5 ${appointment.status === 2 ? "bg-blue-50 border border-blue-200" : "bg-red-50 border border-red-200"}`}
            >
              <View className="flex-row items-center">
                <Feather
                  name={appointment.status === 2 ? "check-circle" : "x-circle"}
                  size={24}
                  color={appointment.status === 2 ? "#3b82f6" : "#dc2626"}
                />
                <Text
                  className={`font-semibold text-lg ml-3 ${appointment.status === 2 ? "text-blue-800" : "text-red-800"}`}
                >
                  {appointment.status === 2
                    ? "Appointment Completed"
                    : "Appointment Cancelled"}
                </Text>
              </View>
              <Text
                className={`mt-2 leading-6 ${appointment.status === 2 ? "text-blue-700" : "text-red-700"}`}
              >
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
