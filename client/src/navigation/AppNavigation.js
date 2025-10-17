import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { View, StatusBar } from "react-native";

// Import screens
import Dashboard from "../screens/Main/Dashboard/Dashboard";
import Profile from "../screens/Main/Profile/Profile";
import Appointments from "../screens/Main/Appointments/Appointments";
import AIChat from "../screens/Main/AIChat/AIChat";
import Clinics from "../screens/Main/Clinics/Clinics";
import MedicalRecords from "../screens/Main/MedicalRecords/MedicalRecords";
import Invoices from "../screens/Main/Invoices/Invoices";
import Reminders from "../screens/Main/Reminders/Reminders";
import Notifications from "../screens/Main/Notification/Notifications";
import SplashScreen from "../screens/SplashScreen";
import ClinicProfile from "../screens/Main/ClinicProfile/ClinicProfile";

// Import your custom BottomNavbar
import BottomNavbar from "../components/BottomNavbar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AppointmentBookingPage from "../screens/Main/AppointmentBooking/AppointmentBookingPage";
import Calendar from "../screens/Main/Calendar/Calendar";
import Settings from "../screens/Main/Settings/Settings";
import Reviews from "../screens/Main/Reviews/Reviews";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for main screens
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavbar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="AIChat" component={AIChat} />
      <Tab.Screen name="Clinics" component={Clinics} />
      <Tab.Screen name="Appointments" component={Appointments} />
      <Tab.Screen
        name="AppointmentBookingPage"
        component={AppointmentBookingPage}
      />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="MedicalRecords" component={MedicalRecords} />
      <Tab.Screen name="Invoices" component={Invoices} />
      <Tab.Screen name="Reminders" component={Reminders} />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="Calendar" component={Calendar} />
    </Tab.Navigator>
  );
}

const AppNavigation = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <View className="flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="MedicalRecords" component={MedicalRecords} />
          <Stack.Screen name="Invoices" component={Invoices} />
          <Stack.Screen name="Reminders" component={Reminders} />
          <Stack.Screen
            name="AppointmentBookingPage"
            component={AppointmentBookingPage}
          />
          <Stack.Screen name="ClinicProfile" component={ClinicProfile} />
          <Stack.Screen name="Reviews" component={Reviews} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};

export default AppNavigation;
