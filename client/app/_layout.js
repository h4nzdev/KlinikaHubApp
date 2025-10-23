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
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="app-tour" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </ReminderProvider>
    </AuthenticationProvider>
  );
}
