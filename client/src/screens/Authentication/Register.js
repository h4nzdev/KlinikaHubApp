"use client";

import { useState } from "react";
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
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { patientAuthServices } from "../../services/patientAuthServices";
import * as ImagePicker from "expo-image-picker";
import { cloudinaryService } from "../../services/cloudinaryService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Register = () => {
  const navigation = useNavigation();

  const [activeSection, setActiveSection] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [localImage, setLocalImage] = useState(null);
  const insets = useSafeAreaInsets();

  //DropDowns
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showBloodGroupDropdown, setShowBloodGroupDropdown] = useState(false);

  const [formData, setFormData] = useState({
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
    address: "",
    mobileno: "",
    email: "",
    password: "",
    confirmPassword: "",
    guardian: "",
    relationship: "",
    gua_mobileno: "",
    patient_id: "",
    category_id: "1",
    source: "1",
    photo: "",
    agreeToTerms: false,
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    firstLetterUppercase: false,
    number: false,
    specialChar: false,
  });

  const sections = ["personal", "contact", "medical", "emergency", "security"];
  const sectionTitles = {
    personal: "Personal Info",
    contact: "Contact Info",
    medical: "Medical Info",
    emergency: "Emergency Contact",
    security: "Security",
  };

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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      // Format date as YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split("T")[0];
      handleInputChange("birthday", formattedDate);

      // Auto-calculate age
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < selectedDate.getDate())
      ) {
        age--;
      }
      handleInputChange("age", age.toString());
    }
  };

  const isLastSection = activeSection === sections[sections.length - 1];
  const isFirstSection = activeSection === sections[0];

  const convertImageToBase64 = async (imageUri) => {
    try {
      console.log("🔄 Converting image to base64...");

      const response = await fetch(imageUri);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Get the base64 string (including data:image/jpeg;base64, prefix)
          const base64 = reader.result;
          console.log("✅ Image converted to base64, length:", base64.length);
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("❌ Error converting image to base64:", error);
      throw new Error("Failed to convert image to base64");
    }
  };

  const handleFinalStep = async () => {
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

    setIsSendingCode(true);
    try {
      let base64Image = null;
      if (localImage) {
        base64Image = await convertImageToBase64(localImage);
      }

      const formDataWithImage = {
        ...formData,
        localImage: base64Image, // 👈 Now it's actual base64 data, not URI
      };

      await patientAuthServices.requestVerificationCode(formData.email);
      navigation.navigate("Verification", { formData: formDataWithImage });
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send verification code");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleImagePick = async () => {
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
        setLocalImage(result.assets[0].uri); // 👈 Only store local URI, no upload!
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleTakePhoto = async () => {
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
        setLocalImage(result.assets[0].uri); // 👈 Only store local URI, no upload!
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const removeLocalImage = () => {
    Alert.alert("Remove Photo", "Remove your profile photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setLocalImage(null),
      },
    ]);
  };

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
      {localImage ? ( // 👈 Use localImage instead of formData.photo
        <View className="items-center gap-3">
          <Image
            source={{ uri: localImage }} // 👈 Preview from local URI
            className="w-32 h-32 rounded-full border-4 border-cyan-500"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={removeLocalImage}
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
              onPress={handleImagePick} // 👈 Updated function name
              className="flex-row items-center gap-2 px-4 py-2 bg-cyan-500 rounded-xl"
            >
              <Feather name="upload" size={16} color="white" />
              <Text className="text-white font-medium">Choose Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleTakePhoto} // 👈 Updated function name
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
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white justify-center"
          >
            <Text
              className={
                formData.birthday ? "text-slate-800" : "text-slate-400"
              }
            >
              {formData.birthday || "BirthDate"}
            </Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            onPress={() => setShowGenderDropdown(!showGenderDropdown)}
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white flex-row justify-between items-center"
          >
            <Text
              className={formData.sex ? "text-slate-800" : "text-slate-400"}
            >
              {formData.sex || "Select gender"}
            </Text>
            <Feather
              name={showGenderDropdown ? "chevron-up" : "chevron-down"}
              size={16}
              color="#64748b"
            />
          </TouchableOpacity>

          {showGenderDropdown && (
            <View className="absolute top-full left-0 right-0 mt-1 border border-slate-300 rounded-xl bg-white z-10 shadow-lg">
              {["Male", "Female", "Other"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  onPress={() => {
                    handleInputChange("sex", gender);
                    setShowGenderDropdown(false);
                  }}
                  className="px-4 py-3 border-b border-slate-100 last:border-b-0"
                >
                  <Text className="text-slate-800">{gender}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
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
          <TouchableOpacity
            onPress={() => setShowBloodGroupDropdown(!showBloodGroupDropdown)}
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white flex-row justify-between items-center"
          >
            <Text
              className={
                formData.blood_group ? "text-slate-800" : "text-slate-400"
              }
            >
              {formData.blood_group || "Select blood group"}
            </Text>
            <Feather
              name={showBloodGroupDropdown ? "chevron-up" : "chevron-down"}
              size={16}
              color="#64748b"
            />
          </TouchableOpacity>

          {showBloodGroupDropdown && (
            <View className="absolute top-full left-0 right-0 mt-1 border border-slate-300 rounded-xl bg-white z-10 shadow-lg">
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (bloodGroup) => (
                  <TouchableOpacity
                    key={bloodGroup}
                    onPress={() => {
                      handleInputChange("blood_group", bloodGroup);
                      setShowBloodGroupDropdown(false);
                    }}
                    className="px-4 py-3 border-b border-slate-100 last:border-b-0"
                  >
                    <Text className="text-slate-800">{bloodGroup}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          )}
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
          style={{ color: "#000000" }}
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
          style={{ color: "#000000" }}
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
          className={`w-5 h-5 rounded border-2 items-center justify-center ${formData.agreeToTerms ? "bg-cyan-600 border-cyan-600" : "border-slate-300 bg-white"}`}
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
    <SafeAreaView
      className="flex-1 bg-slate-50 pt-4"
      style={{ paddingBottom: insets.bottom }}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="p-6 gap-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center gap-2"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#475569" />
            <Text className="text-slate-600 font-medium">Back</Text>
          </TouchableOpacity>

          <View>
            <Text className="text-3xl font-bold text-slate-800 mb-2">
              Create Your Patient Account
            </Text>
            <Text className="text-slate-600 text-base">
              Fill in your details to get started
            </Text>
          </View>

          <SectionProgress />

          <View className="flex-row gap-2">
            <SectionButton section="personal" icon="user" />
            <SectionButton section="contact" icon="phone" />
            <SectionButton section="medical" icon="heart" />
            <SectionButton section="emergency" icon="shield" />
            <SectionButton section="security" icon="lock" />
          </View>

          {renderActiveSection()}

          <View className="flex-row gap-3">
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
            <TouchableOpacity
              onPress={isLastSection ? handleFinalStep : goToNextSection}
              disabled={
                isLoading ||
                isUploading ||
                isSendingCode ||
                (isLastSection && !allPasswordRequirementsMet)
              }
              className={`${isFirstSection ? "flex-1" : "flex-1"} py-4 rounded-2xl shadow-lg ${isLoading || isUploading || isSendingCode || (isLastSection && !allPasswordRequirementsMet) ? "bg-slate-400" : "bg-cyan-600"}`}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-center text-lg">
                {isUploading
                  ? "Uploading..."
                  : isLoading
                    ? "Creating Account..."
                    : isSendingCode
                      ? "Sending Code..."
                      : isLastSection
                        ? "Continue"
                        : "Next"}
              </Text>
            </TouchableOpacity>
          </View>

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
