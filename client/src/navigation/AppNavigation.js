import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet, StatusBar } from "react-native";

// Import screens
import Dashboard from "../screens/Main/Dashboard/Dashboard";
import Profile from "../screens/Main/Profile/Profile";
import Appointments from "../screens/Main/Appointments/Appointments";
import AIChat from "../screens/Main/AIChat/AIChat";
import Doctors from "../screens/Main/Doctors/Doctors";
import Invoices from "../screens/Main/Invoices/Invoices";
import Reminders from "../screens/Main/Reminders/Reminders";
import DoctorProfile from "../screens/Main/DoctorProfile/DoctorProfile";
import MedicalRecords from "../screens/Main/MedicalRecords/MedicalRecords";
import Notifications from "../screens/Main/Notification/Notifications";

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
      <View className="flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "none",
            animationEnabled: false,
            transitionSpec: {
              open: { animation: "timing", config: { duration: 0 } },
              close: { animation: "timing", config: { duration: 0 } },
            },
            cardStyleInterpolator: () => ({}),
            gestureEnabled: false,
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
          <Stack.Screen name="Notifications" component={Notifications} />
        </Stack.Navigator>
        <BottomNavbar />
      </View>
    </NavigationContainer>
  );
};

export default AppNavigation;
