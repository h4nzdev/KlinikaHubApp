import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const AppTour = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const insets = useSafeAreaInsets();

  const tourSteps = [
    {
      title: "Welcome to KlinikaHub!",
      description:
        "Your personal healthcare companion for managing appointments, medical records, and connecting with healthcare providers.",
      icon: "heart",
      color: "#ec4899",
    },
    {
      title: "Book Appointments",
      description:
        "Schedule consultations with doctors, dentists, and specialists in just a few taps.",
      icon: "calendar",
      color: "#3b82f6",
    },
    {
      title: "Medical Records",
      description:
        "Access your health history, prescriptions, and lab results securely in one place.",
      icon: "file-text",
      color: "#10b981",
    },
    {
      title: "Find Clinics & Doctors",
      description:
        "Browse verified healthcare providers and read reviews from other patients.",
      icon: "search",
      color: "#8b5cf6",
    },
    {
      title: "Health Reminders",
      description:
        "Never miss an appointment or medication with smart reminders and notifications.",
      icon: "bell",
      color: "#f59e0b",
    },
    {
      title: "Secure & Private",
      description:
        "Your health data is encrypted and protected with the highest security standards.",
      icon: "shield",
      color: "#06b6d4",
    },
  ];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = tourSteps[currentStep];
  const progress = (currentStep + 1) / tourSteps.length;

  // ✅ Safe fallback if insets are not available
  const safeBottom = insets.bottom > 0 ? insets.bottom : 20;
  const safeTop = insets.top > 0 ? insets.top : 40;

  return (
    <View
      className="flex-1 bg-white"
      style={{
        paddingTop: safeTop,
        paddingBottom: safeBottom,
      }}
    >
      {/* Header */}
      <View className="px-6 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-cyan-500 items-center justify-center">
              <Feather name="activity" size={20} color="#ffffff" />
            </View>
            <Text className="ml-3 text-xl font-bold text-gray-800">
              KlinikaHub
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSkip}
            className="px-4 py-2 rounded-full bg-gray-100"
          >
            <Text className="text-gray-600 font-medium">Skip</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 justify-center">
          {/* Icon */}
          <View className="items-center mb-8">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: `${currentStepData.color}15` }}
            >
              <Feather
                name={currentStepData.icon}
                size={40}
                color={currentStepData.color}
              />
            </View>
          </View>

          {/* Progress */}
          <View className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <View
              className="h-2 rounded-full"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: currentStepData.color,
              }}
            />
          </View>

          {/* Text Content */}
          <View className="items-center mb-12">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4">
              {currentStepData.title}
            </Text>
            <Text className="text-base text-center text-gray-600 leading-6">
              {currentStepData.description}
            </Text>
          </View>

          {/* Step Indicators */}
          <View className="flex-row justify-center gap-2 mb-8">
            {tourSteps.map((_, index) => (
              <View
                key={index}
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor:
                    currentStep === index ? currentStepData.color : "#e5e7eb",
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Navigation */}
      <View className="px-6 pb-4 pt-4 bg-white border-t border-gray-100">
        <View className="flex-row justify-between items-center">
          {/* Previous Button */}
          {currentStep > 0 ? (
            <TouchableOpacity
              onPress={prevStep}
              className="flex-row items-center py-3 px-6 rounded-xl border border-gray-300"
            >
              <Feather name="chevron-left" size={20} color="#6b7280" />
              <Text className="text-gray-600 font-medium ml-2">Back</Text>
            </TouchableOpacity>
          ) : (
            <View className="w-20" /> // Spacer for alignment
          )}

          {/* Step Counter */}
          <Text className="text-gray-500 font-medium">
            {currentStep + 1} / {tourSteps.length}
          </Text>

          {/* Next Button */}
          <TouchableOpacity
            onPress={nextStep}
            className="flex-row items-center py-3 px-6 rounded-xl"
            style={{ backgroundColor: currentStepData.color }}
          >
            <Text className="text-white font-medium mr-2">
              {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
            </Text>
            <Feather
              name={
                currentStep === tourSteps.length - 1 ? "check" : "chevron-right"
              }
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AppTour;
