import React from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const AppointmentDropdown = ({
  visible,
  onClose,
  selectedAppointment,
  checkIfReminderExists,
  handleSaveReminder,
  handleCancelAppointment,
  getDoctorName,
  insets,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          className="flex-1 justify-end bg-black/50"
          style={{ paddingBottom: insets.bottom }}
        >
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-3xl mx-2 mb-2 shadow-2xl overflow-hidden">
              <View className="items-center py-3">
                <View className="w-12 h-1 bg-slate-300 rounded-full" />
              </View>

              <View className="px-6 pb-3 border-b border-slate-100">
                <Text className="text-lg font-semibold text-slate-800">
                  Appointment Options
                </Text>
                <Text className="text-slate-500 text-sm mt-1" numberOfLines={1}>
                  {selectedAppointment && getDoctorName(selectedAppointment)}
                </Text>
              </View>

              <View className="py-2">
                <TouchableOpacity
                  onPress={() => handleSaveReminder(selectedAppointment)}
                  className="flex-row items-center px-6 py-4 active:bg-slate-50"
                  activeOpacity={0.6}
                  disabled={checkIfReminderExists(selectedAppointment)}
                >
                  <View
                    className={`p-3 rounded-xl mr-4 ${
                      checkIfReminderExists(selectedAppointment)
                        ? "bg-emerald-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <Feather
                      name={
                        checkIfReminderExists(selectedAppointment)
                          ? "check"
                          : "bell"
                      }
                      size={20}
                      color={
                        checkIfReminderExists(selectedAppointment)
                          ? "#059669"
                          : "#3b82f6"
                      }
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-medium text-base">
                      {checkIfReminderExists(selectedAppointment)
                        ? "Reminder Active"
                        : "Set Reminder"}
                    </Text>
                    <Text className="text-slate-500 text-sm mt-1">
                      {checkIfReminderExists(selectedAppointment)
                        ? "You'll be notified before appointment"
                        : "Get notified before appointment"}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={
                      checkIfReminderExists(selectedAppointment)
                        ? "#059669"
                        : "#94a3b8"
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleCancelAppointment(selectedAppointment)}
                  className="flex-row items-center px-6 py-4 active:bg-red-50"
                  activeOpacity={0.6}
                >
                  <View className="bg-red-100 p-3 rounded-xl mr-4">
                    <Feather name="x-circle" size={20} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-600 font-medium text-base">
                      Cancel Appointment
                    </Text>
                    <Text className="text-red-400 text-sm mt-1">
                      Free up this time slot
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>

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

export default AppointmentDropdown;
