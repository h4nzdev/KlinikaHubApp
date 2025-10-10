import React, { useContext, useState, useEffect } from "react";
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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";
import { AuthenticationContext } from "../../../context/AuthenticationContext";

const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthenticationContext);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  // Extract patient data - handle both nested and flat structures
  const patient = user?.patient || user;

  // User state with ALL fields from your data structure
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    patientId: "",
    birthday: "",
    bloodGroup: "",
    bloodPressure: "",
    height: "",
    weight: "",
    maritalStatus: "",
    guardian: "",
    relationship: "",
    guardianPhone: "",
    category: "",
    source: "",
    createdAt: "",
    updatedAt: "",
  });

  // Sync with context data - MAP ALL FIELDS
  useEffect(() => {
    if (patient) {
      console.log("Full patient data:", patient);

      setUpdatedUser({
        name:
          patient?.first_name && patient?.last_name
            ? `${patient.first_name} ${patient.last_name}`.trim()
            : patient?.name || "Not provided",
        age: patient?.age || "Not provided",
        gender: patient?.sex || patient?.gender || "Not provided",
        email: patient?.email || "Not provided",
        phone: patient?.mobileno || patient?.phone || "Not provided",
        address: patient?.address || "Not provided",
        role: patient?.role || "patient",
        patientId: patient?.patient_id || patient?.id || "N/A",
        birthday: patient?.birthday || "Not provided",
        bloodGroup: patient?.blood_group || "Not provided",
        bloodPressure: patient?.blood_pressure || "Not provided",
        height: patient?.height || "Not provided",
        weight: patient?.weight || "Not provided",
        maritalStatus:
          patient?.marital_status === "1"
            ? "Single"
            : patient?.marital_status === "2"
              ? "Married"
              : patient?.marital_status || "Not provided",
        guardian: patient?.guardian || "Not provided",
        relationship: patient?.relationship || "Not provided",
        guardianPhone: patient?.gua_mobileno || "Not provided",
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
      });
    }
  }, [patient]);

  // Mock appointment history
  useEffect(() => {
    setLoadingHistory(true);
    setTimeout(() => {
      setAppointmentHistory([
        {
          id: "1",
          date: "2024-01-15",
          type: "General Checkup",
          status: "completed",
          doctor: "Dr. Sarah Johnson",
          clinic: "Main Health Center",
        },
        {
          id: "2",
          date: "2024-01-10",
          type: "Dental Consultation",
          status: "scheduled",
          doctor: "Dr. Mike Chen",
          clinic: "Dental Care Clinic",
        },
      ]);
      setLoadingHistory(false);
    }, 1000);
  }, []);

  const initials = updatedUser?.name
    ? updatedUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleInputChange = (name, value) => {
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsEditMode(false);
      Alert.alert("Success", "Profile updated successfully!");
    }, 1000);
  };

  const handleCancelEdit = () => {
    if (patient) {
      setUpdatedUser({
        name:
          patient?.first_name && patient?.last_name
            ? `${patient.first_name} ${patient.last_name}`.trim()
            : patient?.name || "Not provided",
        age: patient?.age || "Not provided",
        gender: patient?.sex || patient?.gender || "Not provided",
        email: patient?.email || "Not provided",
        phone: patient?.mobileno || patient?.phone || "Not provided",
        address: patient?.address || "Not provided",
        role: patient?.role || "patient",
        patientId: patient?.patient_id || patient?.id || "N/A",
        birthday: patient?.birthday || "Not provided",
        bloodGroup: patient?.blood_group || "Not provided",
        bloodPressure: patient?.blood_pressure || "Not provided",
        height: patient?.height || "Not provided",
        weight: patient?.weight || "Not provided",
        maritalStatus:
          patient?.marital_status === "1"
            ? "Single"
            : patient?.marital_status === "2"
              ? "Married"
              : patient?.marital_status || "Not provided",
        guardian: patient?.guardian || "Not provided",
        relationship: patient?.relationship || "Not provided",
        guardianPhone: patient?.gua_mobileno || "Not provided",
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
      });
    }
    setIsEditMode(false);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Not available") return "Not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-cyan-100 text-cyan-700";
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Information organized by tabs
  const personalInfo = [
    {
      title: "Full Name",
      value: updatedUser.name,
      icon: "user",
      name: "name",
    },
    {
      title: "Age",
      value: updatedUser.age ? `${updatedUser.age} years` : "Not provided",
      icon: "calendar",
      name: "age",
    },
    {
      title: "Gender",
      value: updatedUser.gender,
      icon: "user-check",
      name: "gender",
    },
    {
      title: "Birthday",
      value: formatDate(updatedUser.birthday),
      icon: "gift",
      name: "birthday",
    },
    {
      title: "Marital Status",
      value: updatedUser.maritalStatus,
      icon: "heart",
      name: "maritalStatus",
    },
  ];

  const medicalInfo = [
    {
      title: "Blood Group",
      value: updatedUser.bloodGroup,
      icon: "droplet",
      name: "bloodGroup",
    },
    {
      title: "Blood Pressure",
      value: updatedUser.bloodPressure,
      icon: "activity",
      name: "bloodPressure",
    },
    {
      title: "Height",
      value: updatedUser.height,
      icon: "maximize",
      name: "height",
    },
    {
      title: "Weight",
      value: updatedUser.weight,
      icon: "minimize",
      name: "weight",
    },
  ];

  const contactInfo = [
    {
      title: "Email Address",
      value: updatedUser.email,
      icon: "mail",
      name: "email",
    },
    {
      title: "Phone Number",
      value: updatedUser.phone,
      icon: "phone",
      name: "phone",
    },
    {
      title: "Address",
      value: updatedUser.address,
      icon: "map-pin",
      name: "address",
    },
  ];

  const guardianInfo = [
    {
      title: "Guardian Name",
      value: updatedUser.guardian,
      icon: "users",
      name: "guardian",
    },
    {
      title: "Relationship",
      value: updatedUser.relationship,
      icon: "link",
      name: "relationship",
    },
    {
      title: "Guardian Phone",
      value: updatedUser.guardianPhone,
      icon: "phone-call",
      name: "guardianPhone",
    },
  ];

  const systemInfo = [
    {
      title: "Patient Category",
      value: updatedUser.category,
      icon: "tag",
    },
    {
      title: "Registration Source",
      value: updatedUser.source,
      icon: "download",
    },
    {
      title: "Member Since",
      value: formatDate(updatedUser.createdAt),
      icon: "clock",
    },
    {
      title: "Last Updated",
      value: formatDate(updatedUser.updatedAt),
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

  // Info card component for modern layout
  const InfoCard = ({ info }) => (
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
            {isEditMode && info.name ? (
              <TextInput
                value={info.value === "Not provided" ? "" : String(info.value)}
                onChangeText={(text) => handleInputChange(info.name, text)}
                className="text-base font-semibold text-slate-800 border-2 border-cyan-200 rounded-xl px-3 py-2"
                multiline={info.name === "address"}
                style={{ minHeight: info.name === "address" ? 60 : 40 }}
              />
            ) : (
              <Text className="text-base font-semibold text-slate-800">
                {info.value}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <View className="mt-4">
            {personalInfo.map((info, index) => (
              <InfoCard key={index} info={info} />
            ))}
          </View>
        );
      case "medical":
        return (
          <View className="mt-4">
            {medicalInfo.map((info, index) => (
              <InfoCard key={index} info={info} />
            ))}
          </View>
        );
      case "contact":
        return (
          <View className="mt-4">
            {contactInfo.map((info, index) => (
              <InfoCard key={index} info={info} />
            ))}
          </View>
        );
      case "emergency":
        return (
          <View className="mt-4">
            {guardianInfo.map((info, index) => (
              <InfoCard key={index} info={info} />
            ))}
          </View>
        );
      case "system":
        return (
          <View className="mt-4">
            {systemInfo.map((info, index) => (
              <InfoCard key={index} info={info} />
            ))}
          </View>
        );
      case "appointments":
        return (
          <View className="mt-4">
            {loadingHistory ? (
              <View className="bg-white rounded-2xl p-6 items-center">
                <ActivityIndicator size="small" color="#0891b2" />
                <Text className="text-slate-600 mt-3 text-sm">
                  Loading appointments...
                </Text>
              </View>
            ) : appointmentHistory.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 items-center">
                <View className="bg-slate-100 rounded-xl p-4 mb-3">
                  <Feather name="calendar" size={32} color="#cbd5e1" />
                </View>
                <Text className="text-base font-bold text-slate-700 mb-1">
                  No appointments yet
                </Text>
                <Text className="text-slate-500 text-center text-sm">
                  Your appointment history will appear here
                </Text>
              </View>
            ) : (
              appointmentHistory.map((appointment) => (
                <View
                  key={appointment.id}
                  className="bg-white rounded-2xl p-4 mb-3 border border-slate-100"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <Text className="font-bold text-slate-800 text-lg flex-1">
                      {appointment.type}
                    </Text>
                    <View
                      className={`px-3 py-1 rounded-full ${getStatusColor(appointment.status)}`}
                    >
                      <Text className="text-xs font-semibold capitalize">
                        {appointment.status}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <Feather name="user" size={14} color="#64748b" />
                    <Text className="text-slate-700 font-medium text-sm ml-2">
                      {appointment.doctor}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <Feather name="map-pin" size={14} color="#64748b" />
                    <Text className="text-slate-600 text-sm ml-2">
                      {appointment.clinic}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="calendar" size={14} color="#64748b" />
                    <Text className="text-slate-600 text-sm ml-2">
                      {formatDate(appointment.date)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
            <View className="w-20 h-20 rounded-2xl bg-white/20 items-center justify-center mr-4 border-2 border-white/30">
              {patient?.photo ? (
                <Image
                  source={{ uri: patient.photo }}
                  className="w-full h-full rounded-2xl"
                />
              ) : (
                <Text className="text-2xl font-bold text-white">
                  {initials}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-2xl font-bold text-cyan-900 mb-1">
                {updatedUser.name}
              </Text>
              <Text className="text-cyan-900 text-base mb-2">
                {updatedUser.email}
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
                #{updatedUser.patientId}
              </Text>
            </View>
            <View className="items-start">
              <Text className="text-cyan-900 text-sm font-medium mb-1">
                Member Since
              </Text>
              <Text className="text-cyan-800 font-bold text-lg">
                {formatDate(updatedUser.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 -mt-4">
          <View className="bg-white rounded-2xl p-4 shadow-lg shadow-black/10 border border-slate-100">
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="items-center flex-1"
                activeOpacity={0.7}
              >
                <View className="w-12 h-12 rounded-xl bg-cyan-50 items-center justify-center mb-2">
                  <Feather name="calendar" size={20} color="#0891b2" />
                </View>
                <Text className="text-slate-700 font-medium text-xs text-center">
                  Appointments
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center flex-1"
                activeOpacity={0.7}
              >
                <View className="w-12 h-12 rounded-xl bg-cyan-50 items-center justify-center mb-2">
                  <Feather name="bell" size={20} color="#0891b2" />
                </View>
                <Text className="text-slate-700 font-medium text-xs text-center">
                  Reminders
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center flex-1"
                activeOpacity={0.7}
              >
                <View className="w-12 h-12 rounded-xl bg-cyan-50 items-center justify-center mb-2">
                  <Feather name="users" size={20} color="#0891b2" />
                </View>
                <Text className="text-slate-700 font-medium text-xs text-center">
                  My Doctors
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center flex-1"
                activeOpacity={0.7}
              >
                <View className="w-12 h-12 rounded-xl bg-cyan-50 items-center justify-center mb-2">
                  <Feather name="shield" size={20} color="#0891b2" />
                </View>
                <Text className="text-slate-700 font-medium text-xs text-center">
                  Insurance
                </Text>
              </TouchableOpacity>
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
              <TabButton title="Personal" tabName="personal" icon="user" />
              <TabButton title="Medical" tabName="medical" icon="heart" />
              <TabButton title="Contact" tabName="contact" icon="phone" />
              <TabButton title="Emergency" tabName="emergency" icon="users" />
              <TabButton title="System" tabName="system" icon="settings" />
              <TabButton
                title="Appointments"
                tabName="appointments"
                icon="calendar"
              />
            </View>
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View className="px-6">{renderTabContent()}</View>

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
