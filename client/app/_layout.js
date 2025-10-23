import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AuthenticationProvider } from "../src/context/AuthenticationContext";
import { ReminderProvider } from "../src/context/ReminderContext";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <AuthenticationProvider>
      <ReminderProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <Stack screenOptions={{ headerShown: false }}>
          {/* Don't manually define screens - Expo Router does this automatically */}
        </Stack>
        <Toast />
      </ReminderProvider>
    </AuthenticationProvider>
  );
}
