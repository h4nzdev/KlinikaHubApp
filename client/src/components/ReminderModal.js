// components/ReminderModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useReminder } from "../context/ReminderContext";

const ReminderModal = () => {
  const {
    isNotificationModalOpen,
    dueReminder,
    alertCountdown,
    handleAcknowledge,
  } = useReminder();

  return (
    <Modal
      visible={isNotificationModalOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={handleAcknowledge}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
              <Text className="text-3xl">⏰</Text>
            </View>
            <Text className="text-2xl font-bold text-slate-800 mb-2">
              Reminder Alert!
            </Text>
            <Text className="text-lg text-slate-600 text-center mb-1">
              {dueReminder?.name}
            </Text>
            <Text className="text-sm text-red-500 font-semibold">
              Auto-call in: {alertCountdown}s
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleAcknowledge}
            className="px-6 py-4 bg-cyan-500 rounded-xl shadow-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg text-center">
              Acknowledge Reminder
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReminderModal;
