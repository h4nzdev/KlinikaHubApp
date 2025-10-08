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
import Header from "../../components/Header";

const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock static data
  const [user] = useState({
    name: "Hanz Christian Angelo G Magbal",
    email: "hanz@example.com",
    role: "Patient",
    _id: "PAT123456",
    createdAt: "2024-01-01",
    patientPicture: null,
  });

  const [updatedUser, setUpdatedUser] = useState({
    name: user.name,
    age: "28",
    gender: "Male",
    email: user.email,
    phone: "+1 234 567 8900",
    address: "123 Main Street, City, State 12345",
  });

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Mock appointment history
  const [appointmentHistory] = useState([
    {
      id: "1",
      date: "2024-01-15",
      type: "Checkup",
      status: "completed",
      clinicId: { _id: "CLINIC001" },
      doctorId: { _id: "DOC001" },
    },
    {
      id: "2",
      date: "2024-01-10",
      type: "Consultation",
      status: "scheduled",
      clinicId: { _id: "CLINIC001" },
      doctorId: { _id: "DOC002" },
    },
  ]);

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
    setUpdatedUser({
      name: user.name,
      age: "28",
      gender: "Male",
      email: user.email,
      phone: "+1 234 567 8900",
      address: "123 Main Street, City, State 12345",
    });
    setIsEditMode(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const stats = [
    {
      title: "Full Name",
      value: updatedUser?.name || "",
      icon: "user",
      color: "#475569",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      name: "name",
    },
    {
      title: "Age",
      value: `${updatedUser?.age || ""} years`,
      icon: "calendar",
      color: "#0891b2",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      name: "age",
    },
    {
      title: "Gender",
      value: updatedUser?.gender || "",
      icon: "user-check",
      color: "#059669",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      name: "gender",
    },
    {
      title: "Role",
      value: user.role || "",
      icon: "user",
      color: "#9333ea",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      name: "role",
      isEditable: false,
    },
  ];

  const contactInfo = [
    {
      title: "Email Address",
      value: updatedUser?.email || "",
      icon: "mail",
      color: "#2563eb",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      name: "email",
    },
    {
      title: "Phone Number",
      value: updatedUser?.phone || "",
      icon: "phone",
      color: "#16a34a",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      name: "phone",
    },
    {
      title: "Address",
      value: updatedUser?.address || "",
      icon: "map-pin",
      color: "#ea580c",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      name: "address",
    },
  ];

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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-4 gap-8">
          {/* Header Section */}
          <View className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
            <View className="gap-6">
              {/* Avatar and Name */}
              <View className="flex-column items-center gap-6">
                <View className="w-28 h-28 rounded-full bg-cyan-700 items-center justify-center shadow-lg">
                  {user.patientPicture ? (
                    <Image
                      source={{ uri: user.patientPicture }}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <Text className="text-3xl font-bold text-white tracking-wide">
                      {initials}
                    </Text>
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-3xl font-bold text-slate-800 tracking-tight">
                    {user.name}
                  </Text>
                  <Text className="text-slate-600 mt-2 text-lg font-medium">
                    {user.email}
                  </Text>
                  <View className="flex-row flex-wrap gap-3 mt-3">
                    <View className="bg-cyan-100 px-4 py-2 rounded-lg border border-cyan-200">
                      <Text className="text-cyan-700 font-semibold text-sm uppercase tracking-wide">
                        {user.role}
                      </Text>
                    </View>
                    <View className="bg-emerald-100 px-4 py-2 rounded-lg border border-emerald-200">
                      <Text className="text-emerald-700 font-semibold text-sm tracking-wide">
                        Active
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Registration Info and Edit Button */}
              <View className="border-t border-slate-200 pt-6 gap-4">
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Registered Date
                    </Text>
                    <Text className="text-lg font-bold text-slate-800 mt-1">
                      {formatDate(user.createdAt)}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Patient ID
                    </Text>
                    <Text className="text-base font-bold text-cyan-700 mt-1">
                      {user._id}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={isEditMode ? handleCancelEdit : handleEditClick}
                  disabled={isLoading}
                  className="flex-row items-center justify-center bg-cyan-600 px-4 py-3 rounded-lg gap-2"
                  activeOpacity={0.8}
                >
                  <Feather name="edit" size={18} color="#ffffff" />
                  <Text className="text-white font-semibold text-base">
                    {isEditMode ? "Cancel" : "Edit Profile"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Personal Information Section */}
          <View>
            <Text className="text-2xl font-bold text-slate-800 tracking-tight mb-6">
              Personal Information
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {stats.map((stat, index) => (
                <View key={index} className="w-full">
                  <View
                    className={`${stat.bgColor} rounded-xl p-4 border ${stat.borderColor} shadow-sm`}
                  >
                    <View className="gap-3 flex-row">
                      <View
                        className={`p-3 ${stat.bgColor} rounded-lg border ${stat.borderColor} self-start`}
                      >
                        <Feather
                          name={stat.icon}
                          size={24}
                          color={stat.color}
                        />
                      </View>
                      <View className="flex-1">
                        {" "}
                        {/* Add flex-1 here */}
                        <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                          {stat.title}
                        </Text>
                        <Text
                          className="text-xl font-bold mt-2 capitalize flex-wrap"
                          style={{ color: stat.color }}
                          numberOfLines={0}
                        >
                          {stat.value}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Contact Information Section */}
          <View>
            <Text className="text-2xl font-bold text-slate-800 tracking-tight mb-6">
              Contact Information
            </Text>
            <View className="gap-6">
              {contactInfo.map((contact, index) => (
                <View
                  key={index}
                  className="bg-white/80 rounded-xl border border-slate-200/50 shadow-lg p-6"
                >
                  <View className="flex-row gap-4">
                    <View
                      className={`p-4 ${contact.bgColor} rounded-lg border ${contact.borderColor}`}
                    >
                      <Feather
                        name={contact.icon}
                        size={28}
                        color={contact.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                        {contact.title}
                      </Text>
                      {isEditMode ? (
                        <TextInput
                          value={contact.value}
                          onChangeText={(text) =>
                            handleInputChange(contact.name, text)
                          }
                          multiline={contact.name === "address"}
                          numberOfLines={contact.name === "address" ? 2 : 1}
                          className="text-lg font-semibold mt-2 bg-white/70 border-2 border-slate-300 rounded px-3 py-2"
                          style={{
                            color: contact.color,
                            textAlignVertical: "top",
                          }}
                          editable={!isLoading}
                        />
                      ) : (
                        <Text
                          className="text-lg font-semibold mt-2"
                          style={{ color: contact.color }}
                        >
                          {contact.value}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Save/Cancel Buttons */}
          {isEditMode && (
            <View className="flex-row justify-end gap-4">
              <TouchableOpacity
                onPress={handleCancelEdit}
                disabled={isLoading}
                className="bg-gray-600 px-6 py-3 rounded-lg"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-lg">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveChanges}
                disabled={isLoading}
                className="bg-cyan-600 px-6 py-3 rounded-lg"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-lg">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Appointment History Section */}
          <View>
            <View className="mb-6 gap-2">
              <Text className="text-2xl font-bold text-slate-800 tracking-tight">
                Appointment History
              </Text>
              <Text className="text-lg text-slate-600 font-medium">
                Total {appointmentHistory.length} Appointments
              </Text>
            </View>

            <View className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
              {appointmentHistory.length === 0 ? (
                <View className="p-6 items-center">
                  <Text className="text-slate-600 text-lg text-center">
                    No appointment history yet.
                  </Text>
                </View>
              ) : (
                <View className="gap-px bg-slate-100">
                  {appointmentHistory.map((record, index) => (
                    <View
                      key={index}
                      className="bg-white p-4 border-b border-slate-100"
                    >
                      <View className="gap-3">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-2">
                            <Feather
                              name="calendar"
                              size={18}
                              color="#64748b"
                            />
                            <Text className="text-base font-semibold text-slate-700">
                              {formatDate(record.date)}
                            </Text>
                          </View>
                          <View
                            className={`px-3 py-1.5 rounded-full border ${getStatusColor(
                              record.status
                            )}`}
                          >
                            <Text className="text-sm font-semibold capitalize">
                              {record.status}
                            </Text>
                          </View>
                        </View>

                        <View className="gap-2">
                          <View>
                            <Text className="text-sm text-slate-500 uppercase font-medium">
                              Type
                            </Text>
                            <Text className="text-base font-semibold text-slate-700">
                              {record.type}
                            </Text>
                          </View>
                          <View className="flex-row gap-4">
                            <View className="flex-1">
                              <Text className="text-sm text-slate-500 uppercase font-medium">
                                Clinic ID
                              </Text>
                              <Text className="text-sm font-medium text-slate-800">
                                {record.clinicId._id}
                              </Text>
                            </View>
                            <View className="flex-1">
                              <Text className="text-sm text-slate-500 uppercase font-medium">
                                Doctor ID
                              </Text>
                              <Text className="text-sm font-medium text-slate-800">
                                {record.doctorId._id}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
