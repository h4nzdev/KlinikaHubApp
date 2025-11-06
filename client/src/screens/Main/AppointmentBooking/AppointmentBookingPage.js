"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import Specialty from "./Specialty";
import Doctor from "./Doctor";
import Time from "./Time";
import Details from "./Details";
import Confirm from "./Confirm";
import DateScreen from "./DateScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppointmentBookingPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clinicId, clinicName } = route.params;
  const insets = useSafeAreaInsets();

  const [currentTab, setCurrentTab] = useState(1);
  const [formData, setFormData] = useState({
    doctorId: "",
    date: new Date(),
    time: "",
    type: "consultation",
    status: "scheduled",
    bookingType: "walk-in",
    notes: "",
    paymentMethod: "cash",
    specialtyFilter: "",
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const { user } = useContext(AuthenticationContext);

  const steps = [
    { number: 1, title: "Specialty", icon: "heart", completed: currentTab > 1 },
    { number: 2, title: "Date", icon: "calendar", completed: currentTab > 2 },
    { number: 3, title: "Doctor", icon: "user", completed: currentTab > 3 },
    { number: 4, title: "Time", icon: "clock", completed: currentTab > 4 },
    { number: 5, title: "Details", icon: "edit-3", completed: currentTab > 5 },
    { number: 6, title: "Confirm", icon: "check", completed: currentTab > 6 },
  ];

  const nextTab = () => setCurrentTab((prev) => Math.min(prev + 1, 6));
  const prevTab = () => setCurrentTab((prev) => Math.max(prev - 1, 1));

  const renderScreen = () => {
    const screenProps = {
      formData,
      setFormData,
      selectedDoctor,
      setSelectedDoctor,
      doctors,
      setDoctors,
      filteredDoctors,
      setFilteredDoctors,
      availableSlots,
      setAvailableSlots,
      clinicId,
      clinicName,
      user,
      nextTab,
      prevTab,
    };

    switch (currentTab) {
      case 1:
        return <Specialty {...screenProps} />;
      case 2:
        return <DateScreen {...screenProps} />;
      case 3:
        return <Doctor {...screenProps} />;
      case 4:
        return <Time {...screenProps} />;
      case 5:
        return <Details {...screenProps} />;
      case 6:
        return <Confirm {...screenProps} />;
      default:
        return <Specialty {...screenProps} />;
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <StatusBar barStyle="dark-content" />

      <View className="bg-cyan-500 px-6 pt-4 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 ml-4">
            <Text className="text-2xl font-bold text-white text-center">
              Book Appointment
            </Text>
            <Text className="text-cyan-100 text-sm text-center mt-1">
              {clinicName}
            </Text>
          </View>
          <View className="w-8" />
        </View>

        <View className="flex-row justify-between items-center px-2">
          {steps.map((step, index) => (
            <React.Fragment key={`step-${step.number}`}>
              <View className="flex-col items-center">
                <View
                  className={`w-8 h-8 rounded-full border-2 items-center justify-center ${
                    currentTab >= step.number
                      ? "bg-white border-white"
                      : "border-white/30"
                  }`}
                >
                  {step.completed ? (
                    <Feather name="check" size={14} color="#0891b2" />
                  ) : (
                    <Feather
                      name={step.icon}
                      size={14}
                      color={currentTab >= step.number ? "#0891b2" : "white"}
                    />
                  )}
                </View>
                <Text
                  className={`text-xs mt-1 font-medium ${currentTab >= step.number ? "text-white" : "text-white/60"}`}
                >
                  {step.title}
                </Text>
              </View>

              {index < steps.length - 1 && (
                <View
                  className={`flex-1 h-0.5 mx-1 ${currentTab > step.number ? "bg-white" : "bg-white/30"}`}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <View className="flex-1 px-6 py-6">{renderScreen()}</View>
    </SafeAreaView>
  );
};

export default AppointmentBookingPage;
