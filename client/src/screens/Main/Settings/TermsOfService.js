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

const TermsOfService = ({ navigation }) => {
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
              Terms of Service
            </Text>
            <Text className="text-gray-500 text-sm">
              Rules for using our platform
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
                <Feather name="file-text" size={24} color="#0891b2" />
              </View>
              <Text className="text-lg font-bold text-gray-800 ml-4">
                Welcome to Klinikahub
              </Text>
            </View>
            <Text className="text-gray-700 leading-6 text-base">
              By using our healthcare reminder and appointment management
              services, you agree to these Terms of Service. Please read them
              carefully.
            </Text>
          </View>

          {/* Account Terms */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-gray-800">
              Account Responsibilities
            </Text>

            <View className="gap-3">
              {[
                "You must be at least 18 years old to use our services",
                "You are responsible for maintaining the security of your account",
                "You must provide accurate and complete information",
                "You may not share your account credentials with others",
                "You are responsible for all activities under your account",
              ].map((term, index) => (
                <View key={index} className="flex-row items-start gap-4">
                  <View className="w-6 h-6 bg-cyan-100 rounded-full items-center justify-center mt-0.5">
                    <Feather name="user" size={14} color="#0891b2" />
                  </View>
                  <Text className="text-gray-700 flex-1 leading-6 text-base">
                    {term}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Service Usage */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-gray-800">
              Acceptable Use
            </Text>

            <View className="gap-4">
              <View className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                    <Feather name="check-circle" size={18} color="#059669" />
                  </View>
                  <Text className="font-semibold text-gray-800 text-lg">
                    You May:
                  </Text>
                </View>
                <View className="gap-2">
                  <Text className="text-gray-600">
                    • Schedule and manage healthcare appointments
                  </Text>
                  <Text className="text-gray-600">
                    • Set medication and appointment reminders
                  </Text>
                  <Text className="text-gray-600">
                    • Communicate with healthcare providers
                  </Text>
                  <Text className="text-gray-600">
                    • Access your medical records and history
                  </Text>
                </View>
              </View>

              <View className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
                    <Feather name="x-circle" size={18} color="#dc2626" />
                  </View>
                  <Text className="font-semibold text-gray-800 text-lg">
                    You May Not:
                  </Text>
                </View>
                <View className="gap-2">
                  <Text className="text-gray-600">
                    • Share false or misleading medical information
                  </Text>
                  <Text className="text-gray-600">
                    • Use the service for illegal purposes
                  </Text>
                  <Text className="text-gray-600">
                    • Attempt to hack or disrupt our services
                  </Text>
                  <Text className="text-gray-600">
                    • Violate others' privacy or intellectual property
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Medical Disclaimer */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="alert-triangle" size={24} color="#0891b2" />
              </View>
              <Text className="text-lg font-bold text-gray-800 ml-4">
                Important Medical Disclaimer
              </Text>
            </View>
            <Text className="text-gray-700 leading-6 text-base">
              Klinikahub is a healthcare management tool, not a medical service
              provider. Our app helps you manage appointments and reminders but
              does not provide medical advice, diagnosis, or treatment. Always
              consult qualified healthcare professionals for medical concerns.
            </Text>
          </View>

          {/* Payments & Fees */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-gray-800">
              Payments and Fees
            </Text>

            <View className="gap-3">
              {[
                "Basic appointment management features are free",
                "Premium features may require subscription fees",
                "All fees are clearly displayed before purchase",
                "Subscription renewals are automatic unless canceled",
                "Refund policies vary by service and jurisdiction",
              ].map((term, index) => (
                <View key={index} className="flex-row items-start gap-4">
                  <View className="w-6 h-6 bg-cyan-100 rounded-full items-center justify-center mt-0.5">
                    <Feather name="dollar-sign" size={14} color="#0891b2" />
                  </View>
                  <Text className="text-gray-700 flex-1 leading-6 text-base">
                    {term}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Termination */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="power" size={24} color="#0891b2" />
              </View>
              <Text className="text-lg font-bold text-gray-800 ml-4">
                Service Termination
              </Text>
            </View>
            <Text className="text-gray-700 leading-6 text-base">
              We reserve the right to suspend or terminate your account if you
              violate these terms. You may delete your account at any time
              through the app settings. Account deletion will remove your
              personal data in accordance with our Privacy Policy.
            </Text>
          </View>

          {/* Changes to Terms */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="refresh-cw" size={24} color="#0891b2" />
              </View>
              <Text className="text-lg font-bold text-gray-800 ml-4">
                Changes to Terms
              </Text>
            </View>
            <Text className="text-gray-700 leading-6 text-base">
              We may update these Terms of Service from time to time. We will
              notify you of significant changes through the app or email.
              Continued use of our services after changes constitutes acceptance
              of the new terms.
            </Text>
          </View>

          {/* Contact */}
          <View className="bg-gray-100 rounded-xl p-4">
            <Text className="text-gray-600 text-sm text-center">
              Questions? Contact us at legal@klinikahub.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfService;
