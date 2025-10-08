import { View, Text } from "react-native";
import React, { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import AuthNavigation from "./AuthNavigation";
import AppNavigation from "./AppNavigation";

export default function Role() {
  const { user } = useContext(AuthenticationContext);
  if (!user) return <AuthNavigation />;
  if (user) return <AppNavigation />;
  return null;
}
