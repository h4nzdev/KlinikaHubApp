"use client";

import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <View className="px-4 py-3 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center"
        >
          <Feather name="chevron-left" size={28} color="#0891b2" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="pb-6">
          {/* Notifications Settings */}
          <View className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <View className="flex-row items-center gap-4 mb-5">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="bell" size={24} color="#0891b2" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  Notification Settings
                </Text>
                <Text className="text-gray-500 text-sm">
                  Manage your reminder notifications
                </Text>
              </View>
            </View>

            <View className="gap-3">
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
                  value={notifications}
                  onToggle={() => setNotifications(!notifications)}
                  activeColor="bg-emerald-600"
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
                  value={soundEnabled}
                  onToggle={() => setSoundEnabled(!soundEnabled)}
                  activeColor="bg-emerald-600"
                />
              </View>
            </View>
          </View>

          {/* Account Settings */}
          <View className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <View className="flex-row items-center gap-4 mb-5">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="user" size={24} color="#0891b2" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  Account Settings
                </Text>
                <Text className="text-gray-500 text-sm">
                  Manage your personal information
                </Text>
              </View>
            </View>

            <View className="gap-3">
              <TouchableOpacity className="p-4 bg-gray-50 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-800">
                    Edit Profile
                  </Text>
                  <Feather name="chevron-right" size={20} color="#94a3b8" />
                </View>
                <Text className="text-gray-600 text-sm mt-1">
                  Update your personal information
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="p-4 bg-gray-50 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-800">
                    Change Password
                  </Text>
                  <Feather name="chevron-right" size={20} color="#94a3b8" />
                </View>
                <Text className="text-gray-600 text-sm mt-1">
                  Update your account password
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Settings */}
          <View className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <View className="flex-row items-center gap-4 mb-5">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="smartphone" size={24} color="#0891b2" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  App Preferences
                </Text>
                <Text className="text-gray-500 text-sm">
                  Customize your app experience
                </Text>
              </View>
            </View>

            <View className="gap-3">
              <TouchableOpacity className="p-4 bg-gray-50 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-800">
                    Reminder Settings
                  </Text>
                  <Feather name="chevron-right" size={20} color="#94a3b8" />
                </View>
                <Text className="text-gray-600 text-sm mt-1">
                  Configure default reminder options
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="p-4 bg-gray-50 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-800">
                    Data & Storage
                  </Text>
                  <Feather name="chevron-right" size={20} color="#94a3b8" />
                </View>
                <Text className="text-gray-600 text-sm mt-1">
                  Manage your data and storage preferences
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Privacy and Terms Section */}
          <View className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <View className="flex-row items-center gap-4 mb-5">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="shield" size={24} color="#0891b2" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  Privacy & Security
                </Text>
                <Text className="text-gray-500 text-sm">
                  Review our privacy policy and terms of service
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <View className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <View className="flex-row items-center gap-2 mb-2">
                  <Feather name="file-text" size={16} color="#64748b" />
                  <Text className="font-medium text-gray-800">
                    Privacy Policy
                  </Text>
                </View>
                <Text className="text-gray-600 text-sm mb-3">
                  Our privacy policy outlines how we collect, use, and protect
                  your personal health information. We are committed to
                  maintaining the confidentiality and security of your data.
                </Text>
                <TouchableOpacity>
                  <Text className="text-cyan-600 text-sm font-medium">
                    Read full policy →
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <View className="flex-row items-center gap-2 mb-2">
                  <Feather name="file-text" size={16} color="#64748b" />
                  <Text className="font-medium text-gray-800">
                    Terms of Service
                  </Text>
                </View>
                <Text className="text-gray-600 text-sm mb-3">
                  By using our health reminder service, you agree to these terms
                  which explain your rights and responsibilities as a user of
                  our platform.
                </Text>
                <TouchableOpacity>
                  <Text className="text-cyan-600 text-sm font-medium">
                    Read full terms →
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <View className="flex-row items-center gap-2 mb-2">
                  <Feather name="shield" size={16} color="#64748b" />
                  <Text className="font-medium text-gray-800">
                    Data Security
                  </Text>
                </View>
                <Text className="text-gray-600 text-sm mb-3">
                  Learn about how we protect your personal health data and what
                  security measures we have in place to keep your information
                  safe.
                </Text>
                <TouchableOpacity>
                  <Text className="text-cyan-600 text-sm font-medium">
                    Learn more →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Support Section */}
          <View className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <View className="flex-row items-center gap-4 mb-4">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="help-circle" size={24} color="#0891b2" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  Help & Support
                </Text>
                <Text className="text-gray-500 text-sm">
                  Get help and contact support
                </Text>
              </View>
            </View>

            <View className="gap-3">
              <TouchableOpacity className="p-4 bg-gray-50 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-800">FAQ</Text>
                  <Feather name="chevron-right" size={20} color="#94a3b8" />
                </View>
                <Text className="text-gray-600 text-sm mt-1">
                  Find answers to common questions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="p-4 bg-gray-50 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-800">
                    Contact Support
                  </Text>
                  <Feather name="chevron-right" size={20} color="#94a3b8" />
                </View>
                <Text className="text-gray-600 text-sm mt-1">
                  Get in touch with our support team
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="p-4 bg-gray-50 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-800">App Version</Text>
                  <Text className="text-gray-500 text-sm">v1.2.0</Text>
                </View>
                <Text className="text-gray-600 text-sm mt-1">
                  Current app version information
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
