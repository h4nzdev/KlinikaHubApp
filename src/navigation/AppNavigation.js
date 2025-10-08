import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";

// Import screens
import Dashboard from "../screens/Dashboard/Dashboard";
import Profile from "../screens/Profile/Profile";
import Appointments from "../screens/Appointments/Appointments";
import AIChat from "../screens/AIChat/AIChat";
import Doctors from "../screens/Doctors/Doctors";

// Import bottom navigation
import BottomNavbar from "../components/BottomNavbar";
import MedicalRecords from "../screens/MedicalRecords";
import Invoices from "../screens/Invoices/Invoices";
import Reminders from "../screens/Reminders/Reminders";
import DoctorProfile from "../screens/DoctorProfile/DoctorProfile";

const Stack = createStackNavigator();

const AppNavigation = () => {
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
