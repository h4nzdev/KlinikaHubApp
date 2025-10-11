// components/ReminderDropdown.js
import React, { useState } from "react";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";

const ReminderDropdown = ({ onEdit, reminder, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = () => {
    setIsOpen(false);
    onEdit();
  };

  const handleToggle = () => {
    setIsOpen(false);
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl"
        activeOpacity={0.7}
      >
        <Feather name="more-horizontal" size={20} color="#334155" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/20"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="flex-1 justify-center items-center">
            <TouchableOpacity activeOpacity={1}>
              <View className="bg-white rounded-xl shadow-lg border border-slate-200 min-w-[160px] mx-4">
                <TouchableOpacity
                  onPress={handleEdit}
                  className="flex-row items-center px-4 py-3 border-b border-slate-100"
                  activeOpacity={0.7}
                >
                  <Feather name="edit-2" size={16} color="#334155" />
                  <Text className="text-slate-700 font-medium ml-3">Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleToggle}
                  className="flex-row items-center px-4 py-3"
                  activeOpacity={0.7}
                >
                  <Feather
                    name={reminder.isActive ? "bell-off" : "bell"}
                    size={16}
                    color="#334155"
                  />
                  <Text className="text-slate-700 font-medium ml-3">
                    {reminder.isActive ? "Deactivate" : "Activate"}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ReminderDropdown;
