// screens/Reminders.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";
import { useReminder } from "../../../context/ReminderContext";
import AddReminderModal from "./components/AddReminderModal";

const Reminders = () => {
  const { reminders, saveReminders, deleteReminder, toggleReminder } =
    useReminder();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleSaveReminder = async (reminderData) => {
    try {
      let updatedReminders;

      if (reminderToEdit) {
        updatedReminders = reminders.map((r) =>
          r.id === reminderToEdit.id
            ? {
                ...r,
                ...reminderData,
                lastAcknowledgedDate: null,
              }
            : r
        );
      } else {
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
      setIsModalOpen(false);

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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Stats data
  const stats = [
    {
      title: "Total Reminders",
      value: reminders.length,
      icon: "bell",
      color: "bg-cyan-500",
    },
    {
      title: "Active",
      value: reminders.filter((r) => r.isActive).length,
      icon: "check-circle",
      color: "bg-emerald-500",
    },
    {
      title: "Notifications",
      value: reminders.reduce((total, r) => total + (r.notifiedCount || 0), 0),
      icon: "activity",
      color: "bg-blue-500",
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 gap-8">
          {/* Welcome Section */}
          <View>
            <View className="flex-row items-center gap-3">
              <View className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
                <Feather name="bell" size={24} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-semibold text-slate-800">
                  My Reminders
                </Text>
                <Text className="text-slate-600 mt-1">
                  Never miss your medications and appointments
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsModalOpen(true)}
                className="w-12 h-12 bg-cyan-500 rounded-full items-center justify-center shadow-lg"
                activeOpacity={0.8}
              >
                <Feather name="plus" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Cards */}
          <View>
            <View className="gap-4">
              {/* Total Reminders Card */}
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Total Reminders
                    </Text>
                    <Text className="text-4xl font-semibold text-cyan-600 mt-2">
                      {reminders.length}
                    </Text>
                    <Text className="text-sm text-slate-500 mt-2 font-medium">
                      {reminders.filter((r) => r.isActive).length} active
                      reminders
                    </Text>
                  </View>
                  <View className="bg-cyan-500 p-4 rounded-2xl shadow-md">
                    <Feather name="bell" size={32} color="#ffffff" />
                  </View>
                </View>
              </View>

              {/* Active Reminders Card */}
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">
                      Reminder Stats
                    </Text>
                    <View className="flex-row justify-between mb-3">
                      <View>
                        <Text className="text-2xl font-semibold text-slate-800">
                          {reminders.filter((r) => r.isActive).length}
                        </Text>
                        <Text className="text-slate-600 text-xs">Active</Text>
                      </View>
                      <View>
                        <Text className="text-2xl font-semibold text-slate-800">
                          {reminders.filter((r) => !r.isActive).length}
                        </Text>
                        <Text className="text-slate-600 text-xs">Inactive</Text>
                      </View>
                      <View>
                        <Text className="text-2xl font-semibold text-slate-800">
                          {reminders.reduce(
                            (total, r) => total + (r.notifiedCount || 0),
                            0
                          )}
                        </Text>
                        <Text className="text-slate-600 text-xs">
                          Notifications
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="bg-emerald-500 p-4 rounded-2xl shadow-md">
                    <Feather name="activity" size={32} color="#ffffff" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-2xl font-semibold text-slate-800 mb-6">
              Quick Actions
            </Text>

            <View className="flex-row">
              {/* Add Reminder */}
              <TouchableOpacity
                onPress={() => setIsModalOpen(true)}
                className="flex-1 flex-col items-start justify-center gap-2 p-4 bg-cyan-50 rounded-xl border border-cyan-200 mr-2"
                activeOpacity={0.7}
              >
                <View className="bg-cyan-500 p-3 rounded-xl shadow-md">
                  <Feather name="plus" size={24} color="#ffffff" />
                </View>
                <Text className="font-semibold text-slate-800 text-start">
                  Add Reminder
                </Text>
                <Text className="text-slate-600 text-start text-sm">
                  Set new medication reminder
                </Text>
              </TouchableOpacity>

              {/* View All */}
              <TouchableOpacity
                onPress={() => {}}
                className="flex-1 flex-col items-start justify-center gap-2 p-4 bg-blue-50 rounded-xl border border-blue-200 ml-2"
                activeOpacity={0.7}
              >
                <View className="bg-blue-500 p-3 rounded-xl shadow-md">
                  <Feather name="list" size={24} color="#ffffff" />
                </View>
                <Text className="font-semibold text-slate-800 text-start">
                  Manage All
                </Text>
                <Text className="text-slate-600 text-start text-sm">
                  View and edit reminders
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reminders List */}
          <View>
            <Text className="text-2xl font-semibold text-slate-800 mb-6">
              My Reminders
            </Text>

            {reminders.length === 0 ? (
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 items-center">
                <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                  <Feather name="bell" size={64} color="#9ca3af" />
                </View>
                <Text className="text-xl font-bold text-slate-700 mb-2">
                  No reminders yet
                </Text>
                <Text className="text-slate-500 text-center mb-6">
                  Set your first reminder to get started
                </Text>
                <TouchableOpacity
                  onPress={() => setIsModalOpen(true)}
                  className="flex-row items-center px-6 py-3 bg-cyan-500 rounded-xl"
                >
                  <Feather name="plus" size={18} color="#ffffff" />
                  <Text className="text-white font-semibold ml-2">
                    Add Reminder
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="gap-4">
                {reminders.map((reminder) => (
                  <View
                    key={reminder.id}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
                  >
                    {/* Header with status */}
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-1 mr-2">
                        <Text className="font-bold text-slate-800 text-lg mb-2">
                          {reminder.name}
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                          <View className="bg-slate-200 px-3 py-1 rounded-full">
                            <Text className="text-slate-600 text-xs font-medium">
                              Medication
                            </Text>
                          </View>
                          <View
                            className={`px-3 py-1 rounded-full ${
                              reminder.isActive
                                ? "bg-emerald-100 border border-emerald-200"
                                : "bg-slate-100 border border-slate-200"
                            }`}
                          >
                            <Text
                              className={`text-xs font-medium ${
                                reminder.isActive
                                  ? "text-emerald-700"
                                  : "text-slate-700"
                              }`}
                            >
                              {reminder.isActive ? "ACTIVE" : "INACTIVE"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* Time */}
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-row items-center flex-1">
                        <Feather name="clock" size={16} color="#64748b" />
                        <Text className="text-slate-600 ml-2 font-medium">
                          {reminder.time}
                        </Text>
                      </View>

                      {reminder.notifiedCount > 0 && (
                        <View className="flex-row items-center">
                          <Feather name="bell" size={16} color="#64748b" />
                          <Text className="text-slate-600 ml-2 font-medium">
                            Notified {reminder.notifiedCount} time
                            {reminder.notifiedCount !== 1 ? "s" : ""}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Quick Actions */}
                    <View className="flex-row justify-between items-center pt-4 border-t border-slate-100">
                      <TouchableOpacity
                        className="flex-row items-center"
                        activeOpacity={0.7}
                        onPress={() => handleEdit(reminder)}
                      >
                        <Feather name="edit-2" size={16} color="#3b82f6" />
                        <Text className="text-blue-600 font-medium ml-2">
                          Edit
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="flex-row items-center"
                        activeOpacity={0.7}
                        onPress={() => handleToggle(reminder)}
                      >
                        <Feather
                          name={reminder.isActive ? "bell-off" : "bell"}
                          size={16}
                          color="#3b82f6"
                        />
                        <Text className="text-blue-600 font-medium ml-2">
                          {reminder.isActive ? "Deactivate" : "Activate"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="flex-row items-center"
                        activeOpacity={0.7}
                        onPress={() => handleRemove(reminder.id)}
                      >
                        <Feather name="trash-2" size={16} color="#ef4444" />
                        <Text className="text-red-600 font-medium ml-2">
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
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
