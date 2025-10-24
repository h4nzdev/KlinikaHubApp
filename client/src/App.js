import React from "react";
import { AuthenticationProvider } from "./context/AuthenticationContext";
import { ReminderProvider } from "./context/ReminderContext";
import Role from "./navigation/Role";

export default function App() {
  return (
    <AuthenticationProvider>
      <ReminderProvider>
        {/* ✅ Role contains NavigationContainer AND ReminderModal */}
        <Role />
      </ReminderProvider>
    </AuthenticationProvider>
  );
}
