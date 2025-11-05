import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import AppTour from "../screens/AppTour";
import ClinicProfile from "../screens/Main/ClinicProfile/ClinicProfile";

// Import your custom BottomNavbar
import BottomNavbar from "../components/BottomNavbar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AppointmentBookingPage from "../screens/Main/AppointmentBooking/AppointmentBookingPage";
import Calendar from "../screens/Main/Calendar/Calendar";
import Settings from "../screens/Main/Settings/Settings";
import Reviews from "../screens/Main/Reviews/Reviews";
import Reschedule from "../screens/Main/Reschedule/Reschedule";
import PrivacyPolicy from "../screens/Main/Settings/PrivacyPolicy";
import TermsOfService from "../screens/Main/Settings/TermsOfService";
import DataSecurity from "../screens/Main/Settings/DataSecurity";
import FAQ from "../screens/Main/Settings/FAQ";
import AppointmentDetails from "../screens/Main/Appointments/AppointmentDetails";
import ReminderSettings from "../screens/Main/Settings/ReminderSettings";
import DataStorageSettings from "../screens/Main/Settings/DataStorageSettings";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for main screens
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavbar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Clinics" component={Clinics} />
      <Tab.Screen name="Appointments" component={Appointments} />
      <Tab.Screen name="AppointmentDetails" component={AppointmentDetails} />
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
  const [showAppTour, setShowAppTour] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showMainApp, setShowMainApp] = useState(false);
  const [isCheckingTour, setIsCheckingTour] = useState(true);

  // Check if user has seen the tour before
  useEffect(() => {
    checkTourStatus();
  }, []);

  const checkTourStatus = async () => {
    try {
      const hasSeenTour = await AsyncStorage.getItem("@medora_has_seen_tour");

      // Show splash first
      setShowSplash(true);
      setShowAppTour(false);
      setShowMainApp(false);

      // After splash, decide what to show next
      setTimeout(async () => {
        if (hasSeenTour === "true") {
          // User has seen tour before, go straight to main app
          setShowSplash(false);
          setShowMainApp(true);
        } else {
          // First time user, show the tour
          setShowSplash(false);
          setShowAppTour(true);
        }
        setIsCheckingTour(false);
      }, 3000); // Splash duration
    } catch (error) {
      console.error("Error checking tour status:", error);
      // On error, default to showing tour
      setTimeout(() => {
        setShowSplash(false);
        setShowAppTour(true);
        setIsCheckingTour(false);
      }, 3000);
    }
  };

  const handleTourFinish = async () => {
    try {
      // Save that user has seen the tour
      await AsyncStorage.setItem("@medora_has_seen_tour", "true");

      // Show celebratory splash before main app
      setShowAppTour(false);
      setShowSplash(true);

      // Short splash then show main app
      setTimeout(() => {
        setShowSplash(false);
        setShowMainApp(true);
      }, 2000);
    } catch (error) {
      console.error("Error saving tour status:", error);
      // Even if save fails, continue to main app
      setShowAppTour(false);
      setShowMainApp(true);
    }
  };

  // Show nothing while checking (optional loading state)
  if (isCheckingTour && showSplash) {
    return <SplashScreen onFinish={() => {}} />;
  }

  if (showAppTour) {
    return <AppTour isOpen={showAppTour} onClose={handleTourFinish} />;
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => {}} />;
  }

  return (
    <View className="flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
      {!showSplash && !showAppTour ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="MedicalRecords" component={MedicalRecords} />
          <Stack.Screen name="Invoices" component={Invoices} />
          <Stack.Screen name="AIChat" component={AIChat} />
          <Stack.Screen name="Reminders" component={Reminders} />
          <Stack.Screen
            name="AppointmentBookingPage"
            component={AppointmentBookingPage}
          />
          <Stack.Screen name="Reschedule" component={Reschedule} />
          <Stack.Screen name="ClinicProfile" component={ClinicProfile} />
          <Stack.Screen name="Clinics" component={Clinics} />
          <Stack.Screen name="Reviews" component={Reviews} />
          <Stack.Screen name="Notifications" component={Notifications} />

          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="TermsOfService" component={TermsOfService} />
          <Stack.Screen name="DataSecurity" component={DataSecurity} />
          <Stack.Screen name="FAQ" component={FAQ} />
          <Stack.Screen name="ReminderSettings" component={ReminderSettings} />
          <Stack.Screen name="DataStorage" component={DataStorageSettings} />
        </Stack.Navigator>
      ) : (
        <>
          {showSplash && <SplashScreen onFinish={() => {}} />}
          {showAppTour && (
            <AppTour isOpen={showAppTour} onClose={handleTourFinish} />
          )}
        </>
      )}
    </View>
  );
};

export default AppNavigation;
