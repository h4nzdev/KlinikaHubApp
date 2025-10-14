import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthenticationContext } from "../context/AuthenticationContext";
import Toast from "react-native-toast-message";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationCount] = useState(5);
  const { user, logout } = useContext(AuthenticationContext); // Use logout function
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      await logout(); // Use the logout function from context
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });
      // Navigation will be handled by the context state change
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: "Please try again",
      });
    }
  };

  const handleNavigate = (screen) => {
    setIsDropdownOpen(false);
    navigation.navigate(screen);
  };

  // Add fallback for user data
  const userFirstName = user?.first_name || "User";
  const userPhoto = user?.photo || null;

  return (
    <>
      {/* Header */}
      <View className="bg-white/80 border-b border-slate-100/80">
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between">
            {/* Logo/Clinic Name */}
            <Text className="text-2xl font-bold text-cyan-600">
              <Text className="text-cyan-800">Klinika</Text>
              <Text className="text-green-800">Hub</Text>
            </Text>

            {/* Right side actions */}
            <View className="flex-row items-center gap-4">
              {/* Notifications */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Notifications")}
                className="relative p-2"
                activeOpacity={0.7}
              >
                <Feather name="bell" size={24} color="#94a3b8" />
                {notificationCount > 0 && (
                  <View className="absolute top-0 right-0 bg-red-400 rounded-full w-4 h-4 items-center justify-center">
                    <Text className="text-white text-[10px] font-medium">
                      {notificationCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* User Profile */}
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="rounded-full w-10 h-10 overflow-hidden border-2 border-cyan-500"
                  activeOpacity={0.8}
                  style={{
                    shadowColor: "#06b6d4",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  {userPhoto ? (
                    <Image
                      source={{ uri: userPhoto }}
                      className="w-full h-full"
                    />
                  ) : (
                    <View className="w-full h-full bg-cyan-100 items-center justify-center">
                      <Feather name="user" size={20} color="#06b6d4" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Profile Dropdown Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
          <View className="flex-1 bg-black/20">
            <TouchableWithoutFeedback>
              <View className="absolute top-16 right-4 bg-white rounded-xl shadow-2xl border border-slate-100/80 py-2 z-50 min-w-[192px]">
                {/* User Info Section */}
                <View className="px-4 py-3 border-b border-slate-100">
                  <Text
                    className="text-sm font-semibold text-slate-900"
                    numberOfLines={1}
                  >
                    {userFirstName}
                  </Text>
                  <Text className="text-xs text-slate-500">Patient</Text>
                </View>

                {/* Menu Items */}
                <View className="py-1">
                  <TouchableOpacity
                    onPress={() => handleNavigate("Profile")}
                    className="flex-row items-center px-4 py-2.5"
                    activeOpacity={0.7}
                  >
                    <Feather name="user" size={16} color="#334155" />
                    <Text className="text-sm text-slate-700 font-medium ml-3">
                      Profile
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleNavigate("Calendar")}
                    className="flex-row items-center px-4 py-2.5"
                    activeOpacity={0.7}
                  >
                    <Feather name="calendar" size={16} color="#334155" />
                    <Text className="text-sm text-slate-700 font-medium ml-3">
                      Calendar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleNavigate("Settings")}
                    className="flex-row items-center px-4 py-2.5"
                    activeOpacity={0.7}
                  >
                    <Feather name="settings" size={16} color="#334155" />
                    <Text className="text-sm text-slate-700 font-medium ml-3">
                      Settings
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Logout Section */}
                <View className="border-t border-slate-100 py-1">
                  <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center px-4 py-2.5"
                    activeOpacity={0.7}
                  >
                    <Feather name="log-out" size={16} color="#ef4444" />
                    <Text className="text-sm text-red-500 font-medium ml-3">
                      Logout
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default Header;
