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
      <View className="px-4 py-3 border-b border-slate-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Feather name="chevron-left" size={28} color="#0891b2" />
          </TouchableOpacity>
          <View className="flex-1 ml-3">
            <Text className="text-xl font-bold text-slate-800">
              Terms of Service
            </Text>
            <Text className="text-slate-500 text-sm">
              Rules for using our platform
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-6 pb-8">
          {/* Introduction */}
          <View className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
            <Text className="text-lg font-bold text-slate-800 mb-3">
              Welcome to Medora
            </Text>
            <Text className="text-slate-700 leading-6">
              By using our healthcare reminder and appointment management
              services, you agree to these Terms of Service. Please read them
              carefully.
            </Text>
          </View>

          {/* Account Terms */}
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-4">
              Account Responsibilities
            </Text>
            <View className="space-y-3">
              {[
                "You must be at least 18 years old to use our services",
                "You are responsible for maintaining the security of your account",
                "You must provide accurate and complete information",
                "You may not share your account credentials with others",
                "You are responsible for all activities under your account",
              ].map((term, index) => (
                <View key={index} className="flex-row items-start space-x-3">
                  <Feather name="user" size={18} color="#f59e0b" />
                  <Text className="text-slate-700 flex-1 leading-6">
                    {term}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Service Usage */}
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-4">
              Acceptable Use
            </Text>
            <View className="space-y-4">
              <View className="bg-slate-50 rounded-xl p-4">
                <Text className="font-semibold text-green-600 mb-2">
                  You May:
                </Text>
                <Text className="text-slate-600 leading-6">
                  • Schedule and manage healthcare appointments{"\n"}• Set
                  medication and appointment reminders{"\n"}• Communicate with
                  healthcare providers{"\n"}• Access your medical records and
                  history
                </Text>
              </View>

              <View className="bg-slate-50 rounded-xl p-4">
                <Text className="font-semibold text-red-600 mb-2">
                  You May Not:
                </Text>
                <Text className="text-slate-600 leading-6">
                  • Share false or misleading medical information{"\n"}• Use the
                  service for illegal purposes{"\n"}• Attempt to hack or disrupt
                  our services{"\n"}• Violate others' privacy or intellectual
                  property
                </Text>
              </View>
            </View>
          </View>

          {/* Medical Disclaimer */}
          <View className="bg-red-50 rounded-2xl p-5 border border-red-200">
            <View className="flex-row items-center mb-3">
              <Feather name="alert-triangle" size={24} color="#dc2626" />
              <Text className="text-lg font-bold text-slate-800 ml-3">
                Important Medical Disclaimer
              </Text>
            </View>
            <Text className="text-slate-700 leading-6">
              Medora is a healthcare management tool, not a medical service
              provider. Our app helps you manage appointments and reminders but
              does not provide medical advice, diagnosis, or treatment. Always
              consult qualified healthcare professionals for medical concerns.
            </Text>
          </View>

          {/* Payments & Fees */}
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-4">
              Payments and Fees
            </Text>
            <View className="space-y-3">
              {[
                "Basic appointment management features are free",
                "Premium features may require subscription fees",
                "All fees are clearly displayed before purchase",
                "Subscription renewals are automatic unless canceled",
                "Refund policies vary by service and jurisdiction",
              ].map((term, index) => (
                <View key={index} className="flex-row items-start space-x-3">
                  <Feather name="dollar-sign" size={18} color="#059669" />
                  <Text className="text-slate-700 flex-1 leading-6">
                    {term}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Termination */}
          <View className="bg-slate-100 rounded-2xl p-5">
            <Text className="text-lg font-bold text-slate-800 mb-3">
              Service Termination
            </Text>
            <Text className="text-slate-700 leading-6">
              We reserve the right to suspend or terminate your account if you
              violate these terms. You may delete your account at any time
              through the app settings. Account deletion will remove your
              personal data in accordance with our Privacy Policy.
            </Text>
          </View>

          {/* Changes to Terms */}
          <View className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
            <Text className="text-lg font-bold text-slate-800 mb-3">
              Changes to Terms
            </Text>
            <Text className="text-slate-700 leading-6">
              We may update these Terms of Service from time to time. We will
              notify you of significant changes through the app or email.
              Continued use of our services after changes constitutes acceptance
              of the new terms.
            </Text>
          </View>

          {/* Contact */}
          <View className="bg-slate-100 rounded-xl p-4">
            <Text className="text-slate-600 text-sm text-center">
              Questions? Contact us at legal@medora.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfService;
