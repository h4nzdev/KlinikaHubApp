// screens/Reminders.js (add these imports and functions)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header"; 
import { useReminder } from "../../../context/ReminderContext"; 
import AddReminderModal from "./components/AddReminderModal";
import ReminderDropdown from "./components/ReminderDropdown";

const Reminders = () => {
  const {
    reminders,
    saveReminders,
    deleteReminder,
    toggleReminder,
    isNotificationModalOpen,
    dueReminder,
  } = useReminder();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState(null);

  const handleSaveReminder = async (reminderData) => {
    try {
      let updatedReminders;

      if (reminderToEdit) {
        // Edit existing reminder
        updatedReminders = reminders.map((r) =>
          r.id === reminderToEdit.id
            ? {
                ...r,
                ...reminderData,
                lastAcknowledgedDate: null, // Reset acknowledgment when edited
              }
            : r
        );
      } else {
        // Add new reminder
        const newReminder = {
          id: Date.now().toString(),
          ...reminderData,
          createdAt: new Date().toISOString(),
          notifiedCount: 0,
          lastAcknowledgedDate: null,
        };
        updatedReminders = [...reminders, newReminder];
      }

      await saveReminders(updatedReminders);
      setReminderToEdit(null);

      Alert.alert(
        "Success",
        `Reminder ${reminderToEdit ? "updated" : "added"} successfully!`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save reminder");
    }
  };

  const handleRemove = async (id) => {
    Alert.alert(
      "Remove Reminder",
      "Are you sure you want to remove this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await deleteReminder(id);
            Alert.alert("Success", "Reminder removed!");
          },
        },
      ]
    );
  };

  const handleEdit = (reminder) => {
    setReminderToEdit(reminder);
    setIsModalOpen(true);
  };

  const handleToggle = async (reminder) => {
    await toggleReminder(reminder.id);
  };

  const openModal = () => {
    setReminderToEdit(null);
    setIsModalOpen(true);
  };

  // Enhanced stats with notification counts
  const stats = [
    {
      title: "Total Reminders",
      value: reminders.length,
      icon: "bell",
      color: "bg-slate-50",
      textColor: "text-slate-600",
      borderColor: "border-slate-200",
    },
    {
      title: "Active",
      value: reminders.filter((r) => r.isActive).length,
      icon: "check-circle",
      color: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
    {
      title: "Notifications",
      value: reminders.reduce((total, r) => total + (r.notifiedCount || 0), 0),
      icon: "activity",
      color: "bg-cyan-50",
      textColor: "text-cyan-600",
      borderColor: "border-cyan-200",
    },
    {
      title: "Due Today",
      value: reminders.filter((r) => {
        const today = new Date().toISOString().split("T")[0];
        return r.isActive && r.lastAcknowledgedDate !== today;
      }).length,
      icon: "clock",
      color: "bg-orange-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
  ];

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
          <View className="gap-6">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-slate-800">
                My Reminders
              </Text>
              <Text className="text-slate-600 mt-3 text-lg">
                Manage your personal health reminders with alerts.
              </Text>
            </View>
            <TouchableOpacity
              onPress={openModal}
              className="flex-row items-center justify-center px-8 py-4 bg-cyan-500 rounded-2xl shadow-lg"
              activeOpacity={0.8}
            >
              <Feather name="plus" size={20} color="#ffffff" />
              <Text className="text-white font-semibold ml-3 text-lg">
                Set New Reminder
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View>
            <View className="gap-4">
              <View className="flex-row gap-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <View key={index} className="flex-1">
                    <View
                      className={`${stat.color} border ${stat.borderColor} rounded-2xl p-6 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
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
                          className={`p-3 rounded-xl ${stat.color} ml-3 shadow-md border ${stat.borderColor}`}
                        >
                          <Feather
                            name={stat.icon}
                            size={24}
                            color={stat.textColor
                              .replace("text-", "#")
                              .replace("-600", "")}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              <View className="flex-row gap-4">
                {stats.slice(2, 4).map((stat, index) => (
                  <View key={index + 2} className="flex-1">
                    <View
                      className={`${stat.color} border ${stat.borderColor} rounded-2xl p-6 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
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
                          className={`p-3 rounded-xl ${stat.color} ml-3 shadow-md border ${stat.borderColor}`}
                        >
                          <Feather
                            name={stat.icon}
                            size={24}
                            color={stat.textColor
                              .replace("text-", "#")
                              .replace("-600", "")}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Enhanced Reminder Cards */}
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
              {reminders.map((reminder, index) => (
                <View
                  key={reminder.id}
                  className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6"
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-row items-start gap-3 flex-1">
                      <View
                        className={`w-3 h-3 rounded-full mt-2 ${reminder.isActive ? "bg-emerald-400" : "bg-slate-300"}`}
                      />
                      <View className="flex-1">
                        <Text className="text-xl font-bold text-slate-800 tracking-tight">
                          {reminder.name}
                        </Text>
                        {reminder.notifiedCount > 0 && (
                          <Text className="text-sm text-cyan-600 mt-1">
                            Notified {reminder.notifiedCount} time
                            {reminder.notifiedCount !== 1 ? "s" : ""}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View
                      className={`flex-row items-center px-3 py-1.5 rounded-lg ${reminder.isActive ? "bg-emerald-50 border border-emerald-200" : "bg-slate-100 border border-slate-200"}`}
                    >
                      <Feather
                        name="bell"
                        size={16}
                        color={reminder.isActive ? "#059669" : "#475569"}
                      />
                      <Text
                        className={`text-sm font-semibold ml-1 ${reminder.isActive ? "text-emerald-700" : "text-slate-700"}`}
                      >
                        {reminder.isActive ? "Active" : "Inactive"}
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
                        {reminder.time}
                      </Text>
                      <Text className="text-cyan-600 text-sm font-medium">
                        Reminder Time
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleRemove(reminder.id)}
                      className="flex-1 px-4 py-2 bg-red-50 border border-red-200 rounded-xl"
                      activeOpacity={0.7}
                    >
                      <Text className="text-red-700 font-semibold text-center">
                        Remove
                      </Text>
                    </TouchableOpacity>
                    <ReminderDropdown
                      onEdit={() => handleEdit(reminder)}
                      reminder={reminder}
                      onToggle={() => handleToggle(reminder)}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Reminder Modal */}
      <AddReminderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setReminderToEdit(null);
        }}
        onSave={handleSaveReminder}
        reminderToEdit={reminderToEdit}
      />
    </SafeAreaView>
  );
};

export default Reminders;
