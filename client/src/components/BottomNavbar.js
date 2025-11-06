import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomNavbar = ({ state, navigation, descriptors }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const insets = useSafeAreaInsets();

  // Get active tab from navigation state
  const activeTab = state.routes[state.index].name;

  const leftMenuItems = [
    { icon: "home", label: "Dashboard", id: "Dashboard" },
    { icon: "message-square", label: "AI Chat", id: "AIChat" },
  ];

  const rightMenuItems = [
    { icon: "calendar", label: "Appointments", id: "Appointments" },
    { icon: "more-horizontal", label: "More", id: "More" },
  ];

  const moreMenuItems = [
    { icon: "file-text", label: "Medical Records", id: "MedicalRecords" },
    { icon: "bell", label: "Reminders", id: "Reminders" },
    { icon: "credit-card", label: "Invoices", id: "Invoices" },
  ];

  const handleTabPress = (tabName, isTab = true) => {
    if (tabName === "More") {
      setShowMoreMenu(!showMoreMenu);
      return;
    }

    setShowMoreMenu(false);

    if (isTab) {
      // For tab screens, use the tab navigator's navigation
      const event = navigation.emit({
        type: "tabPress",
        target: tabName,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.navigate(tabName);
      }
    } else {
      // For stack screens, navigate normally
      navigation.navigate(tabName);
    }
  };

  const isMoreMenuActive = moreMenuItems.some((item) => activeTab === item.id);

  const NavButton = ({
    item,
    isActive,
    isMoreButton = false,
    showClose = false,
  }) => (
    <TouchableOpacity
      onPress={() => handleTabPress(item.id, !isMoreButton)}
      className={`flex-col items-center justify-center gap-1.5 relative p-3 rounded-2xl min-w-0 ${
        isActive ? "bg-blue-50/70" : ""
      }`}
      activeOpacity={0.7}
    >
      <View className={`relative ${isActive ? "scale-105" : ""}`}>
        {showClose ? (
          <Feather
            name="x"
            size={22}
            color={isActive ? "#2563eb" : "#64748b"}
          />
        ) : (
          <Feather
            name={item.icon}
            size={22}
            color={isActive ? "#2563eb" : "#64748b"}
          />
        )}
        {isActive && (
          <View className="absolute -inset-1 bg-blue-100 rounded-full -z-10" />
        )}
      </View>
      <Text
        className={`text-xs text-center leading-tight ${
          isActive
            ? "font-semibold text-blue-700"
            : "font-medium text-slate-600"
        }`}
        numberOfLines={1}
      >
        {showClose ? "Close" : item.label}
      </Text>
      {isActive && (
        <View className="absolute -bottom-0.5 w-2 h-2 bg-blue-500 rounded-full shadow-lg" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      {/* Backdrop for more menu */}
      {showMoreMenu && (
        <TouchableWithoutFeedback onPress={() => setShowMoreMenu(false)}>
          <View className="absolute inset-0 bg-black/20 z-30" />
        </TouchableWithoutFeedback>
      )}

      {/* Drop-up More Menu */}
      {showMoreMenu && (
        <View className="absolute bottom-24 mb-2 right-4 bg-white/95 rounded-2xl shadow-2xl border border-slate-200/50 z-40 min-w-[160px] pb-4">
          <View className="p-2">
            {moreMenuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTabPress(item.id, false)}
                className={`flex-row items-center gap-3 px-4 py-3 rounded-xl ${
                  activeTab === item.id ? "bg-blue-50/70" : ""
                }`}
                activeOpacity={0.7}
              >
                <Feather
                  name={item.icon}
                  size={20}
                  color={activeTab === item.id ? "#2563eb" : "#334155"}
                />
                <Text
                  className={`text-sm font-medium flex-1 ${
                    activeTab === item.id ? "text-blue-600" : "text-slate-700"
                  }`}
                >
                  {item.label}
                </Text>
                {activeTab === item.id && (
                  <View className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View className="absolute -bottom-2 right-6 w-4 h-4 bg-white/95 border-r border-b border-slate-200/50 transform rotate-45" />
        </View>
      )}

      {/* Main Navbar */}
      <View
        className="bg-white/90 border-t border-slate-100 shadow-2xl"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="h-px bg-slate-200" />
        <View className="flex-row justify-between items-center h-20 px-3 max-w-md mx-auto relative">
          {/* Left menu items */}
          <View className="flex-1 flex-row justify-around">
            {leftMenuItems.map((item, index) => (
              <NavButton
                key={index}
                item={item}
                isActive={activeTab === item.id}
              />
            ))}
          </View>

          {/* Center button */}
          <View className="flex-shrink-0 mx-2">
            <TouchableOpacity
              onPress={() => handleTabPress("Clinics", true)}
              className="flex-col items-center justify-center relative"
              activeOpacity={0.8}
            >
              <View
                className={`relative p-3 rounded-full ${
                  activeTab === "Clinics"
                    ? "bg-cyan-600 shadow-lg scale-110"
                    : "bg-cyan-500 shadow-lg"
                }`}
                style={{
                  shadowColor: "#06b6d4",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Feather name="activity" size={24} color="#ffffff" />
                {activeTab === "Clinics" && (
                  <View className="absolute -inset-2 bg-cyan-400/30 rounded-full -z-10" />
                )}
              </View>
              <Text
                className={`text-xs text-center leading-tight mt-1 ${
                  activeTab === "Clinics"
                    ? "font-semibold text-cyan-700"
                    : "font-medium text-slate-600"
                }`}
              >
                {activeTab === "Clinics" ? "" : "Clinics"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Right menu items */}
          <View className="flex-1 flex-row justify-around">
            {rightMenuItems.map((item, index) => {
              const isMoreButton = item.id === "More";
              const isActive = isMoreButton
                ? showMoreMenu || isMoreMenuActive
                : activeTab === item.id;

              return (
                <NavButton
                  key={index}
                  item={item}
                  isActive={isActive}
                  isMoreButton={isMoreButton}
                  showClose={isMoreButton && showMoreMenu}
                />
              );
            })}
          </View>
        </View>
        <View className="h-4" />
      </View>
    </>
  );
};

export default BottomNavbar;
