import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const AppointmentDetails = ({ visible, onClose, appointment }) => {
  // If no appointment data, don't show anything
  if (!visible || !appointment) {
    return null;
  }

  console.log("Appointment data in details:", appointment);

  // Format date for display
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

  // Format time for display
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid Time";
    }
  };

  // Get status text and color
  const getStatusInfo = (status) => {
    const statusMap = {
      0: { text: "Pending", color: "text-yellow-600", bg: "bg-yellow-100" },
      1: { text: "Scheduled", color: "text-cyan-600", bg: "bg-cyan-100" },
      2: { text: "Completed", color: "text-green-600", bg: "bg-green-100" },
      3: { text: "Cancelled", color: "text-red-600", bg: "bg-red-100" },
    };
    return statusMap[status] || statusMap[0];
  };

  // SAFE JSON parsing for specialties
  const getSpecialties = () => {
    try {
      if (!appointment.doctor_specialties) return [];
      const specialties = JSON.parse(appointment.doctor_specialties);
      return Array.isArray(specialties) ? specialties : [];
    } catch (error) {
      console.log("Error parsing specialties:", error);
      return [];
    }
  };

  const statusInfo = getStatusInfo(appointment.status);
  const specialties = getSpecialties();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        {/* Main container with max-height */}
        <View
          className="bg-white rounded-t-3xl mx-2 mb-2"
          style={{ maxHeight: "90%" }}
        >
          {/* Drag Handle */}
          <View className="items-center py-3">
            <View className="w-12 h-1 bg-slate-300 rounded-full" />
          </View>

          {/* Header */}
          <View className="px-6 pb-4 border-b border-slate-100">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-xl font-bold text-slate-800">
                  Appointment Details
                </Text>
                <Text className="text-slate-500 text-sm mt-1">
                  Complete appointment information
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content - This takes remaining space */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flexGrow: 1, flexShrink: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="p-6 gap-6">
              {/* Status Badge */}
              <View
                className={`px-4 py-3 rounded-2xl ${statusInfo.bg} items-center`}
              >
                <Text className={`font-bold text-lg ${statusInfo.color}`}>
                  {statusInfo.text}
                </Text>
              </View>

              {/* Doctor Information */}
              <View className="bg-slate-50 rounded-2xl p-5">
                <View className="flex-row items-center mb-4">
                  <View className="bg-cyan-500 p-3 rounded-xl mr-4">
                    <Feather name="user" size={24} color="#ffffff" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-800">
                      {appointment.doctor_name}
                    </Text>
                    <Text className="text-slate-600 text-sm">
                      {appointment.doctor_qualification}
                    </Text>
                  </View>
                </View>

                {/* Specialties - SAFE VERSION */}
                {specialties.length > 0 && (
                  <View className="flex-row flex-wrap gap-2">
                    {specialties.map((specialty, index) => (
                      <View
                        key={index}
                        className="bg-white px-3 py-1 rounded-full border border-slate-200"
                      >
                        <Text className="text-slate-700 text-sm">
                          {specialty}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Appointment Time */}
              <View className="bg-blue-50 rounded-2xl p-5">
                <View className="flex-row items-center mb-3">
                  <View className="bg-blue-500 p-3 rounded-xl mr-4">
                    <Feather name="calendar" size={24} color="#ffffff" />
                  </View>
                  <Text className="text-lg font-bold text-slate-800">
                    Appointment Time
                  </Text>
                </View>

                <View className="gap-2">
                  <View className="flex-row justify-between items-center py-2 border-b border-blue-100">
                    <Text className="text-slate-600 font-medium">Date:</Text>
                    <Text className="text-slate-800 font-semibold">
                      {formatDate(appointment.appointment_date)}
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center py-2 border-b border-blue-100">
                    <Text className="text-slate-600 font-medium">Time:</Text>
                    <Text className="text-slate-800 font-semibold">
                      {formatTime(appointment.schedule)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Clinic Information */}
              <View className="bg-green-50 rounded-2xl p-5">
                <View className="flex-row items-center mb-3">
                  <View className="bg-green-500 p-3 rounded-xl mr-4">
                    <Feather name="map-pin" size={24} color="#ffffff" />
                  </View>
                  <Text className="text-lg font-bold text-slate-800">
                    Clinic Information
                  </Text>
                </View>

                <View className="gap-2">
                  <View className="flex-row justify-between items-center py-2 border-b border-green-100">
                    <Text className="text-slate-600 font-medium">Clinic:</Text>
                    <Text className="text-slate-800 font-semibold text-right flex-1 ml-2">
                      {appointment.clinic_name}
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center py-2">
                    <Text className="text-slate-600 font-medium">Fees:</Text>
                    <Text className="text-slate-800 font-semibold">
                      ₱
                      {parseFloat(
                        appointment.consultation_fees
                      ).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Appointment ID */}
              <View className="bg-purple-50 rounded-2xl p-5">
                <View className="flex-row items-center mb-3">
                  <View className="bg-purple-500 p-3 rounded-xl mr-4">
                    <Feather name="hash" size={24} color="#ffffff" />
                  </View>
                  <Text className="text-lg font-bold text-slate-800">
                    Appointment ID
                  </Text>
                </View>

                <Text className="text-slate-700 font-mono text-center py-2">
                  {appointment.appointment_id}
                </Text>
              </View>

              {/* Remarks (if any) */}
              {appointment.remarks && (
                <View className="bg-amber-50 rounded-2xl p-5">
                  <View className="flex-row items-center mb-3">
                    <View className="bg-amber-500 p-3 rounded-xl mr-4">
                      <Feather
                        name="message-square"
                        size={24}
                        color="#ffffff"
                      />
                    </View>
                    <Text className="text-lg font-bold text-slate-800">
                      Remarks
                    </Text>
                  </View>

                  <Text className="text-slate-700 italic">
                    "{appointment.remarks}"
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Close Button - Fixed position at bottom */}
          <View
            className="px-4 py-3 border-t border-slate-100"
            style={{ flexShrink: 0 }}
          >
            <TouchableOpacity
              onPress={onClose}
              className="bg-cyan-500 py-4 rounded-xl items-center active:bg-cyan-600"
              activeOpacity={0.7}
            >
              <Text className="text-white font-bold text-lg">
                Close Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentDetails;
