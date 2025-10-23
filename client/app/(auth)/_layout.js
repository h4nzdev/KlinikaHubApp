import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Stack, useRouter, Redirect } from "expo-router";
import { AuthenticationContext } from "../../src/context/AuthenticationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthLayout() {
  const { user, isLoading } = useContext(AuthenticationContext);
  const router = useRouter();
  const [showAppTour, setShowAppTour] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isCheckingTour, setIsCheckingTour] = useState(true);

  // Check if user has seen the tour before
  useEffect(() => {
    if (!isLoading) {
      checkTourStatus();
    }
  }, [isLoading]);

  const checkTourStatus = async () => {
    try {
      const hasSeenTour = await AsyncStorage.getItem("@medora_has_seen_tour");

      // Show splash first
      setShowSplash(true);
      setShowAppTour(false);

      // After splash, decide what to show next
      setTimeout(async () => {
        if (hasSeenTour === "true") {
          // User has seen tour before
          setShowSplash(false);
          handleNavigation();
        } else {
          // First time user, show the tour
          setShowSplash(false);
          setShowAppTour(true);
        }
        setIsCheckingTour(false);
      }, 3000);
    } catch (error) {
      console.error("Error checking tour status:", error);
      setTimeout(() => {
        setShowSplash(false);
        setShowAppTour(true);
        setIsCheckingTour(false);
      }, 3000);
    }
  };

  const handleTourFinish = async () => {
    try {
      await AsyncStorage.setItem("@medora_has_seen_tour", "true");
      setShowAppTour(false);
      setShowSplash(true);

      setTimeout(() => {
        setShowSplash(false);
        handleNavigation();
      }, 2000);
    } catch (error) {
      console.error("Error saving tour status:", error);
      setShowAppTour(false);
      handleNavigation();
    }
  };

  const handleNavigation = () => {
    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/login");
    }
  };

  // Loading state
  if (isLoading || isCheckingTour) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show splash screen
  if (showSplash) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Splash Screen...</Text>
      </View>
    );
  }

  // Show app tour
  if (showAppTour) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>App Tour Screen...</Text>
        <Button title="Finish Tour" onPress={handleTourFinish} />
      </View>
    );
  }

  // If we get here, handle navigation based on auth state
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  // Show auth stack
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verification" />
    </Stack>
  );
}
