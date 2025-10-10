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
  ImageBackground,
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

  const onLogin = async () => {
    try {
      await handleLogin(formData.email, formData.password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pt-4">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1 pt-6">
        <View className="p-6 gap-6">
          {/* KlinikaHub Header */}
          <View className="items-center mb-8">
            <View className="flex-row items-center mb-4">
              <ImageBackground
                source={klinikahub}
                className="w-16 h-16 rounded-2xl"
                resizeMode="contain"
              ></ImageBackground>
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
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl"
                placeholder="patient@example.com"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-slate-700">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                  secureTextEntry={!showPassword}
                  className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl"
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View className="flex-row justify-between items-center pt-2">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center gap-3"
              >
                <View
                  className={`w-4 h-4 rounded border border-slate-300 ${rememberMe ? "bg-cyan-600" : "bg-white"}`}
                >
                  {rememberMe && (
                    <Feather name="check" size={12} color="#ffffff" />
                  )}
                </View>
                <Text className="text-sm text-slate-600">Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text className="text-sm text-cyan-600 font-medium">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={onLogin}
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl items-center ${isLoading ? "bg-cyan-400" : "bg-cyan-600"}`}
            >
              <Text className="text-white font-bold text-lg">
                {isLoading ? "Signing in..." : "Access Dashboard"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center">
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
                onPress={() => navigation.navigate("Register")}
                className="text-cyan-600 font-semibold"
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
