import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import patientAuthServices from "../../services/patientAuthServices";

const VerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get registration data from previous screen
  const { formData } = route.params;

  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(true); // Set to true since we just sent it

  const codeInputRef = useRef(null);

  const handleCodeInput = (text) => {
    // Only allow digits and limit to 6 characters
    const cleanedText = text.replace(/[^0-9]/g, "").slice(0, 6);
    setVerificationCode(cleanedText);
  };

  const handleVerifyAndRegister = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    try {
      const { confirmPassword, agreeToTerms, ...registrationData } = formData;

      const result = await patientAuthServices.verifyAndRegister(
        formData.email,
        verificationCode,
        registrationData
      );

      Alert.alert("Success!", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        error.message || "Invalid code or registration failed"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsSendingCode(true);
    try {
      await patientAuthServices.resendVerificationCode(formData.email);
      Alert.alert("Success", "New code sent to your email!");
      setVerificationCode(""); // Clear the input
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to resend code");
    } finally {
      setIsSendingCode(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 p-6 justify-center">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="flex-row items-center gap-2 mb-6 self-start"
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color="#475569" />
              <Text className="text-slate-600 font-medium">Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <View className="items-center mb-8">
              <View className="bg-cyan-100 p-4 rounded-2xl mb-4">
                <Feather name="mail" size={32} color="#0891b2" />
              </View>
              <Text className="text-3xl font-bold text-slate-800 text-center mb-2">
                Verify Your Email
              </Text>
              <Text className="text-slate-600 text-center text-base">
                Enter the 6-digit code sent to
              </Text>
              <Text className="text-cyan-600 font-semibold text-center text-lg">
                {formData.email}
              </Text>
            </View>

            {/* Code Input */}
            <View className="mb-8">
              <Text className="text-sm font-medium text-slate-700 mb-4 text-center">
                Verification Code
              </Text>

              <Pressable
                onPress={() => codeInputRef.current?.focus()}
                className="relative h-16 mb-4"
              >
                {/* Visual representation of 6 boxes */}
                <View className="flex-row justify-between gap-2 absolute inset-0 pointer-events-none z-10">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <View
                      key={index}
                      className={`flex-1 h-full border-2 rounded-xl bg-white items-center justify-center ${
                        verificationCode.length === index
                          ? "border-cyan-600 bg-cyan-50"
                          : verificationCode.length > index
                            ? "border-cyan-400 bg-cyan-50"
                            : "border-slate-300"
                      }`}
                    >
                      <Text className="text-xl font-bold text-slate-800">
                        {verificationCode[index] || ""}
                      </Text>
                    </View>
                  ))}
                </View>

                <TextInput
                  ref={codeInputRef}
                  value={verificationCode}
                  onChangeText={handleCodeInput}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                  returnKeyType="done"
                  blurOnSubmit={false}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.01,
                    color: "transparent",
                    fontSize: 1,
                  }}
                />
              </Pressable>

              <Text className="text-slate-500 text-center text-sm">
                {verificationCode.length}/6 digits entered
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="gap-4">
              <TouchableOpacity
                onPress={handleVerifyAndRegister}
                disabled={isVerifying || verificationCode.length !== 6}
                className={`py-4 rounded-2xl ${
                  isVerifying || verificationCode.length !== 6
                    ? "bg-slate-400"
                    : "bg-cyan-600"
                }`}
              >
                <Text className="text-white font-bold text-center text-lg">
                  {isVerifying ? "Verifying..." : "Verify & Create Account"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isSendingCode}
                className={`py-4 rounded-2xl border ${
                  isSendingCode ? "border-slate-300" : "border-cyan-600"
                }`}
              >
                <Text
                  className={`text-center font-semibold text-lg ${
                    isSendingCode ? "text-slate-500" : "text-cyan-600"
                  }`}
                >
                  {isSendingCode ? "Sending Code..." : "Resend Code"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Status indicator */}
            {codeSent && (
              <View className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <Text className="text-emerald-700 text-center text-base">
                  ✅ Verification code sent! Check your email inbox and spam
                  folder.
                </Text>
              </View>
            )}

            {/* Help Text */}
            <View className="mt-8 p-4 bg-slate-50 rounded-xl">
              <Text className="text-slate-600 text-center text-sm">
                Didn't receive the code? Check your spam folder or tap "Resend
                Code" to send a new one.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerificationScreen;
