import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import appointmentServices from "../../../../services/appointmentsServices";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRefresh } from "../../../../context/RefreshContext";

const AppointmentModal = ({
  visible,
  onClose,
  appointment,
  onCancelAppointment,
  fetchAppointments,
}) => {
  const isCancel = appointment?.status === 3;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { triggerRefresh } = useRefresh();

  // Updated function to use navigation
  const handleViewAppointment = () => {
    console.log("View appointment:", appointment);
    onClose();
    // Navigate to the full appointment details page
    navigation.navigate("AppointmentDetails", {
      appointment: appointment,
    });
  };

  const handleReschedule = () => {
    onClose();
    navigation.navigate("Reschedule", {
      appointment: appointment,
      onRescheduleSuccess: () => {
        fetchAppointments();
        triggerRefresh();
      },
    });
  };

  const handleDeleteAppointment = async (appointment) => {
    onClose();

    // Show confirmation dialog
    Alert.alert(
      "Delete Appointment",
      "Are you sure you want to delete this appointment? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await appointmentServices.deleteAppointment(appointment.id);

              Toast.show({
                type: "success",
                text1: "Appointment Deleted",
                text2: "The appointment has been removed from your history",
              });

              fetchAppointments();
              triggerRefresh();
            } catch (error) {
              console.error("Delete error:", error);
              Toast.show({
                type: "error",
                text1: "Delete Failed",
                text2: "Could not delete appointment. Please try again.",
              });
            }
          },
        },
      ]
    );
  };

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
                {/* VIEW BUTTON - UPDATED */}
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
                      See full appointment information
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#94a3b8" />
                </TouchableOpacity>

                {/* RESCHEDULE BUTTON */}
                <TouchableOpacity
                  onPress={handleReschedule}
                  disabled={isCancel}
                  className={`flex-row items-center px-6 py-4 ${isCancel ? "" : "active:bg-slate-50"}`}
                  activeOpacity={0.6}
                >
                  <View
                    className={`${isCancel ? "bg-gray-100" : "bg-amber-100"} p-3 rounded-xl mr-4`}
                  >
                    <Feather
                      name="calendar"
                      size={20}
                      color={isCancel ? "#9ca3af" : "#f59e0b"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`${isCancel ? "text-gray-400" : "text-slate-800"} font-medium text-base`}
                    >
                      Reschedule
                    </Text>
                    <Text
                      className={`${isCancel ? "text-gray-400" : "text-slate-500"} text-sm mt-1`}
                    >
                      {isCancel
                        ? "Not available for cancelled appointments"
                        : "Change appointment time"}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={isCancel ? "#9ca3af" : "#94a3b8"}
                  />
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

                {/* Delete Appointment */}
                <TouchableOpacity
                  onPress={() => handleDeleteAppointment(appointment)}
                  className="flex-row items-center px-6 py-4 active:bg-slate-50"
                  activeOpacity={0.6}
                >
                  <View className="bg-red-100 p-3 rounded-xl mr-4">
                    <Feather name="trash-2" size={20} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-600 font-medium text-base">
                      Delete Appointment
                    </Text>
                    <Text className="text-red-400 text-sm mt-1">
                      Remove from your history
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#ef4444" />
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
