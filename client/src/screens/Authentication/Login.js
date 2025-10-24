import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import klinikahub from "../../../assets/klinikahub.png";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();
  const { handleLogin, isLoading } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onLogin = async () => {
    if (!validateForm()) return;

    try {
      await handleLogin(formData.email, formData.password, rememberMe);
      // Navigation will be handled by the useLogin hook or useEffect in the hook
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.message || "Invalid email or password. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Please contact our support team to reset your password.",
      [{ text: "OK" }]
    );
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pt-4">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ScrollView
        className="flex-1 pt-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="p-6 gap-6">
          {/* KlinikaHub Header */}
          <View className="items-center mb-8">
            <View className="flex-row items-center mb-4">
              <Image
                source={klinikahub}
                className="w-16 h-16"
                resizeMode="contain"
              />
              <View className="ml-4">
                <Text className="text-3xl font-bold text-slate-800">
                  <Text className="text-cyan-800">Klinika</Text>
                  <Text className="text-green-800">Hub</Text>
                </Text>
                <Text className="text-cyan-600 text-lg font-medium">
                  Patient Portal
                </Text>
              </View>
            </View>
          </View>

          {/* Welcome Section */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-slate-800 mb-2">
              Welcome Back
            </Text>
            <Text className="text-slate-600 text-lg">
              Sign in to your KlinikaHub patient dashboard
            </Text>
          </View>

          {/* Login Form */}
          <View className="gap-6">
            {/* Email Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-slate-700">
                Email Address
              </Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  clearError("email");
                }}
                className={`w-full px-4 py-4 bg-white border rounded-2xl ${errors.email ? "border-red-500" : "border-slate-300"}`}
                placeholder="patient@example.com"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!isLoading}
              />
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-slate-700">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData({ ...formData, password: text });
                    clearError("password");
                  }}
                  secureTextEntry={!showPassword}
                  className={`w-full px-4 py-4 bg-white border rounded-2xl pr-12 ${errors.password ? "border-red-500" : "border-slate-300"}`}
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  editable={!isLoading}
                  onSubmitEditing={onLogin}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                  disabled={isLoading}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Remember Me & Forgot Password */}
            <View className="flex-row justify-between items-center pt-2">
              <TouchableOpacity
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                <Text
                  className={`text-sm font-medium ${isLoading ? "text-slate-400" : "text-cyan-600"}`}
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={onLogin}
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl items-center justify-center mt-4 ${
                isLoading ? "bg-cyan-400" : "bg-cyan-600"
              }`}
            >
              <Text className="text-white font-bold text-lg">
                {isLoading ? "Signing in..." : "Access Dashboard"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 border-t border-slate-300" />
            <Text className="px-4 text-xs text-slate-500 font-medium">
              KLINIKAHUB PORTAL
            </Text>
            <View className="flex-1 border-t border-slate-300" />
          </View>

          {/* Sign Up Link */}
          <View className="items-center">
            <Text className="text-sm text-slate-600">
              New to KlinikaHub?{" "}
              <Text
                onPress={() => !isLoading && navigation.navigate("Register")}
                className={`font-semibold ${isLoading ? "text-slate-400" : "text-cyan-600"}`}
              >
                Create account
              </Text>
            </Text>
          </View>

          {/* Security Features */}
          <View className="mt-8 gap-3 pb-16">
            <View className="flex-row items-center gap-2">
              <Feather name="shield" size={16} color="#10b981" />
              <Text className="text-sm text-slate-600">
                HIPAA Compliant & Secure
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Feather name="star" size={16} color="#f59e0b" />
              <Text className="text-sm text-slate-600">
                Trusted by healthcare providers
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Feather name="activity" size={16} color="#0891b2" />
              <Text className="text-sm text-slate-600">
                Your health data is protected
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
