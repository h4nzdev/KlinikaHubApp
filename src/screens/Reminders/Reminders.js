import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../components/Header";

// Mock reminders data
const mockReminders = [
  {
    id: "1",
    name: "Take Morning Medication",
    time: "08:00 AM",
    isActive: true,
  },
  {
    id: "2",
    name: "Drink Water",
    time: "12:00 PM",
    isActive: true,
  },
  {
    id: "3",
    name: "Evening Exercise",
    time: "06:00 PM",
    isActive: false,
  },
  {
    id: "4",
    name: "Check Blood Pressure",
    time: "07:00 PM",
    isActive: true,
  },
];

const Reminders = () => {
  const [reminders, setReminders] = useState(mockReminders);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [reminderName, setReminderName] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  const handleSaveReminder = () => {
    if (!reminderName || !reminderTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newReminder = {
      id: Date.now().toString(),
      name: reminderName,
      time: reminderTime,
      isActive: true,
    };

    setReminders([...reminders, newReminder]);
    setIsAddModalVisible(false);
    setReminderName("");
    setReminderTime("");
    Alert.alert("Success", "Reminder added successfully!");
  };

  const handleEditReminder = () => {
    if (!reminderName || !reminderTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setReminders(
      reminders.map((r) =>
        r.id === selectedReminder.id
          ? { ...r, name: reminderName, time: reminderTime }
          : r
      )
    );
    setIsEditModalVisible(false);
    setReminderName("");
    setReminderTime("");
    setSelectedReminder(null);
    Alert.alert("Success", "Reminder updated successfully!");
  };

  const handleRemove = (id) => {
    Alert.alert(
      "Remove Reminder",
      "Are you sure you want to remove this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setReminders(reminders.filter((r) => r.id !== id));
            Alert.alert("Success", "Reminder removed!");
          },
        },
      ]
    );
  };

  const handleEdit = (reminder) => {
    setSelectedReminder(reminder);
    setReminderName(reminder.name);
    setReminderTime(reminder.time);
    setIsEditModalVisible(true);
  };

  const toggleActive = (id) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const openAddModal = () => {
    setReminderName("");
    setReminderTime("");
    setIsAddModalVisible(true);
  };

  // Stats data
  const stats = [
    {
      title: "Total Reminders",
      value: reminders.length,
      icon: "bell",
      color: "bg-slate-50",
      iconBg: "bg-slate-200",
      iconColor: "#475569",
      textColor: "text-slate-600",
      borderColor: "border-slate-200",
    },
    {
      title: "Active",
      value: reminders.filter((r) => r.isActive).length,
      icon: "check-circle",
      color: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "#059669",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
    {
      title: "Inactive",
      value: reminders.filter((r) => !r.isActive).length,
      icon: "alert-circle",
      color: "bg-slate-50",
      iconBg: "bg-slate-200",
      iconColor: "#475569",
      textColor: "text-slate-600",
      borderColor: "border-slate-200",
    },
    {
      title: "Due Today",
      value: reminders.length,
      icon: "clock",
      color: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "#0891b2",
      textColor: "text-cyan-600",
      borderColor: "border-cyan-200",
    },
  ];

  const ReminderModal = ({ visible, onClose, onSave, isEdit }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-slate-800">
              {isEdit ? "Edit Reminder" : "Add New Reminder"}
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Feather name="x" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View className="gap-4">
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

            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Time
              </Text>
              <TextInput
                placeholder="E.g., 08:00 AM"
                value={reminderTime}
                onChangeText={setReminderTime}
                className="px-4 py-3 border border-slate-200 rounded-xl bg-white"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View className="gap-3 pt-4">
              <TouchableOpacity
                onPress={onSave}
                className="px-6 py-4 bg-cyan-500 rounded-xl shadow-lg"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-base text-center">
                  {isEdit ? "Update Reminder" : "Save Reminder"}
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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-4 gap-8">
          {/* Header Section */}
          <View>
            <View className="gap-6">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-slate-800">
                  My Reminders
                </Text>
                <Text className="text-slate-600 mt-3 text-lg">
                  Manage your personal health reminders.
                </Text>
              </View>
              <TouchableOpacity
                onPress={openAddModal}
                className="flex-row items-center justify-center px-8 py-4 bg-cyan-500 rounded-2xl shadow-lg"
              >
                <Feather name="plus" size={20} color="#ffffff" />
                <Text className="text-white font-semibold ml-3 text-lg">
                  Set New Reminder
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Section */}
          <View>
            <View className="gap-4">
              {/* First Row - 2 stats */}
              <View className="flex-row gap-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <View key={index} className="flex-1">
                    <View
                      className={`${stat.color} border border-white/20 rounded-2xl p-6 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-3 opacity-80`}
                          >
                            {stat.title}
                          </Text>
                          <Text className="text-3xl font-bold text-slate-800">
                            {stat.value}
                          </Text>
                        </View>
                        <View
                          className={`p-3 rounded-xl ${stat.iconBg} ml-3 shadow-md border ${stat.borderColor}`}
                        >
                          <Feather
                            name={stat.icon}
                            size={24}
                            color={stat.iconColor}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Second Row - 2 stats */}
              <View className="flex-row gap-4">
                {stats.slice(2, 4).map((stat, index) => (
                  <View key={index + 2} className="flex-1">
                    <View
                      className={`${stat.color} border border-white/20 rounded-2xl p-6 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-3 opacity-80`}
                          >
                            {stat.title}
                          </Text>
                          <Text className="text-3xl font-bold text-slate-800">
                            {stat.value}
                          </Text>
                        </View>
                        <View
                          className={`p-3 rounded-xl ${stat.iconBg} ml-3 shadow-md border ${stat.borderColor}`}
                        >
                          <Feather
                            name={stat.icon}
                            size={24}
                            color={stat.iconColor}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Section Header */}
          <View>
            <Text className="text-2xl font-bold text-slate-800 mb-2">
              All Reminders
            </Text>
            <Text className="text-slate-600 text-lg">
              {reminders.length} reminder{reminders.length !== 1 ? "s" : ""}{" "}
              found
            </Text>
          </View>

          {/* Reminders List */}
          {reminders.length === 0 ? (
            <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-12 items-center">
              <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                <Feather name="bell" size={64} color="#9ca3af" />
              </View>
              <Text className="text-xl font-bold text-slate-700 mb-2">
                No reminders yet.
              </Text>
              <Text className="text-slate-500 text-lg text-center">
                Click "Set New Reminder" to add one!
              </Text>
            </View>
          ) : (
            <View className="gap-6">
              {reminders.map((r, index) => (
                <View
                  key={r.id}
                  className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6"
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-row items-start gap-3 flex-1">
                      <View
                        className={`w-3 h-3 rounded-full mt-2 ${
                          r.isActive ? "bg-emerald-400" : "bg-slate-300"
                        }`}
                      />
                      <Text className="text-xl font-bold text-slate-800 tracking-tight flex-1">
                        {r.name}
                      </Text>
                    </View>
                    <View
                      className={`flex-row items-center px-3 py-1.5 rounded-lg ${
                        r.isActive
                          ? "bg-emerald-50 border border-emerald-200"
                          : "bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <Feather
                        name="bell"
                        size={16}
                        color={r.isActive ? "#059669" : "#475569"}
                      />
                      <Text
                        className={`text-sm font-semibold ml-1 ${
                          r.isActive ? "text-emerald-700" : "text-slate-700"
                        }`}
                      >
                        {r.isActive ? "Active" : "Inactive"}
                      </Text>
                    </View>
                  </View>

                  <View className="my-4 h-px bg-slate-200" />

                  <View className="flex-row items-center gap-3 mb-6 p-4 bg-cyan-50 rounded-xl border border-cyan-100 shadow-sm">
                    <View className="w-10 h-10 bg-cyan-500 rounded-full items-center justify-center shadow-md">
                      <Feather name="clock" size={20} color="#ffffff" />
                    </View>
                    <View>
                      <Text className="text-cyan-700 font-bold text-xl">
                        {r.time}
                      </Text>
                      <Text className="text-cyan-600 text-sm font-medium">
                        Reminder Time
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleRemove(r.id)}
                      className="flex-1 px-4 py-2 bg-red-50 border border-red-200 rounded-xl"
                      activeOpacity={0.7}
                    >
                      <Text className="text-red-700 font-semibold text-center">
                        Remove
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleEdit(r)}
                      className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl"
                      activeOpacity={0.7}
                    >
                      <Feather name="edit-2" size={20} color="#334155" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleActive(r.id)}
                      className="px-4 py-2 bg-cyan-100 border border-cyan-200 rounded-xl"
                      activeOpacity={0.7}
                    >
                      <Feather
                        name={r.isActive ? "bell-off" : "bell"}
                        size={20}
                        color="#0891b2"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Reminder Modal */}
      <ReminderModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSave={handleSaveReminder}
        isEdit={false}
      />

      {/* Edit Reminder Modal */}
      <ReminderModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleEditReminder}
        isEdit={true}
      />
    </SafeAreaView>
  );
};

export default Reminders;
