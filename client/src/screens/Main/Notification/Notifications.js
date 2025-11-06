import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";

const Notifications = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <Header />

      <View className="flex-1 items-center justify-center p-6">
        {/* Sleeping bell icon */}
        <View className="relative mb-6">
          <Feather name="bell" size={80} color="#cbd5e1" />
          <Text className="absolute -top-2 -right-2 text-2xl">💤</Text>
        </View>

        <Text className="text-2xl font-bold text-slate-800 mb-2">
          Notifications Sleeping
        </Text>
        <Text className="text-slate-500 text-center mb-6">
          We'll wake them up in the next update!
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-cyan-500 px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-semibold text-lg">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
