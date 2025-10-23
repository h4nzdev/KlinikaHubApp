import { View, Text, StatusBar } from "react-native";
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native"; // ← ADD THIS
import { AuthenticationContext } from "../context/AuthenticationContext";
import AuthNavigation from "./AuthNavigation";
import AppNavigation from "./AppNavigation";

export default function Role() {
  const { user } = useContext(AuthenticationContext);

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      {!user ? <AuthNavigation /> : <AppNavigation />}
    </NavigationContainer>
  );
}
