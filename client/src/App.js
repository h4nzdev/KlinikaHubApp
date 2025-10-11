import React from "react";
import AppNavigation from "./navigation/AppNavigation";
import AuthNavigation from "./navigation/AuthNavigation";
import { AuthenticationProvider } from "./context/AuthenticationContext";
import Role from "./navigation/Role";
import Toast from "react-native-toast-message";
import { ReminderProvider } from "./context/ReminderContext";

export default function App() {
  return (
    <AuthenticationProvider>
      <ReminderProvider>
        <Role />
        <Toast />
      </ReminderProvider>
    </AuthenticationProvider>
  );
}
