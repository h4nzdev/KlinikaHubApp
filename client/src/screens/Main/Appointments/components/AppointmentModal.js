import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const AppointmentModal = ({
  visible,
  onClose,
  appointment,
  onSetReminder,
  onCancelAppointment,
  onViewReschedule,
}) => {
  const isCancel = appointment?.status === 3;

  // Add these simple functions
  const handleViewAppointment = () => {
    console.log("View appointment:", appointment);
    onViewDetails(true);
    onClose();
  };

  const handleReschedule = () => {
    onViewReschedule(true);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-3xl mx-2 mb-2 shadow-2xl overflow-hidden">
              {/* Drag handle */}
              <View className="items-center py-3">
                <View className="w-12 h-1 bg-slate-300 rounded-full" />
              </View>

              {/* Menu header */}
              <View className="px-6 pb-3 border-b border-slate-100">
                <Text className="text-lg font-semibold text-slate-800">
                  Appointment Options
                </Text>
                <Text className="text-slate-500 text-sm mt-1" numberOfLines={1}>
                  {appointment?.doctor_name || "Medical Consultation"}
                </Text>
              </View>

              {/* Menu items */}
              <View className="py-2">
                {/* VIEW BUTTON - NEW */}
                <TouchableOpacity
                  onPress={handleViewAppointment}
                  className="flex-row items-center px-6 py-4 active:bg-slate-50"
                  activeOpacity={0.6}
                >
                  <View className="bg-green-100 p-3 rounded-xl mr-4">
                    <Feather name="eye" size={20} color="#10b981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-medium text-base">
                      View Details
                    </Text>
                    <Text className="text-slate-500 text-sm mt-1">
                      See appointment information
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#94a3b8" />
                </TouchableOpacity>

                {/* Set Reminder */}
                <TouchableOpacity
                  onPress={() => onSetReminder(appointment)}
                  className="flex-row items-center px-6 py-4 active:bg-slate-50"
                  activeOpacity={0.6}
                >
                  <View className="bg-blue-100 p-3 rounded-xl mr-4">
                    <Feather name="bell" size={20} color="#3b82f6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-medium text-base">
                      Set Reminder
                    </Text>
                    <Text className="text-slate-500 text-sm mt-1">
                      Get notified before appointment
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#94a3b8" />
                </TouchableOpacity>

                {/* RESCHEDULE BUTTON - NEW */}
                <TouchableOpacity
                  onPress={handleReschedule}
                  className="flex-row items-center px-6 py-4 active:bg-slate-50"
                  activeOpacity={0.6}
                >
                  <View className="bg-amber-100 p-3 rounded-xl mr-4">
                    <Feather name="calendar" size={20} color="#f59e0b" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-medium text-base">
                      Reschedule
                    </Text>
                    <Text className="text-slate-500 text-sm mt-1">
                      Change appointment time
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#94a3b8" />
                </TouchableOpacity>

                {/* Cancel Appointment */}
                <TouchableOpacity
                  onPress={() => onCancelAppointment(appointment)}
                  disabled={isCancel}
                  className={`flex-row items-center px-6 py-4 ${isCancel ? "" : "active:bg-red-50"}`}
                  activeOpacity={0.6}
                >
                  <View
                    className={`${isCancel ? "bg-gray-100" : "bg-red-100"} p-3 rounded-xl mr-4`}
                  >
                    <Feather
                      name="x-circle"
                      size={20}
                      color={isCancel ? "#9ca3af" : "#ef4444"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`${isCancel ? "text-gray-400" : "text-red-600"} font-medium text-base`}
                    >
                      Cancel Appointment
                    </Text>
                    <Text
                      className={`${isCancel ? "text-gray-400" : "text-red-400"} text-sm mt-1`}
                    >
                      {isCancel
                        ? "Already cancelled"
                        : "Free up this time slot"}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={isCancel ? "#9ca3af" : "#ef4444"}
                  />
                </TouchableOpacity>
              </View>

              {/* Cancel button */}
              <TouchableOpacity
                onPress={onClose}
                className="mx-4 my-3 bg-slate-100 py-4 rounded-xl items-center active:bg-slate-200"
                activeOpacity={0.7}
              >
                <Text className="text-slate-600 font-semibold text-base">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AppointmentModal;
