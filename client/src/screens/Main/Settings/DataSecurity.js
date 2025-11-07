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

const DataSecurity = ({ navigation }) => {
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
              Data Security
            </Text>
            <Text className="text-gray-500 text-sm">
              How we protect your information
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
          {/* Security Overview */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="shield" size={24} color="#0891b2" />
              </View>
              <Text className="text-lg font-bold text-gray-800 ml-4">
                Our Security Commitment
              </Text>
            </View>
            <Text className="text-gray-700 leading-6 text-base">
              We implement multiple layers of security to ensure your health
              data remains confidential and protected against unauthorized
              access.
            </Text>
          </View>

          {/* Encryption */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-gray-800">
              Data Encryption
            </Text>

            <View className="gap-4">
              {[
                {
                  title: "End-to-End Encryption",
                  description:
                    "All sensitive data is encrypted in transit and at rest",
                  icon: "lock",
                },
                {
                  title: "TLS/SSL Protection",
                  description:
                    "Secure communication channels between app and servers",
                  icon: "wifi",
                },
                {
                  title: "Database Encryption",
                  description:
                    "Patient records encrypted with AES-256 encryption",
                  icon: "database",
                },
              ].map((item, index) => (
                <View
                  key={index}
                  className="bg-gray-50 rounded-xl p-5 border border-gray-200"
                >
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="w-10 h-10 bg-cyan-100 rounded-full items-center justify-center">
                      <Feather name={item.icon} size={18} color="#0891b2" />
                    </View>
                    <Text className="font-semibold text-gray-800 text-lg">
                      {item.title}
                    </Text>
                  </View>
                  <Text className="text-gray-600 leading-6 text-base">
                    {item.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Access Controls */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-gray-800">
              Access Controls
            </Text>

            <View className="gap-3">
              {[
                "Multi-factor authentication for staff accounts",
                "Role-based access permissions",
                "Regular access log reviews and monitoring",
                "Automatic session timeouts",
                "Failed login attempt limits",
              ].map((control, index) => (
                <View key={index} className="flex-row items-start gap-4">
                  <View className="w-6 h-6 bg-cyan-100 rounded-full items-center justify-center mt-0.5">
                    <Feather name="key" size={14} color="#0891b2" />
                  </View>
                  <Text className="text-gray-700 flex-1 leading-6 text-base">
                    {control}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Security Measures */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="check-circle" size={24} color="#0891b2" />
              </View>
              <Text className="text-lg font-bold text-gray-800 ml-4">
                Security Measures
              </Text>
            </View>

            <View className="gap-4">
              {[
                {
                  title: "Regular Security Audits",
                  description:
                    "Comprehensive security assessments every quarter",
                },
                {
                  title: "Vulnerability Testing",
                  description:
                    "Continuous penetration testing and vulnerability scans",
                },
                {
                  title: "Incident Response Plan",
                  description:
                    "Established protocols for security incident handling",
                },
                {
                  title: "Data Backup & Recovery",
                  description:
                    "Regular encrypted backups with disaster recovery plans",
                },
              ].map((measure, index) => (
                <View key={index} className="flex-row items-start gap-4">
                  <View className="w-8 h-8 bg-cyan-100 rounded-full items-center justify-center mt-0.5">
                    <Feather name="shield" size={16} color="#0891b2" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800 text-base">
                      {measure.title}
                    </Text>
                    <Text className="text-gray-600 text-sm mt-1 leading-5">
                      {measure.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Compliance */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-gray-800">
              Compliance & Certifications
            </Text>

            <View className="gap-3">
              {[
                "HIPAA compliant data handling procedures",
                "GDPR compliance for international users",
                "Regular third-party security certifications",
                "Privacy by design in all development processes",
              ].map((compliance, index) => (
                <View
                  key={index}
                  className="bg-gray-50 rounded-xl p-5 border border-gray-200"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-cyan-100 rounded-full items-center justify-center">
                      <Feather name="award" size={18} color="#0891b2" />
                    </View>
                    <Text className="font-semibold text-gray-800 text-lg">
                      {compliance}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Your Role */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-cyan-100 rounded-full items-center justify-center">
                <Feather name="user-check" size={24} color="#0891b2" />
              </View>
              <Text className="text-lg font-bold text-gray-800 ml-4">
                Your Security Responsibilities
              </Text>
            </View>

            <Text className="text-gray-700 leading-6 text-base mb-4">
              While we handle server-side security, you also play a role in
              keeping your data safe:
            </Text>

            <View className="gap-3">
              {[
                "Use strong, unique passwords",
                "Enable device security (PIN, fingerprint)",
                "Keep your app updated",
                "Log out from shared devices",
                "Be cautious of phishing attempts",
              ].map((tip, index) => (
                <View key={index} className="flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-cyan-100 rounded-full items-center justify-center">
                    <Feather name="shield" size={16} color="#0891b2" />
                  </View>
                  <Text className="text-gray-700 text-base flex-1">{tip}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Contact Security Team */}
          <View className="bg-gray-100 rounded-xl p-4">
            <Text className="text-gray-600 text-sm text-center mb-2">
              Security concerns? Contact our security team:
            </Text>
            <Text className="text-cyan-600 font-semibold text-center text-base">
              security@klinikahub.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataSecurity;
