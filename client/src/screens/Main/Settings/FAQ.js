import React, { useState } from "react";
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

const FAQ = ({ navigation }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const insets = useSafeAreaInsets();

  const toggleItem = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqItems = [
    {
      id: 1,
      question: "How do I create an account?",
      answer:
        "You can create an account by clicking the 'Sign Up' button on the login screen. You'll need to provide your email address, create a password, and verify your email through a verification code we send you.",
    },
    {
      id: 2,
      question: "I forgot my password. What should I do?",
      answer:
        "Click 'Forgot Password' on the login screen. We'll send a verification code to your email that will allow you to reset your password securely.",
    },
    {
      id: 3,
      question: "How do I book an appointment?",
      answer:
        "Go to the Clinics tab, select your preferred clinic, choose a doctor, select your appointment type, pick a date and time, and confirm your booking.",
    },
    {
      id: 4,
      question: "Can I reschedule an appointment?",
      answer:
        "Yes! Go to your Appointments, tap on the appointment you want to change, and select 'Reschedule'. You can choose a new date and time that works for you.",
    },
    {
      id: 5,
      question: "How do reminder notifications work?",
      answer:
        "We send you reminders before your appointments and medication times. You can customize the reminder timing in the Reminders section of the app.",
    },
    {
      id: 6,
      question: "Can I customize reminder times?",
      answer:
        "Yes! You can set reminders for 15 minutes, 30 minutes, 1 hour, or 1 day before your appointments. Go to Reminders → Settings to adjust your preferences.",
    },
    {
      id: 7,
      question: "Is my health data secure?",
      answer:
        "Absolutely! We use end-to-end encryption and comply with healthcare data protection standards. Your data is only accessible to you and your healthcare providers.",
    },
    {
      id: 8,
      question: "The app is crashing. What should I do?",
      answer:
        "Try closing and reopening the app. If the issue persists, check for app updates in your app store. You can also try reinstalling the app (your data is safe in the cloud).",
    },
    {
      id: 9,
      question: "How do I update my app?",
      answer:
        "Updates are available through the App Store (iOS) or Google Play Store (Android). Enable automatic updates to always have the latest version.",
    },
    {
      id: 10,
      question: "Can I export my data?",
      answer:
        "Yes, you can export your health records and appointment history. Go to Settings → Data & Storage → Export Data to download your information.",
    },
  ];

  const FAQItem = ({ item }) => (
    <View className="mb-3">
      <TouchableOpacity
        onPress={() => toggleItem(item.id)}
        className="bg-white rounded-xl p-5 border border-slate-200 active:bg-slate-50"
      >
        <View className="flex-row items-start justify-between">
          <Text className="font-semibold text-slate-800 flex-1 pr-4 text-base leading-6">
            {item.question}
          </Text>
          <Feather
            name={expandedItems[item.id] ? "minus" : "plus"}
            size={20}
            color="#64748b"
            className="mt-1"
          />
        </View>
      </TouchableOpacity>

      {expandedItems[item.id] && (
        <View className="bg-slate-50 rounded-b-xl p-5 border border-slate-200 border-t-0">
          <Text className="text-slate-600 leading-6 text-base">
            {item.answer}
          </Text>
        </View>
      )}
    </View>
  );

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
            <Text className="text-xl font-bold text-slate-800">FAQ</Text>
            <Text className="text-slate-500 text-sm">
              Frequently asked questions
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-6 pb-8">
          {/* Introduction */}
          <View className="bg-slate-50 rounded-2xl p-5">
            <View className="flex-row items-center mb-3">
              <Feather name="help-circle" size={24} color="#64748b" />
              <Text className="text-lg font-semibold text-slate-800 ml-3">
                How can we help you?
              </Text>
            </View>
            <Text className="text-slate-600 leading-6">
              Find quick answers to the most common questions about using
              Klinikahub. If you don't find what you're looking for, our support
              team is ready to help.
            </Text>
          </View>

          {/* FAQ Items */}
          <View>
            <Text className="text-lg font-semibold text-slate-800 mb-4">
              Common Questions
            </Text>
            <View>
              {faqItems.map((item) => (
                <FAQItem key={item.id} item={item} />
              ))}
            </View>
          </View>

          {/* Support CTA */}
          <View className="bg-slate-100 rounded-2xl p-5">
            <View className="items-center text-center">
              <Feather name="message-circle" size={28} color="#64748b" />
              <Text className="text-slate-800 font-semibold text-lg mt-3 text-center">
                Still need help?
              </Text>
              <Text className="text-slate-600 text-center mt-2 leading-6">
                Our support team is here to assist you with any questions or
                issues.
              </Text>
              <TouchableOpacity className="bg-slate-800 rounded-xl py-3 px-6 mt-4">
                <Text className="text-white font-semibold text-base">
                  Contact Support
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQ;
