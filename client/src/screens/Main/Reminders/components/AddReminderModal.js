// components/AddReminderModal.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddReminderModal = ({ isOpen, onClose, onSave, reminderToEdit }) => {
  const [reminderName, setReminderName] = useState("");
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (reminderToEdit) {
      setReminderName(reminderToEdit.name);
      setIsActive(reminderToEdit.isActive);

      // Parse the stored time back to Date object
      if (reminderToEdit.time) {
        const [time, period] = reminderToEdit.time.split(" ");
        let [hours, minutes] = time.split(":");

        // Convert to 24-hour format for Date object
        if (period === "PM" && hours !== "12") {
          hours = parseInt(hours) + 12;
        }
        if (period === "AM" && hours === "12") {
          hours = 0;
        }

        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));
        setSelectedTime(date);
      }
    } else {
      setReminderName("");
      setSelectedTime(new Date());
      setIsActive(true);
    }
  }, [reminderToEdit, isOpen]);

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  const handleSave = () => {
    if (!reminderName.trim()) {
      Alert.alert("Error", "Please enter a reminder name");
      return;
    }

    const reminderData = {
      name: reminderName.trim(),
      time: formatTime(selectedTime),
      time24: `${selectedTime.getHours().toString().padStart(2, "0")}:${selectedTime.getMinutes().toString().padStart(2, "0")}`, // Store 24-hour format for easier comparison
      isActive,
    };

    if (reminderToEdit) {
      onSave({ ...reminderData, id: reminderToEdit.id });
    } else {
      onSave(reminderData);
    }

    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-2xl w-full max-w-md p-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-slate-800">
              {reminderToEdit ? "Edit Reminder" : "Add New Reminder"}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Feather name="x" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View className="gap-4">
            {/* Reminder Name */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Reminder Name
              </Text>
              <TextInput
                placeholder="E.g., Take Morning Medication"
                value={reminderName}
                onChangeText={setReminderName}
                className="px-4 py-3 border border-slate-200 rounded-xl bg-white"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Time Picker */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Time
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="px-4 py-3 border border-slate-200 rounded-xl bg-white flex-row justify-between items-center"
                activeOpacity={0.7}
              >
                <Text className="text-slate-800 text-base">
                  {formatTime(selectedTime)}
                </Text>
                <Feather name="clock" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Time Picker Modal */}
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleTimeChange}
              />
            )}

            {/* Active Toggle */}
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-sm font-semibold text-slate-700">
                Active Reminder
              </Text>
              <TouchableOpacity
                onPress={() => setIsActive(!isActive)}
                className={`w-12 h-6 rounded-full px-1 justify-center ${
                  isActive ? "bg-cyan-500" : "bg-slate-300"
                }`}
              >
                <View
                  className={`w-4 h-4 rounded-full bg-white transform ${
                    isActive ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View className="gap-3 pt-4">
              <TouchableOpacity
                onPress={handleSave}
                className="px-6 py-4 bg-cyan-500 rounded-xl shadow-lg"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-base text-center">
                  {reminderToEdit ? "Update Reminder" : "Save Reminder"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="px-6 py-4 bg-slate-100 rounded-xl border border-slate-200"
                activeOpacity={0.7}
              >
                <Text className="text-slate-700 font-semibold text-base text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddReminderModal;
