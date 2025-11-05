import React from "react";
import { AuthenticationProvider } from "./context/AuthenticationContext";
import { ReminderProvider } from "./context/ReminderContext";
import Role from "./navigation/Role";
import { NotificationProvider } from "./context/NotificationContext";

export default function App() {
  return (
    <AuthenticationProvider>
      <ReminderProvider>
        <NotificationProvider>
          {/* ✅ Role contains NavigationContainer AND ReminderModal */}
          <Role />
        </NotificationProvider>
      </ReminderProvider>
    </AuthenticationProvider>
  );
}
