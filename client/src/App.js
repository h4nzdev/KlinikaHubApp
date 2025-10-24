import React from "react";
import { AuthenticationProvider } from "./context/AuthenticationContext";
import Role from "./navigation/Role";
import { ReminderProvider } from "./context/ReminderContext";

export default function App() {
  return (
    <AuthenticationProvider>
      <ReminderProvider>
        <Role />
      </ReminderProvider>
    </AuthenticationProvider>
  );
}
