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
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { patientAuthServices } from "../../services/patientAuthServices";
import * as ImagePicker from "expo-image-picker";
import { cloudinaryService } from "../../services/cloudinaryService";

const Register = () => {
  const navigation = useNavigation();

  // State management
  const [activeSection, setActiveSection] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  // Form data with all fields including photo
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
    photo: "", // Cloudinary URL will be stored here

    agreeToTerms: false,
  });

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    firstLetterUppercase: false,
    number: false,
    specialChar: false,
  });

  // Section order for navigation
  const sections = ["personal", "contact", "medical", "emergency", "security"];
  const sectionTitles = {
    personal: "Personal Info",
    contact: "Contact Info",
    medical: "Medical Info",
    emergency: "Emergency Contact",
    security: "Security",
  };

  // Navigation functions
  const goToNextSection = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    }
  };

  const goToPreviousSection = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  const isLastSection = activeSection === sections[sections.length - 1];
  const isFirstSection = activeSection === sections[0];

  // Image handling functions
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera roll permissions needed for photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        await uploadImageToCloudinary(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera permissions needed to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        await uploadImageToCloudinary(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    try {
      setIsUploading(true);
      console.log("Starting image upload...");

      const uploadResult = await cloudinaryService.uploadImage(imageUri);

      setFormData((prev) => ({
        ...prev,
        photo: uploadResult.secure_url,
      }));

      Alert.alert("Success", "Profile photo uploaded!");
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Upload Failed", error.message || "Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = () => {
    Alert.alert("Remove Photo", "Remove your profile photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setFormData((prev) => ({ ...prev, photo: "" })),
      },
    ]);
  };

  // Form handling
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

  // Registration
  const handleRegister = async () => {
    // Validation checks
    if (!allPasswordRequirementsMet) {
      Alert.alert("Error", "Password does not meet requirements.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      Alert.alert("Error", "Please agree to terms and conditions");
      return;
    }

    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "password",
      "mobileno",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert("Error", `Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, agreeToTerms, ...registrationData } = formData;

      const result =
        await patientAuthServices.patientRegister(registrationData);

      Alert.alert("Success!", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.error || error.message || "Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // UI Components
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

  const SectionProgress = () => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-slate-600 mb-2">
        Step {sections.indexOf(activeSection) + 1} of {sections.length}:{" "}
        {sectionTitles[activeSection]}
      </Text>
      <View className="flex-row gap-1">
        {sections.map((section, index) => (
          <View
            key={section}
            className={`flex-1 h-2 rounded-full ${
              sections.indexOf(activeSection) >= index
                ? "bg-cyan-600"
                : "bg-slate-200"
            }`}
          />
        ))}
      </View>
    </View>
  );

  const SectionButton = ({ section, icon }) => (
    <TouchableOpacity
      onPress={() => setActiveSection(section)}
      className={`flex-1 items-center justify-center py-3 px-4 rounded-xl ${
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

  const renderPhotoUpload = () => (
    <View className="items-center gap-4 mb-4">
      <Text className="text-sm font-medium text-slate-700">
        Profile Photo (Optional)
      </Text>

      {formData.photo ? (
        <View className="items-center gap-3">
          <Image
            source={{ uri: formData.photo }}
            className="w-32 h-32 rounded-full border-4 border-cyan-500"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={removePhoto}
            className="flex-row items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl"
          >
            <Feather name="trash-2" size={16} color="#ef4444" />
            <Text className="text-red-600 font-medium">Remove Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center gap-3">
          <View className="w-32 h-32 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 items-center justify-center">
            <Feather name="user" size={40} color="#94a3b8" />
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={pickImage}
              disabled={isUploading}
              className="flex-row items-center gap-2 px-4 py-2 bg-cyan-500 rounded-xl"
            >
              <Feather name="upload" size={16} color="white" />
              <Text className="text-white font-medium">
                {isUploading ? "Uploading..." : "Choose Photo"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePhoto}
              disabled={isUploading}
              className="flex-row items-center gap-2 px-4 py-2 bg-slate-600 rounded-xl"
            >
              <Feather name="camera" size={16} color="white" />
              <Text className="text-white font-medium">Take Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  // Section renderers
  const renderPersonalInfo = () => (
    <View className="gap-4">
      {renderPhotoUpload()}

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
    <SafeAreaView className="flex-1 bg-slate-50 pt-4">
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

          {/* Progress Indicator */}
          <SectionProgress />

          {/* Section Navigation */}
          <View className="flex-row gap-2">
            <SectionButton section="personal" icon="user" />
            <SectionButton section="contact" icon="phone" />
            <SectionButton section="medical" icon="heart" />
            <SectionButton section="emergency" icon="shield" />
            <SectionButton section="security" icon="lock" />
          </View>

          {/* Active Section Content */}
          {renderActiveSection()}

          {/* Navigation Buttons */}
          <View className="flex-row gap-3">
            {/* Back Button */}
            {!isFirstSection && (
              <TouchableOpacity
                onPress={goToPreviousSection}
                className="flex-1 py-4 border border-slate-300 rounded-2xl bg-white"
                activeOpacity={0.8}
              >
                <Text className="text-slate-700 font-bold text-center text-lg">
                  Back
                </Text>
              </TouchableOpacity>
            )}

            {/* Next/Register Button */}
            <TouchableOpacity
              onPress={isLastSection ? handleRegister : goToNextSection}
              disabled={
                isLoading ||
                isUploading ||
                (isLastSection && !allPasswordRequirementsMet)
              }
              className={`${isFirstSection ? "flex-1" : "flex-1"} py-4 rounded-2xl shadow-lg ${
                isLoading ||
                isUploading ||
                (isLastSection && !allPasswordRequirementsMet)
                  ? "bg-slate-400"
                  : "bg-cyan-600"
              }`}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-center text-lg">
                {isUploading
                  ? "Uploading..."
                  : isLoading
                    ? "Creating Account..."
                    : isLastSection
                      ? "Create Account"
                      : "Next"}
              </Text>
            </TouchableOpacity>
          </View>

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
              <Feather name="cloud" size={16} color="#3b82f6" />
              <Text className="text-sm text-slate-600">
                Secure Cloud Storage with Cloudinary
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
