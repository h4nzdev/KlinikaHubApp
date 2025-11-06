import React, { useState } from "react";
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
  const [storageSettings, setStorageSettings] = useState({
    autoBackup: true,
    cloudSync: false,
    saveToGallery: false,
    dataSaver: true,
    clearCacheOnExit: false,
  });

  const storageStats = {
    appSize: "145 MB",
    cacheSize: "23.5 MB",
    documents: "87.2 MB",
    backups: "34.1 MB",
    totalUsed: "289.8 MB",
    available: "15.2 GB",
  };

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

  const StorageItem = ({ label, value, size, color = "text-gray-700" }) => (
    <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
      <View className="flex-1">
        <Text className="font-medium text-gray-800">{label}</Text>
        <Text className="text-gray-600 text-sm">{value}</Text>
      </View>
      <Text className={`font-semibold ${color}`}>{size}</Text>
    </View>
  );

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear all cached data? This will free up storage space but may require re-downloading some data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Cache",
          style: "destructive",
          onPress: () => {
            Alert.alert("Success", "Cache cleared successfully");
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "This will export all your health data, reminders, and appointments to a secure file.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
          onPress: () => {
            Alert.alert(
              "Export Started",
              "Your data is being prepared for export..."
            );
          },
        },
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      "Delete All Data",
      "This will permanently delete all your data including reminders, appointments, and health records. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Data Deleted",
              "All your data has been permanently deleted"
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
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
              Data & Storage
            </Text>
            <Text className="text-gray-500 text-sm">
              Manage your data and storage preferences
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-6 pb-8">
          {/* Storage Overview */}
          <View className="bg-white rounded-2xl shadow-sm p-5">
            <SectionHeader
              icon="hard-drive"
              title="Storage Overview"
              description="Check your storage usage"
            />

            <View className="gap-3">
              <StorageItem
                label="App Size"
                value="Application and core files"
                size={storageStats.appSize}
                color="text-cyan-600"
              />

              <StorageItem
                label="Cache"
                value="Temporary files and images"
                size={storageStats.cacheSize}
                color="text-amber-600"
              />

              <StorageItem
                label="Documents"
                value="Health records and reports"
                size={storageStats.documents}
                color="text-emerald-600"
              />

              <StorageItem
                label="Backups"
                value="Auto-backup files"
                size={storageStats.backups}
                color="text-blue-600"
              />

              <View className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-semibold text-cyan-800">
                    Total Used
                  </Text>
                  <Text className="font-bold text-cyan-700">
                    {storageStats.totalUsed}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-cyan-600 text-sm">Available Space</Text>
                  <Text className="text-cyan-600 text-sm font-medium">
                    {storageStats.available}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Storage Settings */}
          <View className="bg-white rounded-2xl shadow-sm p-5">
            <SectionHeader
              icon="settings"
              title="Storage Settings"
              description="Configure how data is stored"
            />

            <View className="gap-4">
              <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">Auto Backup</Text>
                  <Text className="text-gray-600 text-sm">
                    Automatically backup your data daily
                  </Text>
                </View>
                <ToggleSwitch
                  value={storageSettings.autoBackup}
                  onToggle={() =>
                    setStorageSettings((prev) => ({
                      ...prev,
                      autoBackup: !prev.autoBackup,
                    }))
                  }
                />
              </View>

              <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">Cloud Sync</Text>
                  <Text className="text-gray-600 text-sm">
                    Sync data across your devices
                  </Text>
                </View>
                <ToggleSwitch
                  value={storageSettings.cloudSync}
                  onToggle={() =>
                    setStorageSettings((prev) => ({
                      ...prev,
                      cloudSync: !prev.cloudSync,
                    }))
                  }
                />
              </View>

              <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    Save to Gallery
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Save health reports to photo gallery
                  </Text>
                </View>
                <ToggleSwitch
                  value={storageSettings.saveToGallery}
                  onToggle={() =>
                    setStorageSettings((prev) => ({
                      ...prev,
                      saveToGallery: !prev.saveToGallery,
                    }))
                  }
                />
              </View>

              <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">Data Saver</Text>
                  <Text className="text-gray-600 text-sm">
                    Reduce data usage for images
                  </Text>
                </View>
                <ToggleSwitch
                  value={storageSettings.dataSaver}
                  onToggle={() =>
                    setStorageSettings((prev) => ({
                      ...prev,
                      dataSaver: !prev.dataSaver,
                    }))
                  }
                />
              </View>

              <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    Clear Cache on Exit
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Automatically clear cache when closing app
                  </Text>
                </View>
                <ToggleSwitch
                  value={storageSettings.clearCacheOnExit}
                  onToggle={() =>
                    setStorageSettings((prev) => ({
                      ...prev,
                      clearCacheOnExit: !prev.clearCacheOnExit,
                    }))
                  }
                />
              </View>
            </View>
          </View>

          {/* Data Management */}
          <View className="bg-white rounded-2xl shadow-sm p-5">
            <SectionHeader
              icon="database"
              title="Data Management"
              description="Manage your data and backups"
            />

            <View className="gap-3">
              <TouchableOpacity
                onPress={handleClearCache}
                className="p-4 bg-amber-50 rounded-xl border border-amber-200"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-amber-800">
                    Clear Cache
                  </Text>
                  <Feather name="trash-2" size={20} color="#d97706" />
                </View>
                <Text className="text-amber-600 text-sm mt-1">
                  Free up {storageStats.cacheSize} of temporary files
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleExportData}
                className="p-4 bg-blue-50 rounded-xl border border-blue-200"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-blue-800">Export Data</Text>
                  <Feather name="download" size={20} color="#2563eb" />
                </View>
                <Text className="text-blue-600 text-sm mt-1">
                  Download all your health data as backup
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="p-4 bg-green-50 rounded-xl border border-green-200">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-green-800">
                    Create Backup
                  </Text>
                  <Feather name="save" size={20} color="#059669" />
                </View>
                <Text className="text-green-600 text-sm mt-1">
                  Create a manual backup of your data
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Data Privacy */}
          <View className="bg-white rounded-2xl shadow-sm p-5">
            <SectionHeader
              icon="shield"
              title="Data Privacy"
              description="Control your data privacy"
            />

            <View className="gap-3">
              <TouchableOpacity className="p-4 bg-gray-50 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-800">
                    Download Personal Data
                  </Text>
                  <Feather name="arrow-right" size={20} color="#94a3b8" />
                </View>
                <Text className="text-gray-600 text-sm mt-1">
                  Get a copy of all data we have about you
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteAllData}
                className="p-4 bg-red-50 rounded-xl border border-red-200"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-red-800">
                    Delete All Data
                  </Text>
                  <Feather name="trash-2" size={20} color="#dc2626" />
                </View>
                <Text className="text-red-600 text-sm mt-1">
                  Permanently delete all your data from our servers
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataStorageSettings;
