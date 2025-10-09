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
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Information organized by tabs
  const personalInfo = [
    {
      title: "Full Name",
      value: updatedUser.name,
      icon: "user",
      color: "#475569",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      name: "name",
    },
    {
      title: "Age",
      value: updatedUser.age ? `${updatedUser.age} years` : "Not provided",
      icon: "calendar",
      color: "#0891b2",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      name: "age",
    },
    {
      title: "Gender",
      value: updatedUser.gender,
      icon: "user-check",
      color: "#059669",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      name: "gender",
    },
    {
      title: "Birthday",
      value: formatDate(updatedUser.birthday),
      icon: "gift",
      color: "#f43f5e",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      name: "birthday",
    },
    {
      title: "Marital Status",
      value: updatedUser.maritalStatus,
      icon: "heart",
      color: "#ec4899",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      name: "maritalStatus",
    },
  ];

  const medicalInfo = [
    {
      title: "Blood Group",
      value: updatedUser.bloodGroup,
      icon: "droplet",
      color: "#dc2626",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      name: "bloodGroup",
    },
    {
      title: "Blood Pressure",
      value: updatedUser.bloodPressure,
      icon: "activity",
      color: "#ea580c",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      name: "bloodPressure",
    },
    {
      title: "Height",
      value: updatedUser.height,
      icon: "maximize",
      color: "#16a34a",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      name: "height",
    },
    {
      title: "Weight",
      value: updatedUser.weight,
      icon: "minimize",
      color: "#9333ea",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      name: "weight",
    },
  ];

  const contactInfo = [
    {
      title: "Email Address",
      value: updatedUser.email,
      icon: "mail",
      color: "#2563eb",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      name: "email",
    },
    {
      title: "Phone Number",
      value: updatedUser.phone,
      icon: "phone",
      color: "#16a34a",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      name: "phone",
    },
    {
      title: "Address",
      value: updatedUser.address,
      icon: "map-pin",
      color: "#ea580c",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      name: "address",
    },
  ];

  const guardianInfo = [
    {
      title: "Guardian Name",
      value: updatedUser.guardian,
      icon: "users",
      color: "#7c3aed",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      name: "guardian",
    },
    {
      title: "Relationship",
      value: updatedUser.relationship,
      icon: "link",
      color: "#0891b2",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      name: "relationship",
    },
    {
      title: "Guardian Phone",
      value: updatedUser.guardianPhone,
      icon: "phone-call",
      color: "#059669",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      name: "guardianPhone",
    },
  ];

  const systemInfo = [
    {
      title: "Patient Category",
      value: updatedUser.category,
      icon: "tag",
      color: "#6b7280",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      title: "Registration Source",
      value: updatedUser.source,
      icon: "download",
      color: "#8b5cf6",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
    {
      title: "Member Since",
      value: formatDate(updatedUser.createdAt),
      icon: "clock",
      color: "#f59e0b",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Last Updated",
      value: formatDate(updatedUser.updatedAt),
      icon: "refresh-cw",
      color: "#10b981",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
    },
  ];

  // Loading state
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
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
      className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg mx-1 ${
        activeTab === tabName ? "bg-cyan-600" : "bg-slate-100"
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
        className={`font-medium text-sm ${
          activeTab === tabName ? "text-white" : "text-slate-600"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Info card component for column layout
  const InfoCard = ({ info }) => (
    <View
      className="bg-white rounded-xl border border-slate-200 p-4 mb-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center mb-2">
        <View className={`p-2 rounded-lg ${info.bgColor} mr-3`}>
          <Feather name={info.icon} size={18} color={info.color} />
        </View>
        <Text className="text-sm text-slate-600 font-medium">{info.title}</Text>
      </View>
      {isEditMode && info.name ? (
        <TextInput
          value={info.value === "Not provided" ? "" : String(info.value)}
          onChangeText={(text) => handleInputChange(info.name, text)}
          className="text-base font-semibold text-slate-800 border-2 border-cyan-300 rounded-lg px-3 py-2 mt-1"
          multiline={info.name === "address"}
          style={{ minHeight: info.name === "address" ? 60 : 40 }}
        />
      ) : (
        <Text className="text-base font-semibold text-slate-800 ml-11">
          {info.value}
        </Text>
      )}
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
            <View
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              {loadingHistory ? (
                <View className="p-6 items-center">
                  <ActivityIndicator size="small" color="#0891b2" />
                  <Text className="text-slate-600 mt-3 text-sm">
                    Loading appointments...
                  </Text>
                </View>
              ) : appointmentHistory.length === 0 ? (
                <View className="p-8 items-center">
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
                appointmentHistory.map((appointment, index) => (
                  <View
                    key={appointment.id}
                    className={`p-4 ${index !== appointmentHistory.length - 1 ? "border-b border-slate-100" : ""}`}
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-bold text-slate-800 text-base flex-1">
                        {appointment.type}
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full border ${getStatusColor(appointment.status)}`}
                      >
                        <Text className="text-xs font-semibold capitalize">
                          {appointment.status}
                        </Text>
                      </View>
                    </View>
                    <View className="gap-1">
                      <Text className="text-slate-700 font-semibold text-sm">
                        {appointment.doctor}
                      </Text>
                      <Text className="text-slate-500 text-sm">
                        {appointment.clinic}
                      </Text>
                      <Text className="text-slate-500 text-xs mt-1">
                        {formatDate(appointment.date)}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      <Header />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-4">
          {/* Header Section */}
          <View
            className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className="w-20 h-20 rounded-full bg-cyan-600 items-center justify-center mr-4">
                {patient?.photo ? (
                  <Image
                    source={{ uri: patient.photo }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Text className="text-2xl font-bold text-white">
                    {initials}
                  </Text>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-2xl font-bold text-slate-800 mb-1">
                  {updatedUser.name}
                </Text>
                <Text className="text-slate-600 text-base mb-2">
                  {updatedUser.email}
                </Text>
                <View className="flex-row">
                  <View className="bg-cyan-100 px-3 py-1 rounded-md mr-2">
                    <Text className="text-cyan-700 font-medium text-xs">
                      Patient
                    </Text>
                  </View>
                  <View className="bg-emerald-100 px-3 py-1 rounded-md">
                    <Text className="text-emerald-700 font-medium text-xs">
                      Active
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="border-t border-slate-200 pt-4">
              <View className="flex-row justify-between mb-4">
                <View>
                  <Text className="text-sm text-slate-600 font-medium mb-1">
                    Patient ID
                  </Text>
                  <Text className="text-base font-bold text-cyan-700">
                    #{updatedUser.patientId}
                  </Text>
                </View>
                <View>
                  <Text className="text-sm text-slate-600 font-medium mb-1">
                    Member Since
                  </Text>
                  <Text className="text-base font-bold text-slate-800">
                    {formatDate(updatedUser.createdAt)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={isEditMode ? handleCancelEdit : handleEditClick}
                className="flex-row items-center justify-center gap-2 bg-cyan-600 px-4 py-3 rounded-lg"
                activeOpacity={0.8}
              >
                <Feather name="edit" size={18} color="#ffffff" />
                <Text className="text-white font-semibold text-base">
                  {isEditMode ? "Cancel" : "Edit Profile"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Navigation */}
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              <View className="flex-row">
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
          {renderTabContent()}

          {/* Save Buttons */}
          {isEditMode && (
            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity
                onPress={handleCancelEdit}
                className="flex-1 bg-gray-600 py-4 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-center text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveChanges}
                disabled={isLoading}
                className="flex-1 bg-cyan-600 py-4 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-center text-base">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
