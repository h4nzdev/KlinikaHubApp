"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const AppTour = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  const tourSteps = [
    {
      title: "Welcome to KlinikaHub!",
      description:
        "Your personal healthcare companion for a stress-free wellness journey. Let's get you started!",
      icon: "heart",
      color: "#ec4899",
      bgColor: "#fdf2f8",
      gradient: ["#ec4899", "#db2777"],
    },
    {
      title: "Your Health Dashboard",
      description:
        "Everything you need in one place - appointments, health reminders, and quick access to all services.",
      icon: "home",
      color: "#3b82f6",
      bgColor: "#eff6ff",
      gradient: ["#3b82f6", "#2563eb"],
    },
    {
      title: "Book Appointments",
      description:
        "Schedule checkups, consultations, or urgent care visits right from your phone in just a few taps.",
      icon: "calendar",
      color: "#10b981",
      bgColor: "#f0fdf4",
      gradient: ["#10b981", "#059669"],
    },
    {
      title: "Find Your Doctor",
      description:
        "Browse qualified healthcare professionals, read reviews, and find the perfect match for your needs.",
      icon: "user",
      color: "#8b5cf6",
      bgColor: "#faf5ff",
      gradient: ["#8b5cf6", "#7c3aed"],
    },
    {
      title: "Flexible Scheduling",
      description:
        "Choose between in-person visits or video consultations with instant confirmation and reminders.",
      icon: "clock",
      color: "#f59e0b",
      bgColor: "#fffbeb",
      gradient: ["#f59e0b", "#d97706"],
    },
    {
      title: "Stay Connected",
      description:
        "Get reminders, test results, and health tips while securely communicating with your care team.",
      icon: "bell",
      color: "#06b6d4",
      bgColor: "#f0fdff",
      gradient: ["#06b6d4", "#0891b2"],
    },
    {
      title: "Ready to Thrive!",
      description:
        "You're all set! Take control of your health journey with KlinikaHub by your side.",
      icon: "check-circle",
      color: "#22c55e",
      bgColor: "#f0fdf4",
      gradient: ["#22c55e", "#16a34a"],
    },
  ];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
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

  const currentTourStep = tourSteps[currentStep];
  const progress = (currentStep + 1) / tourSteps.length;

  return (
    <View className="flex-1 bg-white">
      {/* Background Gradient */}
      <View
        className="absolute top-0 left-0 right-0 h-2/3"
        style={{
          backgroundColor: currentTourStep.bgColor,
        }}
      />

      {/* Content */}
      <View className="flex-1 pt-16 px-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-12">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center">
              <Feather
                name="activity"
                size={20}
                color={currentTourStep.color}
              />
            </View>
            <Text className="ml-3 text-xl font-bold text-gray-800">
              KlinikaHub
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSkip}
            className="px-4 py-2 rounded-full bg-white/80"
          >
            <Text className="text-gray-600 font-medium">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center items-center">
          {/* Icon Circle */}
          <View
            className="w-32 h-32 rounded-full items-center justify-center mb-8 shadow-2xl"
            style={{
              backgroundColor: currentTourStep.bgColor,
              shadowColor: currentTourStep.color,
            }}
          >
            <View
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ backgroundColor: currentTourStep.color + "20" }}
            >
              <Feather
                name={currentTourStep.icon}
                size={40}
                color={currentTourStep.color}
                strokeWidth={2}
              />
            </View>
          </View>

          {/* Progress Bar */}
          <View className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <View
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: currentTourStep.color,
              }}
            />
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-center text-gray-800 mb-4 leading-tight">
            {currentTourStep.title}
          </Text>

          {/* Description */}
          <Text className="text-lg text-center text-gray-600 leading-7 mb-12 px-4">
            {currentTourStep.description}
          </Text>

          {/* Step Dots */}
          <View className="flex-row gap-2 mb-18">
            {tourSteps.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentStep(index)}
                className="rounded-full transition-all"
                style={{
                  width: currentStep === index ? 24 : 8,
                  height: 8,
                  backgroundColor:
                    currentStep === index
                      ? currentTourStep.color
                      : index < currentStep
                        ? currentTourStep.color + "80"
                        : "#e5e7eb",
                }}
              />
            ))}
          </View>
        </View>

        {/* Navigation Buttons */}
        <View className="pb-16">
          <View className="flex-row justify-between items-center">
            {/* Previous Button */}
            {currentStep > 0 && (
              <TouchableOpacity
                onPress={prevStep}
                className="flex-row items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white border border-gray-200 shadow-sm"
              >
                <Feather name="chevron-left" size={20} color="#6b7280" />
                <Text className="text-gray-600 font-semibold">Back</Text>
              </TouchableOpacity>
            )}

            {/* Spacer */}
            <View className="flex-1" />

            {/* Next/Get Started Button */}
            {currentStep < tourSteps.length - 1 ? (
              <TouchableOpacity
                onPress={nextStep}
                className="flex-row items-center justify-center gap-3 py-4 px-8 rounded-2xl shadow-lg"
                style={{
                  backgroundColor: currentTourStep.color,
                  shadowColor: currentTourStep.color,
                }}
              >
                <Text className="text-white font-semibold text-lg">Next</Text>
                <Feather name="chevron-right" size={20} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleFinish}
                className="flex-row items-center justify-center gap-3 py-4 px-8 rounded-2xl shadow-lg"
                style={{
                  backgroundColor: "#10b981",
                  shadowColor: "#10b981",
                }}
              >
                <Feather name="check-circle" size={20} color="white" />
                <Text className="text-white font-semibold text-lg">
                  Get Started
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Step Counter */}
          <Text className="text-center text-gray-500 font-medium mt-4">
            {currentStep + 1} of {tourSteps.length}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AppTour;
