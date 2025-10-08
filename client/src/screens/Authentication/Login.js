import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import patientAuthServices from "../../services/patientAuthServices";
import Toast from "react-native-toast-message";

const Login = ({ navigation }) => {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useContext(AuthenticationContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Mock static clinics data
  const clinics = [
    { _id: "1", clinicName: "City Medical Center" },
    { _id: "2", clinicName: "Family Health Clinic" },
    { _id: "3", clinicName: "Downtown Healthcare" },
  ];

  const handleLogin = async () => {
    if (!selectedClinic) {
      Toast.show({
        type: "error",
        text1: "Please select a clinic",
      });
      return;
    }

    setIsLoading(true);
    try {
      const auth = await patientAuthServices.patientLogin(
        formData.email,
        formData.password
      );
      setUser(auth);
      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: "Logged in successfully",
        });
      }, 3500);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: error.message || "Please check your credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const DefaultBrandingSection = () => (
    <View className="flex-1 justify-center items-center px-12 bg-black/60">
      {/* Logo and Brand */}
      <View className="items-center mb-12">
        <View className="flex-row items-center mb-8">
          <View className="w-20 h-20 bg-white rounded-3xl shadow-2xl shadow-black/20 items-center justify-center">
            <Text className="text-2xl font-bold text-cyan-600">KH</Text>
          </View>
          <View className="ml-6">
            <Text className="text-4xl font-bold text-white">KlinikaHub</Text>
            <Text className="text-cyan-100 font-medium">Patient Portal</Text>
          </View>
        </View>

        <View className="gap-6 items-center">
          <Text className="text-3xl font-bold text-white text-center">
            Your Health, Simplified
          </Text>
          <Text className="text-cyan-100 text-lg text-center max-w-md">
            Securely access appointments, medical records, and health reminders
            in one place.
          </Text>
        </View>
      </View>

      {/* Trust Indicators */}
      <View className="flex-row gap-6 w-full max-w-sm">
        <View className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-6 items-center border border-white/20">
          <Feather name="shield" size={32} color="#ffffff" />
          <Text className="text-white font-bold text-lg mt-3">HIPAA</Text>
          <Text className="text-cyan-100 text-sm">Compliant</Text>
        </View>
        <View className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-6 items-center border border-white/20">
          <Feather name="star" size={32} color="#ffffff" />
          <Text className="text-white font-bold text-lg mt-3">1000+</Text>
          <Text className="text-cyan-100 text-sm">Trusted Clinics</Text>
        </View>
      </View>

      {/* Security Notice */}
      <View className="absolute bottom-8 left-12 right-12">
        <View className="flex-row items-center justify-center gap-2">
          <Feather name="shield" size={16} color="#a5f3fc" />
          <Text className="text-cyan-200 text-sm text-center">
            Enterprise-grade security & encryption
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1">
        <View className="p-6 gap-6">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center gap-2"
          >
            <Feather name="arrow-left" size={20} color="#475569" />
            <Text className="text-slate-600 font-medium">Back to Home</Text>
          </TouchableOpacity>

          {/* Mobile Header */}
          <View className="lg:hidden items-center mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-cyan-600 rounded-xl items-center justify-center">
                <Text className="text-white font-bold text-lg">KH</Text>
              </View>
              <View className="ml-3">
                <Text className="text-2xl font-bold text-slate-800">
                  KlinikaHub
                </Text>
                <Text className="text-cyan-600 text-sm font-medium">
                  Patient Portal
                </Text>
              </View>
            </View>
          </View>

          {/* Welcome Section */}
          <View
            className={`mb-8 ${selectedClinic ? "border border-cyan-200 p-6 bg-cyan-50 rounded-2xl" : ""}`}
          >
            <Text
              className={`text-3xl font-bold mb-2 ${selectedClinic ? "text-cyan-900" : "text-slate-800"}`}
            >
              {selectedClinic
                ? `Booking with ${selectedClinic.clinicName}`
                : "Welcome Back"}
            </Text>
            <Text
              className={selectedClinic ? "text-cyan-700" : "text-slate-600"}
            >
              {selectedClinic
                ? "Sign in to complete your booking"
                : "Sign in to your patient dashboard"}
            </Text>
          </View>

          {/* Login Form */}
          <View className="gap-6">
            {/* Clinic Selection */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-slate-700">
                Select Clinic
              </Text>
              <TouchableOpacity
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl flex-row justify-between items-center"
              >
                <Text
                  className={
                    selectedClinic ? "text-slate-800" : "text-slate-400"
                  }
                >
                  {selectedClinic
                    ? selectedClinic.clinicName
                    : "Choose a clinic"}
                </Text>
                <Feather name="chevron-down" size={20} color="#94a3b8" />
              </TouchableOpacity>

              {isDropdownOpen && (
                <View className="absolute z-10 top-16 w-full bg-white border border-slate-300 rounded-2xl shadow-lg">
                  {clinics.map((clinic) => (
                    <TouchableOpacity
                      key={clinic._id}
                      onPress={() => {
                        setSelectedClinic(clinic);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-3 border-b border-slate-100 last:border-b-0"
                    >
                      <Text className="text-slate-800">
                        {clinic.clinicName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

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
                className={`w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl ${!selectedClinic && "bg-slate-100"}`}
                placeholder="patient@example.com"
                placeholderTextColor="#94a3b8"
                editable={!!selectedClinic}
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
                  className={`w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl ${!selectedClinic && "bg-slate-100"}`}
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  editable={!!selectedClinic}
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
              onPress={handleLogin}
              //   disabled={!selectedClinic || isLoading}
              className={`w-full py-4 rounded-2xl items-center ${!selectedClinic ? "bg-cyan-400" : "bg-cyan-600"}`}
            >
              <Text className="text-white font-bold text-lg">
                {isLoading ? "Signing in..." : "Access Dashboard"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="my-8 flex-row items-center">
            <View className="flex-1 border-t border-slate-300" />
            <Text className="px-4 text-xs text-slate-500 font-medium">
              PATIENT PORTAL
            </Text>
            <View className="flex-1 border-t border-slate-300" />
          </View>

          {/* Sign Up Link */}
          <View className="items-center">
            <Text className="text-sm text-slate-600">
              New patient?{" "}
              <Text className="text-cyan-600 font-semibold">
                Create account
              </Text>
            </Text>
          </View>

          {/* Security Features */}
          <View className="mt-8 gap-3">
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
