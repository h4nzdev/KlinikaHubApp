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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DataStorageSettings = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const handleComingSoon = () => {
    Alert.alert(
      "Coming Soon",
      "Data storage features will be available in a future update.",
      [{ text: "OK" }]
    );
  };

  const ToggleSwitch = ({ value }) => (
    <View className={`relative h-6 w-11 rounded-full bg-gray-300 opacity-50`}>
      <View
        className={`h-4 w-4 transform rounded-full bg-white ${value ? "translate-x-2.5" : "-translate-x-2.5"}`}
      />
    </View>
  );

  const SectionHeader = ({ icon, title, description }) => (
    <View className="flex-row items-center gap-4 mb-5">
      <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
        <Feather name={icon} size={24} color="#9ca3af" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-400">{title}</Text>
        <Text className="text-gray-400 text-sm">{description}</Text>
      </View>
    </View>
  );

  const StorageItem = ({ label, value, size }) => (
    <View className="flex-row items-center justify-between p-4 bg-gray-100 rounded-xl opacity-50">
      <View className="flex-1">
        <Text className="font-medium text-gray-400">{label}</Text>
        <Text className="text-gray-400 text-sm">{value}</Text>
      </View>
      <Text className="font-semibold text-gray-400">{size}</Text>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Feather name="chevron-left" size={28} color="#0891b2" />
          </TouchableOpacity>
          <View className="flex-1 ml-3">
            <Text className="text-xl font-bold text-gray-800">
              Data & Storage
            </Text>
            <Text className="text-gray-500 text-sm">
              Manage your data and storage preferences
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 gap-6 pb-8">
          {/* Coming Soon Banner */}
          <View className="bg-gray-100 rounded-2xl p-5 border border-gray-200">
            <View className="flex-row items-center gap-3">
              <Feather name="clock" size={20} color="#6b7280" />
              <Text className="font-semibold text-gray-700">Coming Soon</Text>
            </View>
            <Text className="text-gray-600 text-sm mt-2">
              Data storage features will be available in a future update.
            </Text>
          </View>

          {/* Storage Overview */}
          <TouchableOpacity onPress={handleComingSoon}>
            <View className="bg-white rounded-2xl p-6 opacity-50">
              <SectionHeader
                icon="hard-drive"
                title="Storage Overview"
                description="Check your storage usage"
              />

              <View className="gap-3">
                <StorageItem
                  label="App Size"
                  value="Application and core files"
                  size="145 MB"
                />

                <StorageItem
                  label="Cache"
                  value="Temporary files and images"
                  size="23.5 MB"
                />

                <StorageItem
                  label="Documents"
                  value="Health records and reports"
                  size="87.2 MB"
                />

                <StorageItem
                  label="Backups"
                  value="Auto-backup files"
                  size="34.1 MB"
                />

                <View className="p-4 bg-gray-100 rounded-xl">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-semibold text-gray-400">
                      Total Used
                    </Text>
                    <Text className="font-bold text-gray-400">289.8 MB</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-400 text-sm">
                      Available Space
                    </Text>
                    <Text className="text-gray-400 text-sm font-medium">
                      15.2 GB
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Storage Settings */}
          <TouchableOpacity onPress={handleComingSoon}>
            <View className="bg-white rounded-2xl p-6 opacity-50">
              <SectionHeader
                icon="settings"
                title="Storage Settings"
                description="Configure how data is stored"
              />

              <View className="gap-4">
                <View className="flex-row items-center justify-between p-4 bg-gray-100 rounded-xl">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-400">
                      Auto Backup
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Automatically backup your data daily
                    </Text>
                  </View>
                  <ToggleSwitch value={true} />
                </View>

                <View className="flex-row items-center justify-between p-4 bg-gray-100 rounded-xl">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-400">
                      Cloud Sync
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Sync data across your devices
                    </Text>
                  </View>
                  <ToggleSwitch value={false} />
                </View>

                <View className="flex-row items-center justify-between p-4 bg-gray-100 rounded-xl">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-400">
                      Save to Gallery
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Save health reports to photo gallery
                    </Text>
                  </View>
                  <ToggleSwitch value={false} />
                </View>

                <View className="flex-row items-center justify-between p-4 bg-gray-100 rounded-xl">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-400">
                      Data Saver
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Reduce data usage for images
                    </Text>
                  </View>
                  <ToggleSwitch value={true} />
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Data Management */}
          <TouchableOpacity onPress={handleComingSoon}>
            <View className="bg-white rounded-2xl p-6 opacity-50">
              <SectionHeader
                icon="database"
                title="Data Management"
                description="Manage your data and backups"
              />

              <View className="gap-3">
                <View className="p-4 bg-gray-100 rounded-xl">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium text-gray-400">
                      Clear Cache
                    </Text>
                    <Feather name="trash-2" size={20} color="#9ca3af" />
                  </View>
                  <Text className="text-gray-400 text-sm mt-1">
                    Free up 23.5 MB of temporary files
                  </Text>
                </View>

                <View className="p-4 bg-gray-100 rounded-xl">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium text-gray-400">
                      Export Data
                    </Text>
                    <Feather name="download" size={20} color="#9ca3af" />
                  </View>
                  <Text className="text-gray-400 text-sm mt-1">
                    Download all your health data as backup
                  </Text>
                </View>

                <View className="p-4 bg-gray-100 rounded-xl">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium text-gray-400">
                      Create Backup
                    </Text>
                    <Feather name="save" size={20} color="#9ca3af" />
                  </View>
                  <Text className="text-gray-400 text-sm mt-1">
                    Create a manual backup of your data
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Data Privacy */}
          <TouchableOpacity onPress={handleComingSoon}>
            <View className="bg-white rounded-2xl p-6 opacity-50">
              <SectionHeader
                icon="shield"
                title="Data Privacy"
                description="Control your data privacy"
              />

              <View className="gap-3">
                <View className="p-4 bg-gray-100 rounded-xl">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium text-gray-400">
                      Download Personal Data
                    </Text>
                    <Feather name="arrow-right" size={20} color="#9ca3af" />
                  </View>
                  <Text className="text-gray-400 text-sm mt-1">
                    Get a copy of all data we have about you
                  </Text>
                </View>

                <View className="p-4 bg-gray-100 rounded-xl">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium text-gray-400">
                      Delete All Data
                    </Text>
                    <Feather name="trash-2" size={20} color="#9ca3af" />
                  </View>
                  <Text className="text-gray-400 text-sm mt-1">
                    Permanently delete all your data from our servers
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataStorageSettings;
