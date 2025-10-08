import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../components/Header";

// Mock medical records data
const mockRecords = [
  {
    _id: "1",
    doctorId: { name: "Dr. Sarah Johnson" },
    clinicId: { clinicName: "Kinika Medical Center" },
    appointmentId: { _id: "apt123", date: "2024-01-15T10:00:00" },
    diagnosis: "Seasonal allergies with mild respiratory symptoms",
    treatment: "Antihistamines, rest, and increased fluid intake",
    createdAt: "2024-01-15T10:30:00",
  },
  {
    _id: "2",
    doctorId: { name: "Dr. Mike Chen" },
    clinicId: { clinicName: "Kinika Medical Center" },
    appointmentId: { _id: "apt124", date: "2024-01-10T14:00:00" },
    diagnosis: "Routine checkup - All vitals normal",
    treatment: "Continue healthy lifestyle, follow-up in 6 months",
    createdAt: "2024-01-10T14:30:00",
  },
  {
    _id: "3",
    doctorId: { name: "Dr. Emily Rodriguez" },
    clinicId: { clinicName: "Kinika Medical Center" },
    appointmentId: { _id: "apt125", date: "2023-12-20T09:00:00" },
    diagnosis: "Minor skin irritation",
    treatment: "Topical cream application twice daily",
    createdAt: "2023-12-20T09:30:00",
  },
];

const MedicalRecords = ({ navigation }) => {
  const [records] = useState(mockRecords);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const openModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleDownloadAll = () => {
    Alert.alert(
      "Download Records",
      "Medical records will be downloaded as PDF",
      [{ text: "OK" }]
    );
  };

  // Stats data
  const stats = [
    {
      title: "Total Records",
      value: records.length,
      icon: "file-text",
      color: "bg-slate-50",
      iconBg: "bg-slate-200",
      iconColor: "#475569",
      textColor: "text-slate-600",
      borderColor: "border-slate-200",
    },
    {
      title: "This Year",
      value: records.filter((r) => new Date(r.createdAt).getFullYear() === 2024)
        .length,
      icon: "calendar",
      color: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "#0891b2",
      textColor: "text-cyan-600",
      borderColor: "border-cyan-200",
    },
    {
      title: "Doctors Seen",
      value: new Set(records.map((r) => r.doctorId.name)).size,
      icon: "user",
      color: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "#059669",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
    {
      title: "Last Visit",
      value: "Jan 15",
      icon: "clock",
      color: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "#9333ea",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
  ];

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
          <View>
            <View className="gap-6">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-slate-800">
                  Medical Records
                </Text>
                <Text className="text-slate-600 mt-3 text-lg">
                  Access your appointment history and medical records.
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleDownloadAll}
                className="flex-row items-center justify-center px-8 py-4 bg-cyan-500 rounded-2xl shadow-lg"
              >
                <Feather name="download" size={20} color="#ffffff" />
                <Text className="text-white font-semibold ml-3 text-lg">
                  Download All Records
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Section */}
          <View>
            <View className="gap-4">
              {/* First Row - 2 stats */}
              <View className="flex-row gap-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <View key={index} className="flex-1">
                    <View
                      className={`${stat.color} border border-white/20 rounded-2xl p-6 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={2}
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-3 opacity-80`}
                          >
                            {stat.title}
                          </Text>
                          <Text className="text-3xl font-bold text-slate-800">
                            {stat.value}
                          </Text>
                        </View>
                        <View
                          className={`p-3 rounded-xl ${stat.iconBg} ml-3 shadow-md border ${stat.borderColor}`}
                        >
                          <Feather
                            name={stat.icon}
                            size={24}
                            color={stat.iconColor}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Second Row - 2 stats */}
              <View className="flex-row gap-4">
                {stats.slice(2, 4).map((stat, index) => (
                  <View key={index + 2} className="flex-1">
                    <View
                      className={`${stat.color} border border-white/20 rounded-2xl p-6 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-3 opacity-80`}
                          >
                            {stat.title}
                          </Text>
                          <Text className="text-3xl font-bold text-slate-800">
                            {stat.value}
                          </Text>
                        </View>
                        <View
                          className={`p-3 rounded-xl ${stat.iconBg} ml-3 shadow-md border ${stat.borderColor}`}
                        >
                          <Feather
                            name={stat.icon}
                            size={24}
                            color={stat.iconColor}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Section Header */}
          <View>
            <Text className="text-2xl font-bold text-slate-800 mb-2">
              All Medical Records
            </Text>
            <Text className="text-slate-600 text-lg">
              {records.length} medical record{records.length !== 1 ? "s" : ""}{" "}
              found
            </Text>
          </View>

          {/* Records List */}
          {records.length > 0 ? (
            <View className="gap-4">
              {records.map((record, index) => (
                <View
                  key={index}
                  className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6"
                >
                  <View className="flex-grow">
                    <Text className="text-xl font-bold text-slate-800 tracking-tight">
                      {record.doctorId.name}
                    </Text>
                    <Text className="text-cyan-600 font-semibold text-sm tracking-wide uppercase mt-1">
                      {formatDate(record.createdAt)}
                    </Text>
                    <View className="my-4 h-px bg-slate-200" />
                    <Text className="text-slate-700 mb-4 font-medium leading-relaxed">
                      {record.diagnosis}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => openModal(record)}
                    className="flex-row items-center justify-center p-3 bg-slate-100/80 rounded-lg border border-slate-200/50"
                    activeOpacity={0.7}
                  >
                    <Feather name="eye" size={20} color="#334155" />
                    <Text className="font-semibold tracking-wide text-slate-700 ml-2">
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-12 items-center">
              <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                <Feather name="file-text" size={64} color="#9ca3af" />
              </View>
              <Text className="text-xl font-bold text-slate-700 mb-2">
                No medical records found
              </Text>
              <Text className="text-slate-500 text-lg text-center">
                Your medical records will appear here after appointments.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Record Details Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[80%]">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-slate-200">
              <Text className="text-xl font-bold text-slate-800">
                Medical Record Details
              </Text>
              <TouchableOpacity onPress={closeModal} activeOpacity={0.7}>
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
              {selectedRecord && (
                <View className="gap-6">
                  {/* Doctor Info */}
                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Doctor
                    </Text>
                    <Text className="text-lg font-bold text-slate-800">
                      {selectedRecord.doctorId.name}
                    </Text>
                  </View>

                  {/* Clinic Info */}
                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Clinic
                    </Text>
                    <Text className="text-lg font-semibold text-slate-700">
                      {selectedRecord.clinicId.clinicName}
                    </Text>
                  </View>

                  {/* Date & Time */}
                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Date & Time
                    </Text>
                    <Text className="text-lg font-semibold text-slate-700">
                      {formatDate(selectedRecord.createdAt)}
                    </Text>
                    <Text className="text-base text-slate-500 font-medium">
                      {formatTime(selectedRecord.createdAt)}
                    </Text>
                  </View>

                  {/* Appointment ID */}
                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Appointment ID
                    </Text>
                    <Text className="text-base font-medium text-slate-700">
                      #{selectedRecord.appointmentId._id.slice(-8)}
                    </Text>
                  </View>

                  {/* Diagnosis */}
                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Diagnosis
                    </Text>
                    <Text className="text-base font-semibold text-slate-700 leading-relaxed">
                      {selectedRecord.diagnosis}
                    </Text>
                  </View>

                  {/* Treatment */}
                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Treatment
                    </Text>
                    <Text className="text-base font-semibold text-slate-700 leading-relaxed">
                      {selectedRecord.treatment}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="gap-3 pt-4">
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert("Download", "Record will be downloaded");
                        closeModal();
                      }}
                      className="flex-row items-center justify-center px-6 py-4 bg-cyan-500 rounded-xl shadow-lg"
                      activeOpacity={0.8}
                    >
                      <Feather name="download" size={20} color="#ffffff" />
                      <Text className="text-white font-semibold ml-2 text-base">
                        Download Record
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={closeModal}
                      className="flex-row items-center justify-center px-6 py-4 bg-slate-100 rounded-xl border border-slate-200"
                      activeOpacity={0.7}
                    >
                      <Text className="text-slate-700 font-semibold text-base">
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MedicalRecords;
