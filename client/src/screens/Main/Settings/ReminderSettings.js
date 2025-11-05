import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useReminder } from "../../../context/ReminderContext";

const ReminderSettings = ({ navigation }) => {
  const {
    reminders,
    settings,
    updateSetting,
    resetSettings,
    deleteAllReminders,
  } = useReminder();

  const ToggleSwitch = ({ value, onToggle, activeColor = "bg-cyan-600" }) => (
    <TouchableOpacity
      onPress={onToggle}
      className={`relative inline-flex h-6 w-11 items-center justify-center rounded-full ${value ? activeColor : "bg-gray-300"}`}
    >
      <View
        className={`h-4 w-4 transform rounded-full bg-white ${value ? "translate-x-2.5" : "-translate-x-2.5"}`}
      />
    </TouchableOpacity>
  );

  const SectionHeader = ({ icon, title, description }) => (
    <View className="flex-row items-center gap-4 mb-5">
      <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
        <Feather name={icon} size={24} color="#0891b2" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        <Text className="text-gray-500 text-sm">{description}</Text>
      </View>
    </View>
  );

  const handleResetToDefaults = () => {
    Alert.alert(
      "Reset to Defaults",
      "Are you sure you want to reset all reminder settings to default values?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetSettings();
            Alert.alert("Success", "Settings reset to defaults");
          },
        },
      ]
    );
  };

  const handleClearAllReminders = () => {
    Alert.alert(
      "Clear All Reminders",
      `Are you sure you want to delete all ${reminders.length} reminders? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAllReminders();
              Alert.alert("Success", "All reminders have been deleted");
            } catch (error) {
              Alert.alert("Error", "Failed to delete reminders");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Feather name="chevron-left" size={28} color="#0891b2" />
          </TouchableOpacity>
          <View className="flex-1 ml-3">
            <Text className="text-xl font-bold text-gray-800">
              Reminder Settings
            </Text>
            <Text className="text-gray-500 text-sm">
              Manage your reminder preferences
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-6 pb-8">
          {/* Notification Settings */}
          <View className="bg-white rounded-2xl shadow-sm p-5">
            <SectionHeader
              icon="bell"
              title="Notification Settings"
              description="Manage how you receive reminders"
            />

            <View className="gap-4">
              <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    Push Notifications
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Receive reminder notifications
                  </Text>
                </View>
                <ToggleSwitch
                  value={settings.pushNotifications}
                  onToggle={() =>
                    updateSetting(
                      "pushNotifications",
                      !settings.pushNotifications
                    )
                  }
                />
              </View>

              <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    Sound Alerts
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Play sound when reminders are due
                  </Text>
                </View>
                <ToggleSwitch
                  value={settings.soundEnabled}
                  onToggle={() =>
                    updateSetting("soundEnabled", !settings.soundEnabled)
                  }
                />
              </View>

              <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">Vibration</Text>
                  <Text className="text-gray-600 text-sm">
                    Vibrate when reminders are due
                  </Text>
                </View>
                <ToggleSwitch
                  value={settings.vibrationEnabled}
                  onToggle={() =>
                    updateSetting(
                      "vibrationEnabled",
                      !settings.vibrationEnabled
                    )
                  }
                />
              </View>
            </View>
          </View>

          {/* Reminders Summary */}
          <View className="bg-white rounded-2xl shadow-sm p-5">
            <SectionHeader
              icon="list"
              title="Your Reminders"
              description="Manage your existing reminders"
            />

            <View className="gap-4">
              <View className="p-4 bg-gray-50 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-800">
                    Active Reminders
                  </Text>
                  <Text className="text-cyan-600 font-semibold">
                    {reminders.filter((r) => r.isActive).length}
                  </Text>
                </View>
                <Text className="text-gray-600 text-sm mt-1">
                  Currently active reminders
                </Text>
              </View>

              <View className="p-4 bg-gray-50 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-800">
                    Total Reminders
                  </Text>
                  <Text className="text-gray-600 font-semibold">
                    {reminders.length}
                  </Text>
                </View>
                <Text className="text-gray-600 text-sm mt-1">
                  All reminders in your list
                </Text>
              </View>
            </View>
          </View>

          {/* Reset Section */}
          <View className="bg-white rounded-2xl shadow-sm p-5">
            <SectionHeader
              icon="refresh-cw"
              title="Reset & Management"
              description="Manage your reminder data"
            />

            <View className="gap-3">
              <TouchableOpacity
                onPress={handleResetToDefaults}
                className="p-4 bg-amber-50 rounded-xl border border-amber-200"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-amber-800">
                    Reset to Defaults
                  </Text>
                  <Feather name="refresh-cw" size={20} color="#d97706" />
                </View>
                <Text className="text-amber-600 text-sm mt-1">
                  Restore all settings to default values
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClearAllReminders}
                className="p-4 bg-red-50 rounded-xl border border-red-200"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-red-800">
                    Clear All Reminders
                  </Text>
                  <Feather name="trash-2" size={20} color="#dc2626" />
                </View>
                <Text className="text-red-600 text-sm mt-1">
                  Delete all your reminder data ({reminders.length} reminders)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReminderSettings;
