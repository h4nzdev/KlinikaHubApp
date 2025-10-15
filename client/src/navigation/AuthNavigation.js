import { View, Text, StatusBar } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Authentication/Login";
import Register from "../screens/Authentication/Register";
import VerificationScreen from "../screens/Authentication/VerificationScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        style={{ paddingTop: StatusBar.currentHeight }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
