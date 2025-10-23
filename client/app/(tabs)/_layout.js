import React from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#0891b2',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="clinics" 
        options={{
          tabBarLabel: "Clinics",
          tabBarIcon: ({ color, size }) => (
            <Feather name="map-pin" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="appointments" 
        options={{
          tabBarLabel: "Appointments",
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="appointment-booking" 
        options={{
          tabBarLabel: "Book",
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="medical-records" 
        options={{
          tabBarLabel: "Records",
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="invoices" 
        options={{
          tabBarLabel: "Invoices",
          tabBarIcon: ({ color, size }) => (
            <Feather name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="reminders" 
        options={{
          tabBarLabel: "Reminders",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="notifications" 
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="calendar" 
        options={{
          tabBarLabel: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="ai-chat" 
        options={{
          tabBarLabel: "AI Chat",
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="clinic-profile" 
        options={{
          tabBarLabel: "Clinic Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="building" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="reviews" 
        options={{
          tabBarLabel: "Reviews",
          tabBarIcon: ({ color, size }) => (
            <Feather name="star" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="settings" 
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
