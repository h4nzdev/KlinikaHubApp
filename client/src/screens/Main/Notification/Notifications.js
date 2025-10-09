import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";

// Mock notifications data
const mockNotifications = [
  {
    _id: "1",
    message: "Your appointment with Dr. Sarah Johnson is confirmed",
    type: "appointment",
    isRead: false,
    createdAt: "2024-01-15T10:00:00",
  },
  {
    _id: "2",
    message: "Payment received for Invoice #INV-2024-001",
    type: "payment",
    isRead: false,
    createdAt: "2024-01-14T14:30:00",
  },
  {
    _id: "3",
    message: "System maintenance scheduled for tonight",
    type: "system",
    isRead: true,
    createdAt: "2024-01-13T09:00:00",
  },
  {
    _id: "4",
    message: "Appointment reminder: Tomorrow at 10:00 AM",
    type: "appointment",
    isRead: true,
    createdAt: "2024-01-12T18:00:00",
  },
];

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif._id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((notification) => {
        if (filterType === "all") return true;
        if (filterType === "unread") return !notification.isRead;
        return notification.type === filterType;
      })
      .filter((notification) => {
        const searchTermLower = searchTerm.toLowerCase();
        const message = notification.message?.toLowerCase() || "";
        return message.includes(searchTermLower);
      });
  }, [notifications, filterType, searchTerm]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      appointment: "calendar",
      payment: "file-text",
      system: "info",
    };
    return iconMap[type] || "bell";
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      appointment: { bg: "bg-cyan-100", text: "#0891b2" },
      payment: { bg: "bg-emerald-100", text: "#059669" },
      system: { bg: "bg-slate-100", text: "#475569" },
    };
    return colorMap[type] || { bg: "bg-slate-100", text: "#475569" };
  };

  const filterOptions = [
    { label: "All Notifications", value: "all", icon: "bell" },
    { label: "Unread Only", value: "unread", icon: "alert-circle" },
    { label: "Appointments", value: "appointment", icon: "calendar" },
    { label: "Payments", value: "payment", icon: "file-text" },
    { label: "System", value: "system", icon: "info" },
  ];

  const currentFilter = filterOptions.find((opt) => opt.value === filterType);

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
            <Text className="text-3xl font-bold text-slate-800">
              Notifications
            </Text>
            <Text className="text-slate-600 mt-3 text-lg">
              Stay updated with your appointments, payments, and alerts.
            </Text>
          </View>

          {/* Filter Dropdown */}
          <View>
            <TouchableOpacity
              onPress={() => setIsFilterModalVisible(true)}
              className="flex-row items-center justify-between px-4 h-12 rounded-xl border border-slate-200 bg-white/80 shadow-sm"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3">
                <Feather name="filter" size={20} color="#94a3b8" />
                <Text className="font-medium text-slate-700">
                  {currentFilter?.label}
                </Text>
              </View>
              <Feather name="chevron-down" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Section Header */}
          <View>
            <Text className="text-2xl font-bold text-slate-800 mb-2">
              Recent Notifications
            </Text>
            <Text className="text-slate-600 text-lg">
              {filteredNotifications.length} notification
              {filteredNotifications.length !== 1 ? "s" : ""} found
            </Text>
          </View>

          {/* Search Bar */}
          <View>
            <View className="relative">
              <Feather
                name="search"
                size={20}
                color="#94a3b8"
                style={{ position: "absolute", left: 12, top: 14, zIndex: 1 }}
              />
              <TextInput
                placeholder="Search notifications..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="pl-10 h-12 rounded-xl border border-slate-200 bg-white/80"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <View className="gap-4">
              {filteredNotifications.map((notification) => {
                const color = getNotificationColor(notification.type);
                return (
                  <View
                    key={notification._id}
                    className={`bg-white/80 rounded-2xl shadow-lg border ${
                      !notification.isRead
                        ? "border-l-4 border-l-cyan-500"
                        : "border-white/20"
                    } p-6`}
                  >
                    <View className="flex-row gap-4">
                      <View className={`p-3 rounded-xl ${color.bg} shadow-sm`}>
                        <Feather
                          name={getNotificationIcon(notification.type)}
                          size={20}
                          color={color.text}
                        />
                      </View>

                      <View className="flex-1">
                        <View className="flex-row items-start justify-between mb-2">
                          <Text className="font-bold text-slate-800 text-base flex-1 pr-2">
                            {notification.message}
                          </Text>
                          {!notification.isRead && (
                            <View className="w-2 h-2 bg-cyan-500 rounded-full mt-2" />
                          )}
                        </View>

                        <Text className="text-sm text-slate-500 font-medium mb-3">
                          {formatDate(notification.createdAt)},{" "}
                          {formatTime(notification.createdAt)}
                        </Text>

                        {!notification.isRead && (
                          <TouchableOpacity
                            onPress={() => markAsRead(notification._id)}
                            className="px-4 py-2 bg-cyan-50 rounded-lg self-start"
                            activeOpacity={0.7}
                          >
                            <Text className="text-cyan-700 text-sm font-medium">
                              Mark as Read
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-12 items-center">
              <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                <Feather name="bell" size={64} color="#9ca3af" />
              </View>
              <Text className="text-xl font-bold text-slate-700 mb-2">
                No notifications found
              </Text>
              <Text className="text-slate-500 text-lg text-center">
                You're all caught up! New notifications will appear here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-2">
                <Feather name="filter" size={20} color="#475569" />
                <Text className="text-xl font-bold text-slate-800">
                  Filters
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsFilterModalVisible(false)}
                activeOpacity={0.7}
              >
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setFilterType(option.value);
                    setIsFilterModalVisible(false);
                  }}
                  className={`flex-row items-center gap-3 p-4 rounded-xl ${
                    filterType === option.value ? "bg-cyan-600" : "bg-slate-50"
                  }`}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={option.icon}
                    size={20}
                    color={filterType === option.value ? "#ffffff" : "#475569"}
                  />
                  <Text
                    className={`font-medium flex-1 ${
                      filterType === option.value
                        ? "text-white"
                        : "text-slate-600"
                    }`}
                  >
                    {option.label}
                  </Text>
                  {filterType === option.value && (
                    <Feather name="check-circle" size={16} color="#ffffff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Notifications;
