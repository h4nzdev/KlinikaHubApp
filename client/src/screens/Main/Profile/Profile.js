import React, { useContext, useState, useEffect, useRef } from "react";
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
  ActivityIndicator,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import { useAppointments } from "../../../hooks/useAppointments";
import patientAuthServices from "../../../services/patientAuthServices";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Profile = () => {
  const { user, updateUser } = useContext(AuthenticationContext);
  const { appointments, loading: appointmentsLoading } = useAppointments();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const insets = useSafeAreaInsets();

  const patient = user?.patient || user;

  // Use refs to store form data to prevent re-renders
  const formDataRef = useRef({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    bloodGroup: "",
    bloodPressure: "",
    height: "",
    weight: "",
    maritalStatus: "",
    guardian: "",
    relationship: "",
    guardianPhone: "",
  });

  // Local state for display only (non-input fields)
  const [displayData, setDisplayData] = useState({
    name: "",
    patientId: "",
    role: "",
    category: "",
    source: "",
    createdAt: "",
    updatedAt: "",
    profilePicture: null,
  });

  // Initialize data once when component mounts
  useEffect(() => {
    if (patient) {
      const name =
        patient?.first_name && patient?.last_name
          ? `${patient.first_name} ${patient.last_name}`.trim()
          : patient?.name || "Not provided";

      // Update form data ref
      formDataRef.current = {
        name: name,
        age: patient?.age ? String(patient.age) : "",
        gender: patient?.sex || patient?.gender || "",
        email: patient?.email || "",
        phone: patient?.mobileno || patient?.phone || "",
        address: patient?.address || "",
        birthday: patient?.birthday || "",
        bloodGroup: patient?.blood_group || "",
        bloodPressure: patient?.blood_pressure || "",
        height: patient?.height || "",
        weight: patient?.weight || "",
        maritalStatus:
          patient?.marital_status === "1"
            ? "Single"
            : patient?.marital_status === "2"
              ? "Married"
              : patient?.marital_status || "",
        guardian: patient?.guardian || "",
        relationship: patient?.relationship || "",
        guardianPhone: patient?.gua_mobileno || "",
      };

      // Update display data
      setDisplayData({
        name: name,
        patientId: patient?.patient_id || patient?.id || "N/A",
        role: patient?.role || "patient",
        category:
          patient?.category_id === 1
            ? "Individual"
            : patient?.category_id === 2
              ? "Corporate"
              : "Not specified",
        source:
          patient?.source === 1
            ? "Online Registration"
            : patient?.source === 2
              ? "Doctor Referral"
              : patient?.source === 3
                ? "Walk-in"
                : "Not specified",
        createdAt: patient?.created_at || "Not available",
        updatedAt: patient?.updated_at || "Not available",
        profilePicture: patient?.photo || null,
      });
    }
  }, [patient]);

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === "ios"); // Keep open on iOS

    if (date) {
      setSelectedDate(date);

      // ✅ FIX: Use local date string instead of ISO string to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const localDateString = `${year}-${month}-${day}`;

      formDataRef.current.birthday = localDateString;
    }
  };

  const handleShowDatePicker = () => {
    // Parse current birthday or use today
    const currentBirthday = formDataRef.current.birthday
      ? new Date(formDataRef.current.birthday)
      : new Date();

    setSelectedDate(currentBirthday);
    setShowDatePicker(true);
  };

  const initials = displayData.name
    ? displayData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  // Direct update to ref without causing re-render
  const handleInputChange = (field, value) => {
    formDataRef.current[field] = value;
  };

  const handleUpdateProfilePicture = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to update your profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setIsUploadingPhoto(true);
        const base64Image = result.assets[0].base64;
        const correctPatientId = patient?.id || displayData.patientId;

        const response = await patientAuthServices.updatePatientProfilePicture(
          correctPatientId,
          base64Image
        );

        let newPhotoUrl;
        if (response.photo) {
          newPhotoUrl = response.photo;
        } else if (response.result?.photo) {
          newPhotoUrl = response.result.photo;
        } else if (response.result?.profile_picture) {
          newPhotoUrl = response.result.profile_picture;
        } else if (response.profile_picture) {
          newPhotoUrl = response.profile_picture;
        }

        if (!newPhotoUrl) {
          throw new Error("No photo URL returned from server");
        }

        // Update display data
        setDisplayData((prev) => ({
          ...prev,
          profilePicture: newPhotoUrl,
        }));

        if (updateUser && user) {
          let updatedUserData;
          if (user.patient) {
            updatedUserData = {
              ...user,
              photo: newPhotoUrl,
              patient: {
                ...user.patient,
                photo: newPhotoUrl,
              },
            };
          } else {
            updatedUserData = {
              ...user,
              photo: newPhotoUrl,
            };
          }
          await updateUser(updatedUserData);
        }

        Alert.alert("Success", "Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Profile picture update error:", error);
      Alert.alert("Error", error.message || "Failed to update profile picture");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        first_name: formDataRef.current.name.split(" ")[0] || "",
        last_name: formDataRef.current.name.split(" ").slice(1).join(" ") || "",
        age: formDataRef.current.age
          ? parseInt(formDataRef.current.age, 10)
          : null,
        sex: formDataRef.current.gender,
        email: formDataRef.current.email,
        mobileno: formDataRef.current.phone,
        address: formDataRef.current.address,
        birthday: formDataRef.current.birthday,
        blood_group: formDataRef.current.bloodGroup,
        blood_pressure: formDataRef.current.bloodPressure,
        height: formDataRef.current.height,
        weight: formDataRef.current.weight,
        marital_status: formDataRef.current.maritalStatus,
        guardian: formDataRef.current.guardian,
        relationship: formDataRef.current.relationship,
        gua_mobileno: formDataRef.current.guardianPhone,
      };

      console.log("📤 Sending update data:", updateData);

      // ✅ CHANGE THIS - Use patient.id instead of displayData.patientId
      const correctId = patient?.id; // The actual database ID, not patient_id
      console.log("📤 Using ID:", correctId);

      // ✅ CAPTURE THE RESPONSE
      const response = await patientAuthServices.updatePatientProfile(
        correctId,
        updateData
      );

      const freshPatientData =
        await patientAuthServices.getPatientProfile(correctId);

      // ✅ UPDATE CONTEXT WITH FRESH DATA
      if (updateUser && user) {
        let updatedUserData;
        if (user.patient) {
          updatedUserData = {
            ...user,
            patient: freshPatientData,
          };
        } else {
          updatedUserData = freshPatientData;
        }

        await updateUser(updatedUserData);
      }

      setIsLoading(false);
      setIsEditMode(false);
      Alert.alert("Success", "Profile updated successfully!");

      setIsLoading(false);
      setIsEditMode(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      setIsLoading(false);
      console.error("❌ Full error:", error);
      Alert.alert("Error", error.message || "Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    // Reset form data from original patient data
    if (patient) {
      const name =
        patient?.first_name && patient?.last_name
          ? `${patient.first_name} ${patient.last_name}`.trim()
          : patient?.name || "Not provided";

      formDataRef.current = {
        name: name,
        age: patient?.age || "",
        gender: patient?.sex || patient?.gender || "",
        email: patient?.email || "",
        phone: patient?.mobileno || patient?.phone || "",
        address: patient?.address || "",
        birthday: patient?.birthday || "",
        bloodGroup: patient?.blood_group || "",
        bloodPressure: patient?.blood_pressure || "",
        height: patient?.height || "",
        weight: patient?.weight || "",
        maritalStatus:
          patient?.marital_status === "1"
            ? "Single"
            : patient?.marital_status === "2"
              ? "Married"
              : patient?.marital_status || "",
        guardian: patient?.guardian || "",
        relationship: patient?.relationship || "",
        guardianPhone: patient?.gua_mobileno || "",
      };
    }
    setIsEditMode(false);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Not available") return "Not available";
    try {
      // ✅ Handle both ISO strings and local date strings (YYYY-MM-DD)
      const date = new Date(dateString);

      // If it's an invalid date, try parsing as local date string
      if (isNaN(date.getTime())) {
        const [year, month, day] = dateString.split("-");
        const localDate = new Date(year, month - 1, day);
        return localDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Information organized by tabs
  const personalInfo = [
    { title: "Full Name", field: "name", icon: "user" },
    { title: "Age", field: "age", icon: "calendar", suffix: " years" },
    { title: "Gender", field: "gender", icon: "user-check" },
    {
      title: "Birthday",
      field: "birthday",
      icon: "gift",
      formatter: formatDate,
    },
    { title: "Marital Status", field: "maritalStatus", icon: "heart" },
  ];

  const medicalInfo = [
    { title: "Blood Group", field: "bloodGroup", icon: "droplet" },
    { title: "Blood Pressure", field: "bloodPressure", icon: "activity" },
    { title: "Height", field: "height", icon: "maximize" },
    { title: "Weight", field: "weight", icon: "minimize" },
  ];

  const contactInfo = [
    { title: "Email Address", field: "email", icon: "mail" },
    { title: "Phone Number", field: "phone", icon: "phone" },
    { title: "Address", field: "address", icon: "map-pin" },
  ];

  const guardianInfo = [
    { title: "Guardian Name", field: "guardian", icon: "users" },
    { title: "Relationship", field: "relationship", icon: "link" },
    { title: "Guardian Phone", field: "guardianPhone", icon: "phone-call" },
  ];

  const systemInfo = [
    { title: "Patient Category", value: displayData.category, icon: "tag" },
    {
      title: "Registration Source",
      value: displayData.source,
      icon: "download",
    },
    {
      title: "Member Since",
      value: formatDate(displayData.createdAt),
      icon: "clock",
    },
    {
      title: "Last Updated",
      value: formatDate(displayData.updatedAt),
      icon: "refresh-cw",
    },
  ];

  // Loading state
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="text-slate-600 mt-4 text-lg">
            Loading user data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Tab navigation component
  const TabButton = ({ title, tabName, icon }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tabName)}
      className={`flex-row items-center justify-center py-3 px-4 rounded-2xl mx-1 ${
        activeTab === tabName ? "bg-cyan-500" : "bg-slate-50"
      }`}
      activeOpacity={0.7}
    >
      <Feather
        name={icon}
        size={16}
        color={activeTab === tabName ? "#ffffff" : "#64748b"}
        className="mr-2"
      />
      <Text
        className={`font-semibold text-sm ${
          activeTab === tabName ? "text-white" : "text-slate-600"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Info card component - now using ref for input values
  const InfoCard = ({ info }) => {
    const currentValue = formDataRef.current[info.field];
    const displayValue = info.formatter
      ? info.formatter(currentValue || "Not provided")
      : (currentValue || "Not provided") + (info.suffix || "");

    // ✅ Check if this is the birthday field
    const isBirthdayField = info.field === "birthday";

    return (
      <View className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-xl bg-cyan-50 items-center justify-center mr-3">
              <Feather name={info.icon} size={18} color="#0891b2" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-slate-500 font-medium mb-1">
                {info.title}
              </Text>

              {isEditMode && info.field ? (
                isBirthdayField ? (
                  // ✅ Birthday field with date picker
                  <TouchableOpacity
                    onPress={handleShowDatePicker}
                    className="text-base font-semibold text-slate-800 border-2 border-cyan-200 rounded-xl px-3 py-2 flex-row items-center justify-between"
                    style={{ minHeight: 40 }}
                  >
                    <Text className="text-base font-semibold text-slate-800">
                      {formatDate(currentValue) || "Select date"}
                    </Text>
                    <Feather name="calendar" size={16} color="#0891b2" />
                  </TouchableOpacity>
                ) : (
                  // Regular text input for other fields
                  <TextInput
                    defaultValue={currentValue}
                    onChangeText={(text) => handleInputChange(info.field, text)}
                    className="text-base font-semibold text-slate-800 border-2 border-cyan-200 rounded-xl px-3 py-2"
                    multiline={info.field === "address"}
                    style={{ minHeight: info.field === "address" ? 60 : 40 }}
                  />
                )
              ) : (
                <Text className="text-base font-semibold text-slate-800">
                  {info.value || displayValue}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <View className="mt-4">
            {personalInfo.map((info, index) => (
              <InfoCard key={`personal-${index}`} info={info} />
            ))}
          </View>
        );
      case "medical":
        return (
          <View className="mt-4">
            {medicalInfo.map((info, index) => (
              <InfoCard key={`medical-${index}`} info={info} />
            ))}
          </View>
        );
      case "contact":
        return (
          <View className="mt-4">
            {contactInfo.map((info, index) => (
              <InfoCard key={`contact-${index}`} info={info} />
            ))}
          </View>
        );
      case "emergency":
        return (
          <View className="mt-4">
            {guardianInfo.map((info, index) => (
              <InfoCard key={`emergency-${index}`} info={info} />
            ))}
          </View>
        );
      case "system":
        return (
          <View className="mt-4">
            {systemInfo.map((info, index) => (
              <View
                key={`system-${index}`}
                className="bg-white rounded-2xl p-4 mb-3 border border-slate-100"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl bg-cyan-50 items-center justify-center mr-3">
                    <Feather name={info.icon} size={18} color="#0891b2" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-slate-500 font-medium mb-1">
                      {info.title}
                    </Text>
                    <Text className="text-base font-semibold text-slate-800">
                      {info.value}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      case "appointments":
        return (
          <View className="mt-4">
            {appointmentsLoading ? (
              <View className="bg-white rounded-2xl p-6 items-center">
                <ActivityIndicator size="small" color="#0891b2" />
                <Text className="text-slate-600 mt-3 text-sm">
                  Loading appointments...
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {appointments.slice(0, 5).map((appointment) => {
                  const appointmentDate = formatDate(
                    appointment.appointment_date
                  );
                  const appointmentTime = new Date(
                    appointment.schedule
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const statusConfig = {
                    0: {
                      label: "Pending",
                      color: "bg-yellow-100 text-yellow-700",
                    },
                    1: {
                      label: "Scheduled",
                      color: "bg-cyan-100 text-cyan-700",
                    },
                    2: {
                      label: "Completed",
                      color: "bg-emerald-100 text-emerald-700",
                    },
                    3: { label: "Cancelled", color: "bg-red-100 text-red-700" },
                  };

                  const status =
                    statusConfig[appointment.status] || statusConfig[0];

                  return (
                    <View
                      key={appointment.id}
                      className="bg-white rounded-2xl p-4 border border-slate-100"
                    >
                      <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-1">
                          <Text className="font-bold text-slate-800 text-base mb-1">
                            {appointment.doctor_name || "Medical Consultation"}
                          </Text>
                          <Text className="text-cyan-600 text-sm font-medium">
                            {appointment.doctor_specialization ||
                              "General Medicine"}
                          </Text>
                        </View>
                        <View
                          className={`px-3 py-1 rounded-full ${status.color}`}
                        >
                          <Text className="text-xs font-semibold">
                            {status.label}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                          <Feather name="calendar" size={14} color="#64748b" />
                          <Text className="text-slate-600 text-sm ml-2 font-medium">
                            {appointmentDate}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Feather name="clock" size={14} color="#64748b" />
                          <Text className="text-slate-600 text-sm ml-2 font-medium">
                            {appointmentTime}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center justify-between pt-3 border-t border-slate-100">
                        <View className="flex-row items-center">
                          <Feather name="map-pin" size={14} color="#64748b" />
                          <Text className="text-slate-600 text-sm ml-2">
                            {appointment.clinic_name || "Main Clinic"}
                          </Text>
                        </View>
                        <Text className="text-slate-700 font-semibold">
                          ₱{appointment.consultation_fees || "0.00"}
                        </Text>
                      </View>
                    </View>
                  );
                })}

                {appointments.length > 5 && (
                  <TouchableOpacity className="bg-slate-50 rounded-2xl p-4 border border-slate-200 items-center">
                    <Text className="text-cyan-600 font-semibold">
                      View All Appointments ({appointments.length})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingBottom: insets.bottom }}
    >
      <StatusBar barStyle="dark-content" />
      <Header />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Header with Gradient */}
        <View className="bg-gradient-to-b from-cyan-500 to-cyan-600 pt-6 pb-8 px-6">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleUpdateProfilePicture}
              disabled={isUploadingPhoto}
              activeOpacity={0.7}
            >
              <View className="w-20 h-20 rounded-2xl bg-white/20 items-center justify-center mr-4 border-2 border-white/30 relative">
                {isUploadingPhoto && (
                  <View className="absolute inset-0 bg-black/50 rounded-2xl items-center justify-center z-10">
                    <ActivityIndicator size="small" color="#ffffff" />
                  </View>
                )}

                {displayData.profilePicture ? (
                  <Image
                    source={{ uri: displayData.profilePicture }}
                    className="w-full h-full rounded-2xl"
                  />
                ) : patient?.photo ? (
                  <Image
                    source={{ uri: patient.photo }}
                    className="w-full h-full rounded-2xl"
                  />
                ) : (
                  <View className="w-full bg-cyan-500 h-full items-center justify-center rounded-md">
                    <Feather name="user" color={"white"} size={34} />
                  </View>
                )}

                {!isUploadingPhoto && (
                  <View className="absolute bottom-0 right-0 bg-cyan-600 rounded-full p-1 border-2 border-white">
                    <Feather name="camera" size={14} color="#ffffff" />
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <View className="flex-1">
              <Text className="text-2xl font-bold text-cyan-900 mb-1">
                {displayData.name}
              </Text>
              <Text className="text-cyan-900 text-base mb-2">
                {formDataRef.current.email || "Not provided"}
              </Text>
              <View className="flex-row">
                <View className="bg-cyan-900/20 px-3 py-1 rounded-lg mr-2">
                  <Text className="text-cyan-800 font-medium text-xs">
                    Patient
                  </Text>
                </View>
                <View className="bg-emerald-400 px-3 py-1 rounded-lg">
                  <Text className="text-white font-medium text-xs">Active</Text>
                </View>
              </View>
            </View>
          </View>
          <View className="flex-row justify-between mt-6">
            <View className="items-start">
              <Text className="text-cyan-900 text-sm font-medium mb-1">
                Patient ID
              </Text>
              <Text className="text-cyan-800 font-bold text-lg">
                #{displayData.patientId}
              </Text>
            </View>
            <View className="items-start">
              <Text className="text-cyan-900 text-sm font-medium mb-1">
                Member Since
              </Text>
              <Text className="text-cyan-800 font-bold text-lg">
                {formatDate(displayData.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 -mt-4">
          <View className="bg-white rounded-2xl p-4 shadow-lg shadow-black/10 border border-slate-100">
            <View className="flex-row justify-between">
              {[
                { icon: "calendar", label: "Appointments" },
                { icon: "bell", label: "Reminders" },
                { icon: "users", label: "My Doctors" },
                { icon: "shield", label: "Insurance" },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="items-center flex-1"
                  activeOpacity={0.7}
                >
                  <View className="w-12 h-12 rounded-xl bg-cyan-50 items-center justify-center mb-2">
                    <Feather name={item.icon} size={20} color="#0891b2" />
                  </View>
                  <Text className="text-slate-700 font-medium text-xs text-center">
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Referral Banner */}
        <View className="px-6 mt-4">
          <View className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-cyan-800 font-bold text-lg mb-1">
                  Refer a friend
                </Text>
                <Text className="text-cyan-800 text-sm">
                  Get 30% discount on your next appointment
                </Text>
              </View>
              <TouchableOpacity className="bg-white rounded-xl px-4 py-2">
                <Text className="text-cyan-600 font-semibold text-sm">
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View className="px-6 mt-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row space-x-2">
              {[
                { title: "Personal", tabName: "personal", icon: "user" },
                { title: "Medical", tabName: "medical", icon: "heart" },
                { title: "Contact", tabName: "contact", icon: "phone" },
                { title: "Emergency", tabName: "emergency", icon: "users" },
                { title: "System", tabName: "system", icon: "settings" },
                {
                  title: "Appointments",
                  tabName: "appointments",
                  icon: "calendar",
                },
              ].map((tab) => (
                <TabButton key={tab.tabName} {...tab} />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View className="px-6">{renderTabContent()}</View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            maximumDate={new Date()} // Can't select future dates
            minimumDate={new Date(1900, 0, 1)} // Reasonable minimum date
          />
        )}

        {/* Edit Mode Actions */}
        {isEditMode && (
          <View className="px-6 mt-6 flex-row gap-3">
            <TouchableOpacity
              onPress={handleCancelEdit}
              className="flex-1 bg-slate-200 py-4 rounded-2xl"
              activeOpacity={0.8}
            >
              <Text className="text-slate-700 font-semibold text-center text-base">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveChanges}
              disabled={isLoading}
              className="flex-1 bg-cyan-500 py-4 rounded-2xl"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-center text-base">
                {isLoading ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Edit Profile Button */}
        {!isEditMode && (
          <View className="px-6 mt-4">
            <TouchableOpacity
              onPress={handleEditClick}
              className="flex-row items-center justify-center gap-2 bg-cyan-500 px-4 py-4 rounded-2xl"
              activeOpacity={0.8}
            >
              <Feather name="edit" size={18} color="#ffffff" />
              <Text className="text-white font-semibold text-base">
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
