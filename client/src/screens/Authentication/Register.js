import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { patientAuthServices } from "../../services/patientAuthServices"; // Adjust path as needed

const Register = () => {
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    // Personal Info
    first_name: "",
    last_name: "",
    middle_name: "",
    birthday: "",
    age: "",
    sex: "",
    blood_group: "",
    blood_pressure: "",
    height: "",
    weight: "",
    marital_status: "",

    // Contact Info
    address: "",
    mobileno: "",
    email: "",

    // Account Security
    password: "",
    confirmPassword: "",

    // Emergency Contact
    guardian: "",
    relationship: "",
    gua_mobileno: "",

    // Additional Fields
    patient_id: "",
    category_id: "1",
    source: "1",

    agreeToTerms: false,
  });

  const [activeSection, setActiveSection] = useState("personal"); // personal, contact, medical, emergency, security

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    firstLetterUppercase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (password) => {
    setPasswordValidation({
      length: password.length >= 6,
      firstLetterUppercase: /^[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    });
  };

  const handleInputChange = (name, value) => {
    if (name === "password") {
      validatePassword(value);
      setShowPasswordValidation(value.length > 0);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const allPasswordRequirementsMet =
    Object.values(passwordValidation).every(Boolean);

  // NEW: Registration function using the service
  const handleRegister = async () => {
    if (!allPasswordRequirementsMet) {
      Alert.alert("Error", "Password does not meet the requirements.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      Alert.alert("Error", "Please agree to the terms and conditions");
      return;
    }

    // Required fields validation
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "password",
      "mobileno",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert(
        "Error",
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔄 Registering patient...", formData.email);

      // Prepare data for API (remove confirmPassword and agreeToTerms)
      const { confirmPassword, agreeToTerms, ...registrationData } = formData;

      const result =
        await patientAuthServices.patientRegister(registrationData);

      console.log("✅ Registration Success!", result);

      Alert.alert("Success!", "Your account has been created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error) {
      console.error("❌ Registration Error:", error);
      Alert.alert(
        "Registration Failed",
        error.response?.data?.error ||
          error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <View className="flex-row items-center gap-2">
      <Feather
        name={isValid ? "check" : "x"}
        size={16}
        color={isValid ? "#059669" : "#ef4444"}
      />
      <Text
        className={`text-sm ${isValid ? "text-emerald-600" : "text-red-500"}`}
      >
        {text}
      </Text>
    </View>
  );

  const SectionButton = ({ title, section, icon }) => (
    <TouchableOpacity
      onPress={() => setActiveSection(section)}
      className={`flex-1 flex-column items-center justify-center gap-2 py-3 px-4 rounded-xl ${
        activeSection === section ? "bg-cyan-600" : "bg-slate-100"
      }`}
    >
      <Feather
        name={icon}
        size={16}
        color={activeSection === section ? "white" : "#64748b"}
      />
    </TouchableOpacity>
  );

  const renderPersonalInfo = () => (
    <View className="gap-4">
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            First Name *
          </Text>
          <TextInput
            value={formData.first_name}
            onChangeText={(text) => handleInputChange("first_name", text)}
            placeholder="Maria"
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Last Name *
          </Text>
          <TextInput
            value={formData.last_name}
            onChangeText={(text) => handleInputChange("last_name", text)}
            placeholder="Santos"
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
          />
        </View>
      </View>

      <View>
        <Text className="text-sm font-medium text-slate-700 mb-2">
          Middle Name
        </Text>
        <TextInput
          value={formData.middle_name}
          onChangeText={(text) => handleInputChange("middle_name", text)}
          placeholder="Reyes"
          className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
        />
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Birthday
          </Text>
          <TextInput
            value={formData.birthday}
            onChangeText={(text) => handleInputChange("birthday", text)}
            placeholder="YYYY-MM-DD"
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-700 mb-2">Age *</Text>
          <TextInput
            value={formData.age}
            onChangeText={(text) => handleInputChange("age", text)}
            placeholder="30"
            keyboardType="number-pad"
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
          />
        </View>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Gender *
          </Text>
          <TextInput
            value={formData.sex}
            onChangeText={(text) => handleInputChange("sex", text)}
            placeholder="Male/Female/Other"
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Marital Status
          </Text>
          <TextInput
            value={formData.marital_status}
            onChangeText={(text) => handleInputChange("marital_status", text)}
            placeholder="Single/Married/Divorced"
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
          />
        </View>
      </View>
    </View>
  );

  const renderContactInfo = () => (
    <View className="gap-4">
      <View>
        <Text className="text-sm font-medium text-slate-700 mb-2">
          Email Address *
        </Text>
        <TextInput
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          placeholder="maria.santos@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-slate-700 mb-2">
          Phone Number *
        </Text>
        <TextInput
          value={formData.mobileno}
          onChangeText={(text) => handleInputChange("mobileno", text)}
          placeholder="09171234567"
          keyboardType="phone-pad"
          maxLength={11}
          className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-slate-700 mb-2">
          Address *
        </Text>
        <TextInput
          value={formData.address}
          onChangeText={(text) => handleInputChange("address", text)}
          placeholder="123 Main Street, Manila"
          className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
        />
      </View>
    </View>
  );

  const renderMedicalInfo = () => (
    <View className="gap-4">
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Blood Group
          </Text>
          <TextInput
            value={formData.blood_group}
            onChangeText={(text) => handleInputChange("blood_group", text)}
            placeholder="O+ / A+ / B+ / AB+"
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Blood Pressure
          </Text>
          <TextInput
            value={formData.blood_pressure}
            onChangeText={(text) => handleInputChange("blood_pressure", text)}
            placeholder="120/80"
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
          />
        </View>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Height
          </Text>
          <TextInput
            value={formData.height}
            onChangeText={(text) => handleInputChange("height", text)}
            placeholder="165 cm"
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Weight
          </Text>
          <TextInput
            value={formData.weight}
            onChangeText={(text) => handleInputChange("weight", text)}
            placeholder="58 kg"
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
          />
        </View>
      </View>
    </View>
  );

  const renderEmergencyContact = () => (
    <View className="gap-4">
      <View>
        <Text className="text-sm font-medium text-slate-700 mb-2">
          Guardian Name
        </Text>
        <TextInput
          value={formData.guardian}
          onChangeText={(text) => handleInputChange("guardian", text)}
          placeholder="Pedro Santos"
          className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-slate-700 mb-2">
          Relationship
        </Text>
        <TextInput
          value={formData.relationship}
          onChangeText={(text) => handleInputChange("relationship", text)}
          placeholder="Father / Mother / Spouse"
          className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-slate-700 mb-2">
          Guardian Phone
        </Text>
        <TextInput
          value={formData.gua_mobileno}
          onChangeText={(text) => handleInputChange("gua_mobileno", text)}
          placeholder="09170000001"
          keyboardType="phone-pad"
          maxLength={11}
          className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
        />
      </View>
    </View>
  );

  const renderSecurity = () => (
    <View className="gap-4">
      <View>
        <Text className="text-sm font-medium text-slate-700 mb-2">
          Password *
        </Text>
        <TextInput
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          placeholder="••••••••"
          secureTextEntry
          onFocus={() => setShowPasswordValidation(true)}
          onBlur={() => setShowPasswordValidation(false)}
          className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
        />

        {showPasswordValidation && (
          <View className="mt-2 p-4 bg-white border border-slate-200 rounded-xl gap-2">
            <ValidationItem
              isValid={passwordValidation.firstLetterUppercase}
              text="First letter must be uppercase"
            />
            <ValidationItem
              isValid={passwordValidation.length}
              text="At least 6 characters"
            />
            <ValidationItem
              isValid={passwordValidation.number}
              text="Must contain a number"
            />
            <ValidationItem
              isValid={passwordValidation.specialChar}
              text="Must contain a special character (!@#$%^&*)"
            />
          </View>
        )}
      </View>

      <View>
        <Text className="text-sm font-medium text-slate-700 mb-2">
          Confirm Password *
        </Text>
        <TextInput
          value={formData.confirmPassword}
          onChangeText={(text) => handleInputChange("confirmPassword", text)}
          placeholder="••••••••"
          secureTextEntry
          className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
        />
      </View>

      <TouchableOpacity
        onPress={() =>
          handleInputChange("agreeToTerms", !formData.agreeToTerms)
        }
        className="flex-row items-start gap-3"
        activeOpacity={0.7}
      >
        <View
          className={`w-5 h-5 rounded border-2 items-center justify-center ${
            formData.agreeToTerms
              ? "bg-cyan-600 border-cyan-600"
              : "border-slate-300 bg-white"
          }`}
        >
          {formData.agreeToTerms && (
            <Feather name="check" size={14} color="#ffffff" />
          )}
        </View>
        <Text className="text-sm text-slate-600 flex-1">
          I agree to the <Text className="text-cyan-600">Terms of Service</Text>{" "}
          and <Text className="text-cyan-600">Privacy Policy</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalInfo();
      case "contact":
        return renderContactInfo();
      case "medical":
        return renderMedicalInfo();
      case "emergency":
        return renderEmergencyContact();
      case "security":
        return renderSecurity();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="p-6 gap-6">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center gap-2"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#475569" />
            <Text className="text-slate-600 font-medium">Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-slate-800 mb-2">
              Create Your Patient Account
            </Text>
            <Text className="text-slate-600 text-base">
              Fill in your details to get started
            </Text>
          </View>

          {/* Section Navigation */}
          <View className="flex-row gap-2">
            <SectionButton title="Personal" section="personal" icon="user" />
            <SectionButton title="Contact" section="contact" icon="phone" />
            <SectionButton title="Medical" section="medical" icon="heart" />
            <SectionButton
              title="Emergency"
              section="emergency"
              icon="shield"
            />
            <SectionButton title="Security" section="security" icon="lock" />
          </View>

          {/* Active Section Content */}
          {renderActiveSection()}

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading || !allPasswordRequirementsMet}
            className={`w-full py-4 rounded-2xl shadow-lg ${
              isLoading || !allPasswordRequirementsMet
                ? "bg-slate-400"
                : "bg-cyan-600"
            }`}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-center text-lg">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View className="pt-6 border-t border-slate-200">
            <Text className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Text
                className="text-cyan-600 font-semibold"
                onPress={() => navigation.navigate("Login")}
              >
                Sign in
              </Text>
            </Text>
          </View>

          {/* Trust Badges */}
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <Feather name="shield" size={16} color="#059669" />
              <Text className="text-sm text-slate-600">
                HIPAA Compliant & Secure
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Feather name="star" size={16} color="#f59e0b" />
              <Text className="text-sm text-slate-600">
                Trusted by 1000+ healthcare providers
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
