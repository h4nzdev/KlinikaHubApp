// components/ChangePasswordModal.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import passwordServices from "../services/passwordServices";
import { AuthenticationContext } from "../context/AuthenticationContext"; // Add this import

const ChangePasswordModal = ({ visible, onClose }) => {
  const { user } = useContext(AuthenticationContext); // Get user from context
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation rules
  const passwordValidation = {
    length: newPassword.length >= 6,
    firstLetterUppercase: /^[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    specialChar: /[!@#$%^&*]/.test(newPassword),
  };

  const allPasswordRequirementsMet =
    Object.values(passwordValidation).every(Boolean);

  // ✅ REAL: Step 1 - Send verification code
  const handleStep1Submit = async () => {
    if (!currentPassword) {
      Alert.alert("Error", "Please enter your current password");
      return;
    }

    setIsLoading(true);
    try {
      // Use REAL service
      await passwordServices.sendPasswordChangeVerification(
        user.email, // Use actual user email
        currentPassword
      );

      Alert.alert("Success", "Verification code sent to your email! 📧");
      setStep(2);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ REAL: Step 2 - Change password
  const handleStep2Submit = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match!");
      return;
    }

    if (!allPasswordRequirementsMet) {
      Alert.alert("Error", "Password does not meet all requirements!");
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      // Use REAL service
      await passwordServices.verifyAndChangePassword(
        user.email, // Use actual user email
        verificationCode,
        currentPassword,
        newPassword
      );

      Alert.alert("Success", "Password changed successfully! 🎉");
      handleClose();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setVerificationCode("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const ValidationItem = ({ isValid, text }) => (
    <View
      className={`flex-row items-center space-x-2 ${isValid ? "text-green-600" : "text-red-500"}`}
    >
      <Feather
        name={isValid ? "check-circle" : "x-circle"}
        size={16}
        color={isValid ? "#10b981" : "#ef4444"}
      />
      <Text
        className={`text-sm ${isValid ? "text-green-600" : "text-red-500"}`}
      >
        {text}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 60}
      >
        <View className="flex-1 justify-center bg-black/50 p-4">
          <View className="bg-white rounded-2xl p-6 mx-4">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-800">
                {step === 1 ? "Verify Current Password" : "Change Password"}
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Progress Steps */}
            <View className="flex-row items-center justify-between mb-6">
              {[1, 2].map((stepNumber) => (
                <View key={stepNumber} className="flex-row items-center">
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      step >= stepNumber ? "bg-cyan-500" : "bg-slate-200"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        step >= stepNumber ? "text-white" : "text-slate-600"
                      }`}
                    >
                      {stepNumber}
                    </Text>
                  </View>
                  {stepNumber < 2 && (
                    <View
                      className={`w-12 h-1 mx-2 ${
                        step > stepNumber ? "bg-cyan-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Step 1: Current Password */}
            {step === 1 && (
              <View className="space-y-4">
                <Text className="text-slate-600 text-sm mb-4">
                  For security, we need to verify your current password first.
                </Text>

                <View>
                  <Text className="text-sm font-medium text-slate-700 mb-2">
                    Current Password
                  </Text>
                  <View className="relative">
                    <TextInput
                      secureTextEntry={!showCurrentPassword}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      placeholder="Enter current password"
                      placeholderTextColor="#9CA3AF"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 pr-12"
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-3"
                    >
                      <Feather
                        name={showCurrentPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#64748b"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-row gap-3 pt-4">
                  <TouchableOpacity
                    onPress={handleClose}
                    className="flex-1 py-3 border border-slate-300 rounded-xl items-center"
                  >
                    <Text className="text-slate-700 font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleStep1Submit}
                    disabled={isLoading || !currentPassword}
                    className={`flex-1 py-3 rounded-xl items-center ${
                      isLoading || !currentPassword
                        ? "bg-cyan-300"
                        : "bg-cyan-500"
                    }`}
                  >
                    <Text className="text-white font-medium">
                      {isLoading ? "Sending..." : "Send Code"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 2: New Password & Verification */}
            {step === 2 && (
              <View className="space-y-4">
                <Text className="text-slate-600 text-sm mb-4">
                  We sent a verification code to {user.email}. Enter it below
                  along with your new password.
                </Text>

                {/* Verification Code */}
                <View>
                  <Text className="text-sm font-medium text-slate-700 mb-2">
                    Verification Code
                  </Text>
                  <TextInput
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    keyboardType="number-pad"
                    placeholderTextColor="#9CA3AF"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-center text-lg"
                  />
                </View>

                {/* New Password */}
                <View>
                  <Text className="text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </Text>
                  <View className="relative">
                    <TextInput
                      secureTextEntry={!showNewPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Enter new password"
                      placeholderTextColor="#9CA3AF"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 pr-12"
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3"
                    >
                      <Feather
                        name={showNewPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#64748b"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Password Validation */}
                  {newPassword.length > 0 && (
                    <View className="mt-3 p-3 bg-slate-50 rounded-xl space-y-2">
                      <ValidationItem
                        isValid={passwordValidation.firstLetterUppercase}
                        text="First letter uppercase"
                      />
                      <ValidationItem
                        isValid={passwordValidation.length}
                        text="At least 6 characters"
                      />
                      <ValidationItem
                        isValid={passwordValidation.number}
                        text="Contains a number"
                      />
                      <ValidationItem
                        isValid={passwordValidation.specialChar}
                        text="Special character (!@#$%^&*)"
                      />
                    </View>
                  )}
                </View>

                {/* Confirm Password */}
                <View>
                  <Text className="text-sm font-medium text-slate-700 mb-2">
                    Confirm New Password
                  </Text>
                  <View className="relative">
                    <TextInput
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm new password"
                      placeholderTextColor="#9CA3AF"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 pr-12"
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3"
                    >
                      <Feather
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#64748b"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-row gap-3 pt-4">
                  <TouchableOpacity
                    onPress={() => setStep(1)}
                    className="flex-1 py-3 border border-slate-300 rounded-xl items-center"
                  >
                    <Text className="text-slate-700 font-medium">Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleStep2Submit}
                    disabled={
                      isLoading ||
                      !allPasswordRequirementsMet ||
                      newPassword !== confirmPassword ||
                      !verificationCode
                    }
                    className={`flex-1 py-3 rounded-xl items-center ${
                      isLoading ||
                      !allPasswordRequirementsMet ||
                      newPassword !== confirmPassword ||
                      !verificationCode
                        ? "bg-cyan-300"
                        : "bg-cyan-500"
                    }`}
                  >
                    <Text className="text-white font-medium">
                      {isLoading ? "Changing..." : "Change Password"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChangePasswordModal;
