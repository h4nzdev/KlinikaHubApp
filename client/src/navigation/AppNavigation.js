import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";

// Import screens
import Dashboard from "../screens/Dashboard/Dashboard";
import Profile from "../screens/Profile/Profile";
import Appointments from "../screens/Appointments/Appointments";
import AIChat from "../screens/AIChat/AIChat";
import Doctors from "../screens/Doctors/Doctors";
import Invoices from "../screens/Invoices/Invoices";
import Reminders from "../screens/Reminders/Reminders";
import DoctorProfile from "../screens/DoctorProfile/DoctorProfile";
import MedicalRecords from "../screens/MedicalRecords/MedicalRecords";

// Import bottom navigation
import BottomNavbar from "../components/BottomNavbar";
import SplashScreen from "../screens/SplashScreen"; // Import your splash screen

const Stack = createStackNavigator();

const AppNavigation = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show splash screen while showSplash is true
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <View className="flex-1">
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Appointments" component={Appointments} />
          <Stack.Screen name="AIChat" component={AIChat} />
          <Stack.Screen name="Doctors" component={Doctors} />
          <Stack.Screen name="MedicalRecords" component={MedicalRecords} />
          <Stack.Screen name="Invoices" component={Invoices} />
          <Stack.Screen name="Reminders" component={Reminders} />
          <Stack.Screen name="DoctorProfile" component={DoctorProfile} />
        </Stack.Navigator>
        <BottomNavbar />
      </View>
    </NavigationContainer>
  );
};

export default AppNavigation;
