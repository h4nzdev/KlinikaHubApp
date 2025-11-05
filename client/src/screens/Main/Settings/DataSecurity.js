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

const DataSecurity = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
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
              Data Security
            </Text>
            <Text className="text-slate-500 text-sm">
              How we protect your information
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-6 pb-8">
          {/* Security Overview */}
          <View className="bg-green-50 rounded-2xl p-5 border border-green-200">
            <View className="flex-row items-center mb-3">
              <Feather name="shield" size={24} color="#059669" />
              <Text className="text-lg font-bold text-slate-800 ml-3">
                Our Security Commitment
              </Text>
            </View>
            <Text className="text-slate-700 leading-6">
              We implement multiple layers of security to ensure your health
              data remains confidential and protected against unauthorized
              access.
            </Text>
          </View>

          {/* Encryption */}
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-4">
              Data Encryption
            </Text>
            <View className="space-y-4">
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
                <View key={index} className="bg-slate-50 rounded-xl p-4">
                  <View className="flex-row items-center mb-2">
                    <Feather name={item.icon} size={20} color="#0891b2" />
                    <Text className="font-semibold text-slate-800 ml-3">
                      {item.title}
                    </Text>
                  </View>
                  <Text className="text-slate-600 leading-6">
                    {item.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Access Controls */}
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-4">
              Access Controls
            </Text>
            <View className="space-y-3">
              {[
                "Multi-factor authentication for staff accounts",
                "Role-based access permissions",
                "Regular access log reviews and monitoring",
                "Automatic session timeouts",
                "Failed login attempt limits",
              ].map((control, index) => (
                <View key={index} className="flex-row items-start space-x-3">
                  <Feather name="key" size={18} color="#f59e0b" />
                  <Text className="text-slate-700 flex-1 leading-6">
                    {control}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Security Measures */}
          <View className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
            <Text className="text-lg font-bold text-slate-800 mb-3">
              Security Measures
            </Text>
            <View className="space-y-4">
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
                <View key={index} className="flex-row items-start space-x-3">
                  <Feather name="check-circle" size={18} color="#3b82f6" />
                  <View className="flex-1">
                    <Text className="font-semibold text-slate-800">
                      {measure.title}
                    </Text>
                    <Text className="text-slate-600 text-sm mt-1">
                      {measure.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Compliance */}
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-4">
              Compliance & Certifications
            </Text>
            <View className="space-y-3">
              {[
                "HIPAA compliant data handling procedures",
                "GDPR compliance for international users",
                "Regular third-party security certifications",
                "Privacy by design in all development processes",
              ].map((compliance, index) => (
                <View key={index} className="bg-slate-50 rounded-xl p-4">
                  <View className="flex-row items-center">
                    <Feather name="award" size={18} color="#8b5cf6" />
                    <Text className="font-semibold text-slate-800 ml-3">
                      {compliance}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Your Role */}
          <View className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
            <Text className="text-lg font-bold text-slate-800 mb-3">
              Your Security Responsibilities
            </Text>
            <Text className="text-slate-700 leading-6 mb-3">
              While we handle server-side security, you also play a role in
              keeping your data safe:
            </Text>
            <View className="space-y-2">
              {[
                "Use strong, unique passwords",
                "Enable device security (PIN, fingerprint)",
                "Keep your app updated",
                "Log out from shared devices",
                "Be cautious of phishing attempts",
              ].map((tip, index) => (
                <View key={index} className="flex-row items-center space-x-2">
                  <Feather name="shield" size={14} color="#d97706" />
                  <Text className="text-slate-700 text-sm">{tip}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Contact Security Team */}
          <View className="bg-slate-100 rounded-xl p-4">
            <Text className="text-slate-700 text-center mb-2">
              Security concerns? Contact our security team:
            </Text>
            <Text className="text-cyan-600 font-semibold text-center">
              security@medora.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataSecurity;
