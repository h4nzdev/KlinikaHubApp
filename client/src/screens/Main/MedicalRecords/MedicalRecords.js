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
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";

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
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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

  // EXACT SAME STATS DESIGN AS DASHBOARD
  const stats = [
    {
      title: "Total Records",
      value: records.length,
      icon: "file-text",
      color: "bg-white",
      iconColor: "#ffffff",
      iconBg: "bg-slate-500",
    },
    {
      title: "This Year",
      value: records.filter((r) => new Date(r.createdAt).getFullYear() === 2024)
        .length,
      icon: "calendar",
      color: "bg-white",
      iconColor: "#ffffff",
      iconBg: "bg-cyan-500",
    },
    {
      title: "Doctors Seen",
      value: new Set(records.map((r) => r.doctorId.name)).size,
      icon: "user",
      color: "bg-white",
      iconColor: "#ffffff",
      iconBg: "bg-emerald-500",
    },
    {
      title: "Last Visit",
      value:
        records.length > 0
          ? formatDate(records[0].createdAt).split(" ")[0] +
            " " +
            formatDate(records[0].createdAt).split(" ")[1]
          : "N/A",
      icon: "clock",
      color: "bg-white",
      iconColor: "#ffffff",
      iconBg: "bg-purple-500",
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 gap-8">
          {/* Welcome Section - Same as Dashboard */}
          <View>
            <View className="flex-row items-center gap-3">
              <View className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
                <Feather name="file-text" size={24} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-semibold text-slate-800">
                  Medical Records
                </Text>
                <Text className="text-slate-600 mt-1">
                  Access your appointment history and medical records
                </Text>
              </View>
            </View>
          </View>

          {/* EXACT SAME STATS LAYOUT AS DASHBOARD */}
          <View>
            <View className="gap-4">
              {/* Upcoming Appointments Card Style */}
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Total Medical Records
                    </Text>
                    <Text className="text-4xl font-semibold text-cyan-600 mt-2">
                      {records.length}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <Feather name="trending-up" size={14} color="#059669" />
                      <Text className="text-sm text-emerald-600 ml-1 font-medium">
                        {
                          records.filter(
                            (r) => new Date(r.createdAt).getFullYear() === 2024
                          ).length
                        }{" "}
                        records this year
                      </Text>
                    </View>
                  </View>
                  <View className="bg-cyan-500 p-4 rounded-2xl shadow-md">
                    <Feather name="file-text" size={32} color="#ffffff" />
                  </View>
                </View>
              </View>

              {/* Health Stats Card Style */}
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">
                      Records Overview
                    </Text>
                    <View className="flex-row justify-between mb-3">
                      <View>
                        <Text className="text-2xl font-semibold text-slate-800">
                          {new Set(records.map((r) => r.doctorId.name)).size}
                        </Text>
                        <Text className="text-slate-600 text-xs">Doctors</Text>
                      </View>
                      <View>
                        <Text className="text-2xl font-semibold text-slate-800">
                          {
                            records.filter(
                              (r) =>
                                new Date(r.createdAt).getFullYear() === 2024
                            ).length
                          }
                        </Text>
                        <Text className="text-slate-600 text-xs">2024</Text>
                      </View>
                      <View>
                        <Text className="text-2xl font-semibold text-slate-800">
                          {
                            records.filter(
                              (r) =>
                                new Date(r.createdAt).getFullYear() === 2023
                            ).length
                          }
                        </Text>
                        <Text className="text-slate-600 text-xs">2023</Text>
                      </View>
                    </View>
                  </View>
                  <View className="bg-emerald-500 p-4 rounded-2xl shadow-md">
                    <Feather name="activity" size={32} color="#ffffff" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Download Button */}
          <TouchableOpacity
            onPress={handleDownloadAll}
            className="flex-row items-center justify-center px-6 py-4 bg-cyan-500 rounded-xl shadow-lg"
          >
            <Feather name="download" size={20} color="#ffffff" />
            <Text className="text-white font-semibold ml-2 text-base">
              Download All Records
            </Text>
          </TouchableOpacity>

          {/* Records List - Clean and Simple */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-semibold text-slate-800">
                Medical Records
              </Text>
              <Text className="text-slate-600 font-medium">
                {records.length} record{records.length !== 1 ? "s" : ""}
              </Text>
            </View>

            {records.length > 0 ? (
              <View className="gap-4">
                {records.map((record, index) => (
                  <TouchableOpacity
                    key={record._id}
                    onPress={() => openModal(record)}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
                    activeOpacity={0.7}
                  >
                    {/* Doctor Info Row */}
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1 mr-2">
                        <Text className="font-bold text-slate-800 text-lg mb-1">
                          {record.doctorId.name}
                        </Text>
                        <Text className="text-cyan-600 font-semibold text-sm">
                          {record.clinicId.clinicName}
                        </Text>
                      </View>
                      <Text className="text-slate-500 text-sm font-medium">
                        {formatDate(record.createdAt)}
                      </Text>
                    </View>

                    {/* Diagnosis */}
                    <Text
                      className="text-slate-700 leading-relaxed"
                      numberOfLines={2}
                    >
                      {record.diagnosis}
                    </Text>

                    {/* View Details Footer */}
                    <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <View className="flex-row items-center">
                        <Feather name="calendar" size={14} color="#64748b" />
                        <Text className="text-slate-500 text-sm ml-2">
                          {formatTime(record.createdAt)}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-cyan-600 font-semibold text-sm mr-2">
                          View Details
                        </Text>
                        <Feather
                          name="chevron-right"
                          size={16}
                          color="#0891b2"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 items-center">
                <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                  <Feather name="file-text" size={64} color="#9ca3af" />
                </View>
                <Text className="text-xl font-bold text-slate-700 mb-2">
                  No medical records found
                </Text>
                <Text className="text-slate-500 text-center">
                  Your medical records will appear here after appointments
                </Text>
              </View>
            )}
          </View>
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
