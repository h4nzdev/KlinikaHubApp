import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Enhanced mock notifications data
const mockNotifications = [
  {
    _id: "1",
    message:
      "Your appointment with Dr. Sarah Johnson is confirmed for tomorrow at 2:00 PM",
    type: "appointment",
    isRead: false,
    createdAt: "2024-01-15T10:00:00",
    priority: "high",
    action: "view_appointment",
  },
  {
    _id: "2",
    message: "Payment of ₱1,500.00 received for Invoice #INV-2024-001",
    type: "payment",
    isRead: false,
    createdAt: "2024-01-14T14:30:00",
    priority: "medium",
    action: "view_receipt",
  },
  {
    _id: "3",
    message: "System maintenance scheduled tonight from 2:00 AM to 4:00 AM",
    type: "system",
    isRead: true,
    createdAt: "2024-01-13T09:00:00",
    priority: "low",
    action: "dismiss",
  },
  {
    _id: "4",
    message: "Appointment reminder: Cardiology checkup tomorrow at 10:00 AM",
    type: "appointment",
    isRead: true,
    createdAt: "2024-01-12T18:00:00",
    priority: "high",
    action: "set_reminder",
  },
  {
    _id: "5",
    message: "New lab results are available for your recent blood test",
    type: "medical",
    isRead: false,
    createdAt: "2024-01-12T11:20:00",
    priority: "high",
    action: "view_results",
  },
  {
    _id: "6",
    message: "Prescription refill reminder: Medication running low",
    type: "prescription",
    isRead: false,
    createdAt: "2024-01-11T16:45:00",
    priority: "medium",
    action: "refill_prescription",
  },
];

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation for notification cards
  const animateNotificationIn = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    animateNotificationIn();
  }, []);

  // Format date with relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
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

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationAction = (notification) => {
    setSelectedNotification(notification);
    setIsActionModalVisible(true);
  };

  const executeAction = (action) => {
    switch (action) {
      case "view_appointment":
        navigation.navigate("Appointments");
        break;
      case "view_receipt":
        // Navigate to receipts screen
        break;
      case "view_results":
        // Navigate to lab results
        break;
      case "refill_prescription":
        // Navigate to prescriptions
        break;
      case "set_reminder":
        // Set reminder logic
        break;
    }
    setIsActionModalVisible(false);
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
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications, filterType, searchTerm]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      appointment: "calendar",
      payment: "credit-card",
      system: "settings",
      medical: "activity",
      prescription: "package",
    };
    return iconMap[type] || "bell";
  };

  const getNotificationColor = (type, priority) => {
    const colorMap = {
      appointment: {
        bg: priority === "high" ? "bg-cyan-500" : "bg-cyan-100",
        text: priority === "high" ? "#ffffff" : "#0891b2",
        accent: "#0891b2",
      },
      payment: {
        bg: priority === "high" ? "bg-emerald-500" : "bg-emerald-100",
        text: priority === "high" ? "#ffffff" : "#059669",
        accent: "#059669",
      },
      system: {
        bg: priority === "high" ? "bg-slate-500" : "bg-slate-100",
        text: priority === "high" ? "#ffffff" : "#475569",
        accent: "#475569",
      },
      medical: {
        bg: priority === "high" ? "bg-red-500" : "bg-red-100",
        text: priority === "high" ? "#ffffff" : "#dc2626",
        accent: "#dc2626",
      },
      prescription: {
        bg: priority === "high" ? "bg-purple-500" : "bg-purple-100",
        text: priority === "high" ? "#ffffff" : "#7c3aed",
        accent: "#7c3aed",
      },
    };
    return (
      colorMap[type] || {
        bg: "bg-slate-100",
        text: "#475569",
        accent: "#475569",
      }
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { bg: "bg-red-100", text: "text-red-700", label: "Important" },
      medium: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Medium" },
      low: { bg: "bg-slate-100", text: "text-slate-700", label: "Low" },
    };
    const config = priorityConfig[priority] || priorityConfig.low;

    return (
      <View className={`px-2 py-1 rounded-full ${config.bg}`}>
        <Text className={`${config.text} text-xs font-semibold`}>
          {config.label}
        </Text>
      </View>
    );
  };

  const filterOptions = [
    {
      label: "All Notifications",
      value: "all",
      icon: "bell",
      count: notifications.length,
    },
    {
      label: "Unread Only",
      value: "unread",
      icon: "alert-circle",
      count: notifications.filter((n) => !n.isRead).length,
    },
    {
      label: "Appointments",
      value: "appointment",
      icon: "calendar",
      count: notifications.filter((n) => n.type === "appointment").length,
    },
    {
      label: "Payments",
      value: "payment",
      icon: "credit-card",
      count: notifications.filter((n) => n.type === "payment").length,
    },
    {
      label: "Medical",
      value: "medical",
      icon: "activity",
      count: notifications.filter((n) => n.type === "medical").length,
    },
    {
      label: "Prescriptions",
      value: "prescription",
      icon: "package",
      count: notifications.filter((n) => n.type === "prescription").length,
    },
    {
      label: "System",
      value: "system",
      icon: "settings",
      count: notifications.filter((n) => n.type === "system").length,
    },
  ];

  const currentFilter = filterOptions.find((opt) => opt.value === filterType);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
        <View className="p-4 gap-6">
          {/* Header Section with Stats */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-slate-800">
                Notifications
              </Text>
              <Text className="text-slate-600 mt-1 text-base">
                {unreadCount > 0
                  ? `${unreadCount} unread notifications`
                  : "You're all caught up!"}
              </Text>
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={markAllAsRead}
                className="flex-row items-center gap-2 px-3 py-2 bg-cyan-50 rounded-lg border border-cyan-200"
                activeOpacity={0.7}
              >
                <Feather name="check-circle" size={16} color="#0891b2" />
                <Text className="text-cyan-700 text-sm font-medium">
                  Mark all read
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white rounded-xl p-4 border border-slate-200">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-slate-600 text-sm font-medium">
                    Total
                  </Text>
                  <Text className="text-2xl font-bold text-slate-800 mt-1">
                    {notifications.length}
                  </Text>
                </View>
                <View className="bg-slate-100 p-2 rounded-lg">
                  <Feather name="bell" size={20} color="#475569" />
                </View>
              </View>
            </View>

            <View className="flex-1 bg-white rounded-xl p-4 border border-slate-200">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-slate-600 text-sm font-medium">
                    Unread
                  </Text>
                  <Text className="text-2xl font-bold text-slate-800 mt-1">
                    {unreadCount}
                  </Text>
                </View>
                <View className="bg-red-100 p-2 rounded-lg">
                  <Feather name="alert-circle" size={20} color="#dc2626" />
                </View>
              </View>
            </View>
          </View>

          {/* Search and Filter Row */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <View className="relative">
                <Feather
                  name="search"
                  size={18}
                  color="#94a3b8"
                  style={{ position: "absolute", left: 12, top: 12, zIndex: 1 }}
                />
                <TextInput
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  className="pl-10 h-11 rounded-xl border border-slate-200 bg-white"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setIsFilterModalVisible(true)}
              className="w-11 h-11 rounded-xl border border-slate-200 bg-white items-center justify-center"
              activeOpacity={0.7}
            >
              <View className="relative">
                <Feather name="filter" size={18} color="#475569" />
                {filterType !== "all" && (
                  <View className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full" />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Filter Chip */}
          {filterType !== "all" && (
            <View className="flex-row items-center justify-between bg-cyan-50 rounded-xl p-3 border border-cyan-200">
              <View className="flex-row items-center gap-2">
                <Feather name={currentFilter?.icon} size={16} color="#0891b2" />
                <Text className="text-cyan-700 font-medium">
                  {currentFilter?.label} • {filteredNotifications.length} found
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setFilterType("all")}
                activeOpacity={0.7}
              >
                <Feather name="x" size={16} color="#0891b2" />
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <View className="gap-3">
              {filteredNotifications.map((notification, index) => {
                const color = getNotificationColor(
                  notification.type,
                  notification.priority
                );
                const translateX = slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SCREEN_WIDTH, 0],
                });

                return (
                  <Animated.View
                    key={notification._id}
                    style={{
                      transform: [{ translateX }],
                      opacity: slideAnim,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleNotificationAction(notification)}
                      className={`bg-white rounded-xl border ${
                        !notification.isRead
                          ? "border-l-4 border-l-cyan-500 shadow-md"
                          : "border-slate-200 shadow-sm"
                      } p-4 active:bg-slate-50`}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row gap-3">
                        {/* Icon with priority indicator */}
                        <View className="relative">
                          <View className={`p-3 rounded-xl ${color.bg}`}>
                            <Feather
                              name={getNotificationIcon(notification.type)}
                              size={18}
                              color={color.text}
                            />
                          </View>
                          {notification.priority === "high" &&
                            !notification.isRead && (
                              <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                            )}
                        </View>

                        {/* Content */}
                        <View className="flex-1">
                          <View className="flex-row items-start justify-between mb-2">
                            <Text
                              className={`font-semibold text-base flex-1 pr-2 ${
                                notification.isRead
                                  ? "text-slate-600"
                                  : "text-slate-800"
                              }`}
                              numberOfLines={2}
                            >
                              {notification.message}
                            </Text>
                            {!notification.isRead && (
                              <View className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
                            )}
                          </View>

                          {/* Meta info */}
                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                              <Text className="text-slate-500 text-sm">
                                {formatDate(notification.createdAt)} •{" "}
                                {formatTime(notification.createdAt)}
                              </Text>
                              {getPriorityBadge(notification.priority)}
                            </View>

                            {!notification.isRead && (
                              <TouchableOpacity
                                onPress={() => markAsRead(notification._id)}
                                className="px-3 py-1 bg-slate-100 rounded-lg"
                                activeOpacity={0.7}
                              >
                                <Text className="text-slate-600 text-xs font-medium">
                                  Mark read
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center justify-center border border-slate-200">
              <View className="bg-slate-100 rounded-full p-6 mb-4">
                <Feather name="bell-off" size={48} color="#94a3b8" />
              </View>
              <Text className="text-xl font-bold text-slate-700 mb-2 text-center">
                No notifications found
              </Text>
              <Text className="text-slate-500 text-center mb-4">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter"
                  : "You're all caught up! New notifications will appear here."}
              </Text>
              {(searchTerm || filterType !== "all") && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchTerm("");
                    setFilterType("all");
                  }}
                  className="flex-row items-center gap-2 px-4 py-2 bg-cyan-500 rounded-lg"
                  activeOpacity={0.7}
                >
                  <Feather name="refresh-cw" size={16} color="#ffffff" />
                  <Text className="text-white font-medium">Clear filters</Text>
                </TouchableOpacity>
              )}
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
          <View className="bg-white rounded-t-3xl p-6 max-h-3/4">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-2">
                <Feather name="filter" size={20} color="#475569" />
                <Text className="text-xl font-bold text-slate-800">
                  Filter Notifications
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsFilterModalVisible(false)}
                activeOpacity={0.7}
              >
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-2 pb-4">
                {filterOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      setFilterType(option.value);
                      setIsFilterModalVisible(false);
                    }}
                    className={`flex-row items-center justify-between p-4 rounded-xl ${
                      filterType === option.value
                        ? "bg-cyan-50 border border-cyan-200"
                        : "bg-slate-50"
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        className={`p-2 rounded-lg ${
                          filterType === option.value
                            ? "bg-cyan-500"
                            : "bg-slate-200"
                        }`}
                      >
                        <Feather
                          name={option.icon}
                          size={16}
                          color={
                            filterType === option.value ? "#ffffff" : "#475569"
                          }
                        />
                      </View>
                      <Text
                        className={`font-medium flex-1 ${
                          filterType === option.value
                            ? "text-cyan-700"
                            : "text-slate-600"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <Text
                        className={`text-sm ${
                          filterType === option.value
                            ? "text-cyan-600"
                            : "text-slate-500"
                        }`}
                      >
                        {option.count}
                      </Text>
                      {filterType === option.value && (
                        <Feather name="check" size={16} color="#0891b2" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Action Modal */}
      <Modal
        visible={isActionModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsActionModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-lg font-bold text-slate-800 mb-2">
              Notification Action
            </Text>
            <Text className="text-slate-600 mb-6">
              What would you like to do with this notification?
            </Text>

            <View className="gap-3">
              <TouchableOpacity
                onPress={() =>
                  selectedNotification &&
                  executeAction(selectedNotification.action)
                }
                className="flex-row items-center gap-3 p-3 bg-cyan-50 rounded-xl"
                activeOpacity={0.7}
              >
                <Feather name="external-link" size={18} color="#0891b2" />
                <Text className="text-cyan-700 font-medium flex-1">
                  Take Action
                </Text>
                <Feather name="chevron-right" size={16} color="#0891b2" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  selectedNotification && markAsRead(selectedNotification._id)
                }
                className="flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl"
                activeOpacity={0.7}
              >
                <Feather name="check-circle" size={18} color="#475569" />
                <Text className="text-slate-600 font-medium flex-1">
                  Mark as Read
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsActionModalVisible(false)}
                className="flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl"
                activeOpacity={0.7}
              >
                <Feather name="x" size={18} color="#64748b" />
                <Text className="text-slate-600 font-medium flex-1">
                  Dismiss
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Notifications;
