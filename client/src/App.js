import React from "react";
import { AuthenticationProvider } from "./context/AuthenticationContext";
import { ReminderProvider } from "./context/ReminderContext";
import Role from "./navigation/Role";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RefreshProvider } from "./context/RefreshContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthenticationProvider>
        <ReminderProvider>
          <RefreshProvider>
            <Role />
          </RefreshProvider>
        </ReminderProvider>
      </AuthenticationProvider>
    </SafeAreaProvider>
  );
}
