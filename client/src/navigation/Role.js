import { View, Text, StatusBar } from "react-native";
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./AuthNavigation";
import AppNavigation from "./AppNavigation";
import Toast from "react-native-toast-message";
import ReminderModal from "../components/ReminderModal"; // ✅ Import here
import { AuthenticationContext } from "../context/AuthenticationContext";

export default function Role() {
  const { user } = useContext(AuthenticationContext);

  return (
    <>
      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        {!user ? <AuthNavigation /> : <AppNavigation />}

        {/* ✅ Modal is NOW INSIDE NavigationContainer */}
        {user && <ReminderModal />}
      </NavigationContainer>

      {/* Toast should live outside the NavigationContainer */}
      <Toast />
    </>
  );
}
