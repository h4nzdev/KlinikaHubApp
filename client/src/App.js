import React from "react";
import { AuthenticationProvider } from "./context/AuthenticationContext";
import { ReminderProvider } from "./context/ReminderContext";
import Role from "./navigation/Role";
import { NotificationProvider } from "./context/NotificationContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthenticationProvider>
        <ReminderProvider>
          <NotificationProvider>
            {/* ✅ Role contains NavigationContainer AND ReminderModal */}
            <Role />
          </NotificationProvider>
        </ReminderProvider>
      </AuthenticationProvider>
    </SafeAreaProvider>
  );
}
