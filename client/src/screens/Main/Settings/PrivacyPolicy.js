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
              Privacy Policy
            </Text>
            <Text className="text-slate-500 text-sm">
              How we protect your data
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
          <View className="bg-cyan-50 rounded-2xl p-5 border border-cyan-200">
            <View className="flex-row items-center mb-3">
              <Feather name="shield" size={24} color="#0891b2" />
              <Text className="text-lg font-bold text-slate-800 ml-3">
                Your Privacy Matters
              </Text>
            </View>
            <Text className="text-slate-700 leading-6">
              At Medora, we are committed to protecting your personal health
              information and ensuring your privacy. This policy explains how we
              collect, use, and safeguard your data.
            </Text>
          </View>

          {/* Information We Collect */}
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-4">
              Information We Collect
            </Text>
            <View className="space-y-4">
              <View className="bg-slate-50 rounded-xl p-4">
                <Text className="font-semibold text-slate-800 mb-2">
                  Personal Information
                </Text>
                <Text className="text-slate-600 leading-6">
                  • Name, email address, phone number{"\n"}• Date of birth and
                  gender{"\n"}• Emergency contact information{"\n"}• Profile
                  photo (optional)
                </Text>
              </View>

              <View className="bg-slate-50 rounded-xl p-4">
                <Text className="font-semibold text-slate-800 mb-2">
                  Health Information
                </Text>
                <Text className="text-slate-600 leading-6">
                  • Appointment details and medical history{"\n"}• Doctor
                  consultations and prescriptions{"\n"}• Medication reminders
                  and health notes{"\n"}• Clinic visit records
                </Text>
              </View>

              <View className="bg-slate-50 rounded-xl p-4">
                <Text className="font-semibold text-slate-800 mb-2">
                  Technical Information
                </Text>
                <Text className="text-slate-600 leading-6">
                  • Device information and app usage data{"\n"}• IP address and
                  location data{"\n"}• App crash reports and performance data
                </Text>
              </View>
            </View>
          </View>

          {/* How We Use Your Information */}
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-4">
              How We Use Your Information
            </Text>
            <View className="space-y-3">
              {[
                "Provide and manage your healthcare appointments",
                "Send appointment reminders and notifications",
                "Enable communication with healthcare providers",
                "Improve our app features and user experience",
                "Ensure the security and integrity of our services",
                "Comply with legal obligations and regulations",
              ].map((use, index) => (
                <View key={index} className="flex-row items-start space-x-3">
                  <Feather name="check-circle" size={18} color="#10b981" />
                  <Text className="text-slate-700 flex-1 leading-6">{use}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Data Security */}
          <View className="bg-green-50 rounded-2xl p-5 border border-green-200">
            <View className="flex-row items-center mb-3">
              <Feather name="lock" size={24} color="#059669" />
              <Text className="text-lg font-bold text-slate-800 ml-3">
                Data Security
              </Text>
            </View>
            <Text className="text-slate-700 leading-6 mb-3">
              We implement industry-standard security measures to protect your
              data:
            </Text>
            <View className="space-y-2">
              {[
                "End-to-end encryption for all sensitive data",
                "Secure cloud storage with regular backups",
                "Access controls and authentication protocols",
                "Regular security audits and vulnerability testing",
              ].map((security, index) => (
                <View key={index} className="flex-row items-center space-x-2">
                  <Feather name="shield" size={16} color="#059669" />
                  <Text className="text-slate-700 text-sm">{security}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Your Rights */}
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-4">
              Your Rights
            </Text>
            <View className="space-y-4">
              {[
                {
                  title: "Access Your Data",
                  description:
                    "Request a copy of all personal information we hold about you",
                },
                {
                  title: "Data Correction",
                  description:
                    "Update or correct any inaccurate personal information",
                },
                {
                  title: "Data Deletion",
                  description:
                    "Request deletion of your personal data under certain conditions",
                },
                {
                  title: "Opt-Out",
                  description:
                    "Opt-out of non-essential communications and data processing",
                },
              ].map((right, index) => (
                <View key={index} className="bg-slate-50 rounded-xl p-4">
                  <Text className="font-semibold text-slate-800 mb-2">
                    {right.title}
                  </Text>
                  <Text className="text-slate-600 leading-6">
                    {right.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Contact Information */}
          <View className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
            <Text className="text-lg font-bold text-slate-800 mb-3">
              Contact Us
            </Text>
            <Text className="text-slate-700 leading-6 mb-4">
              If you have any questions about this Privacy Policy or how we
              handle your data, please contact our Data Protection Officer:
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center space-x-3">
                <Feather name="mail" size={16} color="#3b82f6" />
                <Text className="text-slate-700">privacy@medora.com</Text>
              </View>
              <View className="flex-row items-center space-x-3">
                <Feather name="phone" size={16} color="#3b82f6" />
                <Text className="text-slate-700">+1 (555) 123-HELP</Text>
              </View>
            </View>
          </View>

          {/* Last Updated */}
          <View className="bg-slate-100 rounded-xl p-4">
            <Text className="text-slate-600 text-sm text-center">
              Last updated: {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
