import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PrivacyPolicy = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Feather name="chevron-left" size={28} color="#0891b2" />
          </TouchableOpacity>
          <View className="flex-1 ml-3">
            <Text className="text-xl font-bold text-gray-800">
              Privacy Policy
            </Text>
            <Text className="text-gray-500 text-sm">
              How we protect your data
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 24 }}
      >
        <View className="gap-6 pb-8">
          {/* Introduction */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="shield" size={24} color="#0891b2" />
              </View>
              <Text className="text-lg font-bold text-gray-800 ml-4">
                Your Privacy Matters
              </Text>
            </View>
            <Text className="text-gray-700 leading-6 text-base">
              At Klinikahub, we are committed to protecting your personal health
              information and ensuring your privacy. This policy explains how we
              collect, use, and safeguard your data.
            </Text>
          </View>

          {/* Information We Collect */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-gray-800">
              Information We Collect
            </Text>

            <View className="gap-4">
              <View className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 bg-cyan-100 rounded-full items-center justify-center">
                    <Feather name="user" size={18} color="#0891b2" />
                  </View>
                  <Text className="font-semibold text-gray-800 text-lg">
                    Personal Information
                  </Text>
                </View>
                <View className="gap-2">
                  <Text className="text-gray-600">
                    • Name, email address, phone number
                  </Text>
                  <Text className="text-gray-600">
                    • Date of birth and gender
                  </Text>
                  <Text className="text-gray-600">
                    • Emergency contact information
                  </Text>
                  <Text className="text-gray-600">
                    • Profile photo (optional)
                  </Text>
                </View>
              </View>

              <View className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 bg-cyan-100 rounded-full items-center justify-center">
                    <Feather name="heart" size={18} color="#0891b2" />
                  </View>
                  <Text className="font-semibold text-gray-800 text-lg">
                    Health Information
                  </Text>
                </View>
                <View className="gap-2">
                  <Text className="text-gray-600">
                    • Appointment details and medical history
                  </Text>
                  <Text className="text-gray-600">
                    • Doctor consultations and prescriptions
                  </Text>
                  <Text className="text-gray-600">
                    • Medication reminders and health notes
                  </Text>
                  <Text className="text-gray-600">• Clinic visit records</Text>
                </View>
              </View>

              <View className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 bg-cyan-100 rounded-full items-center justify-center">
                    <Feather name="smartphone" size={18} color="#0891b2" />
                  </View>
                  <Text className="font-semibold text-gray-800 text-lg">
                    Technical Information
                  </Text>
                </View>
                <View className="gap-2">
                  <Text className="text-gray-600">
                    • Device information and app usage data
                  </Text>
                  <Text className="text-gray-600">
                    • IP address and location data
                  </Text>
                  <Text className="text-gray-600">
                    • App crash reports and performance data
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* How We Use Your Information */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-gray-800">
              How We Use Your Information
            </Text>

            <View className="gap-3">
              {[
                "Provide and manage your healthcare appointments",
                "Send appointment reminders and notifications",
                "Enable communication with healthcare providers",
                "Improve our app features and user experience",
                "Ensure the security and integrity of our services",
                "Comply with legal obligations and regulations",
              ].map((use, index) => (
                <View key={index} className="flex-row items-start gap-4">
                  <View className="w-6 h-6 bg-cyan-100 rounded-full items-center justify-center mt-0.5">
                    <Feather name="check" size={14} color="#0891b2" />
                  </View>
                  <Text className="text-gray-700 flex-1 leading-6 text-base">
                    {use}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Data Security */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="lock" size={24} color="#0891b2" />
              </View>
              <Text className="text-lg font-bold text-gray-800 ml-4">
                Data Security
              </Text>
            </View>
            <Text className="text-gray-700 leading-6 text-base mb-4">
              We implement industry-standard security measures to protect your
              data:
            </Text>
            <View className="gap-3">
              {[
                "End-to-end encryption for all sensitive data",
                "Secure cloud storage with regular backups",
                "Access controls and authentication protocols",
                "Regular security audits and vulnerability testing",
              ].map((security, index) => (
                <View key={index} className="flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-cyan-100 rounded-full items-center justify-center">
                    <Feather name="shield" size={16} color="#0891b2" />
                  </View>
                  <Text className="text-gray-700 text-base flex-1">
                    {security}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Your Rights */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-gray-800">Your Rights</Text>

            <View className="gap-4">
              {[
                {
                  title: "Access Your Data",
                  description:
                    "Request a copy of all personal information we hold about you",
                  icon: "download",
                },
                {
                  title: "Data Correction",
                  description:
                    "Update or correct any inaccurate personal information",
                  icon: "edit",
                },
                {
                  title: "Data Deletion",
                  description:
                    "Request deletion of your personal data under certain conditions",
                  icon: "trash-2",
                },
                {
                  title: "Opt-Out",
                  description:
                    "Opt-out of non-essential communications and data processing",
                  icon: "bell-off",
                },
              ].map((right, index) => (
                <View
                  key={index}
                  className="bg-gray-50 rounded-xl p-5 border border-gray-200"
                >
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="w-10 h-10 bg-cyan-100 rounded-full items-center justify-center">
                      <Feather name={right.icon} size={18} color="#0891b2" />
                    </View>
                    <Text className="font-semibold text-gray-800 text-lg">
                      {right.title}
                    </Text>
                  </View>
                  <Text className="text-gray-600 leading-6 text-base">
                    {right.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Contact Information */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="mail" size={24} color="#0891b2" />
              </View>
              <Text className="text-lg font-bold text-gray-800 ml-4">
                Contact Us
              </Text>
            </View>
            <Text className="text-gray-700 leading-6 text-base mb-4">
              If you have any questions about this Privacy Policy or how we
              handle your data, please contact our Data Protection Officer:
            </Text>
            <View className="gap-3">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-cyan-100 rounded-full items-center justify-center">
                  <Feather name="mail" size={18} color="#0891b2" />
                </View>
                <Text className="text-gray-700 text-base">
                  privacy@klinikahub.com
                </Text>
              </View>
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-cyan-100 rounded-full items-center justify-center">
                  <Feather name="phone" size={18} color="#0891b2" />
                </View>
                <Text className="text-gray-700 text-base">
                  +1 (555) 123-HELP
                </Text>
              </View>
            </View>
          </View>

          {/* Last Updated */}
          <View className="bg-gray-100 rounded-xl p-4">
            <Text className="text-gray-600 text-sm text-center">
              Last updated: {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
