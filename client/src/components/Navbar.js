import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import {
  Home,
  Calendar,
  MessageCircle,
  MoreHorizontal,
  X,
  FileText,
  Bell,
  Receipt,
  Plus,
} from "react-native-feather";

export default function Navbar() {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentPath, setCurrentPath] = useState("/client/dashboard");

  // Mock data for navigation
  const leftMenuItems = [
    { icon: Home, link: "/client/dashboard", label: "Home" },
    { icon: Calendar, link: "/client/appointments", label: "Appointments" },
  ];

  const rightMenuItems = [
    { icon: MessageCircle, link: "/client/chats", label: "AI Chat" },
    {
      icon: MoreHorizontal,
      action: () => setShowMoreMenu(!showMoreMenu),
      label: "More",
    },
  ];

  const moreMenuItems = [
    {
      icon: FileText,
      link: "/client/medical-records",
      label: "Medical Records",
    },
    { icon: Bell, link: "/client/reminders", label: "Reminders" },
    { icon: Receipt, link: "/client/invoices", label: "Invoices" },
  ];

  const isMoreMenuActive = moreMenuItems.some(
    (item) => currentPath === item.link
  );

  const handleNavigation = (link) => {
    setCurrentPath(link);
    setShowMoreMenu(false);
  };

  const NavButton = ({
    item,
    isActive,
    isMoreButton = false,
    showClose = false,
  }) => (
    <TouchableOpacity
      className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-0 ${
        isActive
          ? "bg-blue-50/70 text-blue-600"
          : "text-slate-600 hover:text-blue-600"
      }`}
      onPress={isMoreButton ? item.action : () => handleNavigation(item.link)}
    >
      <View
        className={`relative transition-all duration-300 ${isActive ? "transform scale-105" : ""}`}
      >
        {showClose ? (
          <X
            className={`w-5 h-5 ${isActive ? "drop-shadow-sm" : ""}`}
            color={isActive ? "#2563eb" : "#4b5563"}
          />
        ) : (
          <item.icon
            className={`w-5 h-5 ${isActive ? "drop-shadow-sm" : ""}`}
            color={isActive ? "#2563eb" : "#4b5563"}
          />
        )}
        {isActive && (
          <View className="absolute -inset-1 bg-blue-100 rounded-full -z-10" />
        )}
      </View>
      <Text
        className={`text-xs text-center leading-tight truncate w-full mt-1 ${
          isActive ? "font-semibold text-blue-700" : "fnt-medium"
        }`}
      >
        {showClose ? "Close" : item.label}
      </Text>
      {isActive && (
        <View className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      {/* More Menu Modal */}
      <Modal
        visible={showMoreMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMoreMenu(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/20"
          activeOpacity={1}
          onPress={() => setShowMoreMenu(false)}
        >
          <View className="absolute bottom-24 right-4 min-w-[160px]">
            <View className="bg-white/95 rounded-2xl border border-slate-200/50 shadow-2xl">
              <View className="p-2">
                {moreMenuItems.map((item, index) => {
                  const isActive = currentPath === item.link;
                  return (
                    <TouchableOpacity
                      key={index}
                      className={`flex flex-row items-center space-x-3 px-4 py-3 rounded-xl ${
                        isActive
                          ? "text-blue-600 bg-blue-50/70"
                          : "text-slate-700 hover:text-blue-600"
                      }`}
                      onPress={() => handleNavigation(item.link)}
                    >
                      <item.icon
                        className="w-5 h-5"
                        color={isActive ? "#2563eb" : "#374151"}
                      />
                      <Text
                        className={`text-sm font-medium flex-1 ${
                          isActive ? "text-blue-600" : "text-slate-700"
                        }`}
                      >
                        {item.label}
                      </Text>
                      {isActive && (
                        <View className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Arrow pointing down */}
              <View className="absolute -bottom-2 right-6 w-4 h-4 bg-white/95 border-r border-b border-slate-200/50 transform rotate-45" />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Main Navigation Bar */}
      <View className="fixed bottom-0 left-0 right-0 bg-white/90 border-t border-slate-100 shadow-2xl z-40">
        <View className="flex flex-row justify-between items-center h-20 px-3 max-w-md mx-auto">
          {/* Left menu items */}
          <View className="flex flex-1 justify-around">
            {leftMenuItems.map((item, index) => {
              const isActive = currentPath === item.link;
              return <NavButton key={index} item={item} isActive={isActive} />;
            })}
          </View>

          {/* Center plus button */}
          <View className="flex-shrink-0 mx-2">
            <TouchableOpacity
              className={`flex flex-col items-center justify-center ${
                currentPath === "/client/doctors" ? "text-white" : "text-white"
              }`}
              onPress={() => handleNavigation("/client/doctors")}
            >
              <View
                className={`relative p-3 rounded-full transition-all duration-300 ${
                  currentPath === "/client/doctors"
                    ? "bg-cyan-600 shadow-lg shadow-cyan-500/30 scale-110"
                    : "bg-cyan-500 hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30"
                }`}
              >
                <Plus className="w-6 h-6" color="#ffffff" strokeWidth={2.5} />
                {currentPath === "/client/doctors" && (
                  <View className="absolute -inset-2 bg-cyan-400/30 rounded-full -z-10" />
                )}
              </View>
              <Text
                className={`text-xs text-center leading-tight mt-1 ${
                  currentPath === "/client/doctors"
                    ? "font-semibold text-cyan-700"
                    : "font-medium text-slate-600"
                }`}
              >
                Doctors
              </Text>
            </TouchableOpacity>
          </View>

          {/* Right menu items */}
          <View className="flex flex-1 justify-around">
            {rightMenuItems.map((item, index) => {
              const isMoreButton = item.action;
              const isActive = isMoreButton
                ? showMoreMenu || isMoreMenuActive
                : currentPath === item.link;

              return (
                <NavButton
                  key={index}
                  item={item}
                  isActive={isActive}
                  isMoreButton={isMoreButton}
                  showClose={showMoreMenu}
                />
              );
            })}
          </View>
        </View>

        {/* Safe area padding for devices with home indicator */}
        <View className="h-8" />
      </View>
    </>
  );
}
