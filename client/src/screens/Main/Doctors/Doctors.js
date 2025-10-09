import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";
import { useNavigation } from "@react-navigation/native";
import doctorServices from "../../../services/doctorServices"; // Import your service

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [user] = useState({
    _id: "user123",
    name: "Hanz Christian Angelo G Magbal",
    clinicId: { _id: "clinic123" },
  });

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      setError(null);
      const data = await doctorServices.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  console.log(doctors);

  // Initial load
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchDoctors();
  };

  // Calculate unique specialties
  const uniqueSpecialties = new Set(doctors.map((d) => d.specialty)).size;

  // Stats data
  const stats = [
    {
      title: "Total Doctors",
      value: doctors.length,
      icon: "user",
      color: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "#0891b2",
      textColor: "text-cyan-700",
    },
    {
      title: "Specialties",
      value: uniqueSpecialties,
      icon: "activity",
      color: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "#059669",
      textColor: "text-emerald-700",
    },
    {
      title: "Available",
      value: doctors.length,
      icon: "star",
      color: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "#9333ea",
      textColor: "text-purple-700",
    },
  ];

  const handleDoctorPress = (doctorId) => {
    // Navigate to doctor details
    navigation.navigate("DoctorDetails", { doctorId });
  };

  // Loading State
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" />
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="text-slate-600 mt-4 text-lg">
            Loading doctors...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (error && doctors.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" />
        <Header />
        <View className="flex-1 justify-center items-center p-8">
          <View className="bg-red-100 rounded-2xl p-6 mb-6">
            <Feather name="alert-triangle" size={64} color="#dc2626" />
          </View>
          <Text className="text-xl font-bold text-slate-700 mb-2 text-center">
            Unable to Load Doctors
          </Text>
          <Text className="text-slate-500 text-lg text-center mb-6">
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchDoctors}
            className="flex-row items-center justify-center px-6 py-3 bg-cyan-500 rounded-xl"
          >
            <Feather name="refresh-cw" size={16} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0891b2"]}
            tintColor="#0891b2"
          />
        }
      >
        <View className="p-4 gap-8">
          {/* Error Banner */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-xl p-4 flex-row items-center">
              <Feather name="alert-circle" size={20} color="#dc2626" />
              <Text className="text-red-700 ml-2 flex-1">{error}</Text>
              <TouchableOpacity onPress={fetchDoctors}>
                <Feather name="x" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          )}

          {/* Header Section */}
          <View>
            <Text className="text-3xl font-bold text-slate-800 mb-2">
              Our Doctors
            </Text>
            <Text className="text-slate-600 text-lg">
              Meet our team of experienced healthcare professionals ready to
              serve you.
            </Text>
          </View>

          {/* Stats Section */}
          <View>
            <View className="gap-4">
              {/* First Row - 2 stats */}
              <View className="flex-row gap-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <View key={index} className="flex-1">
                    <View
                      className={`${stat.color} border border-white/20 rounded-2xl p-4 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-2 opacity-80`}
                          >
                            {stat.title}
                          </Text>
                          <Text className="text-2xl font-bold text-slate-800">
                            {stat.value}
                          </Text>
                        </View>
                        <View
                          className={`p-3 rounded-xl ${stat.iconBg} ml-3 shadow-md`}
                        >
                          <Feather
                            name={stat.icon}
                            size={20}
                            color={stat.iconColor}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Second Row - 1 stat (full width) */}
              <View>
                {stats.slice(2, 3).map((stat, index) => (
                  <View key={index + 2}>
                    <View
                      className={`${stat.color} border border-white/20 rounded-2xl p-4 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-2 opacity-80`}
                          >
                            {stat.title}
                          </Text>
                          <Text className="text-2xl font-bold text-slate-800">
                            {stat.value}
                          </Text>
                        </View>
                        <View
                          className={`p-3 rounded-xl ${stat.iconBg} ml-3 shadow-md`}
                        >
                          <Feather
                            name={stat.icon}
                            size={20}
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
              Available Doctors
            </Text>
            <Text className="text-slate-600 text-lg">
              {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} ready to
              help you
            </Text>
          </View>

          {/* Doctors List */}
          {doctors.length > 0 ? (
            <View className="gap-6">
              {doctors.map((doctor) => (
                <View
                  key={doctor._id}
                  className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6"
                >
                  {/* Doctor Header */}
                  <View className="flex-row gap-4 mb-4">
                    <View className="relative">
                      <Image
                        source={{ uri: doctor.profileImage }}
                        className="w-16 h-16 rounded-xl"
                        style={{ backgroundColor: "#e0f2fe" }}
                      />
                      <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-slate-800 mb-1">
                        {doctor.name}
                      </Text>
                      <Text className="text-slate-600 font-medium text-sm mb-2">
                        {doctor.specialty}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Feather name="star" size={16} color="#eab308" />
                        <Text className="font-semibold text-slate-700 text-sm">
                          {doctor.rating}
                        </Text>
                        <Text className="text-slate-500 text-sm">
                          ({doctor.reviews}+)
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Doctor Info Card */}
                  <View className="bg-slate-50/80 rounded-xl p-4 mb-4">
                    <View className="gap-2">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-slate-600 text-sm">
                          Experience:
                        </Text>
                        <Text className="font-semibold text-slate-700 text-sm">
                          {doctor.experience}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-slate-600 text-sm">
                          Consultation:
                        </Text>
                        <Text className="font-semibold text-emerald-600 text-sm">
                          {doctor.consultation}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-slate-600 text-sm">Status:</Text>
                        <Text className="font-semibold text-green-600 text-sm">
                          Available Today
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity
                    onPress={() => handleDoctorPress(doctor._id)}
                    className="flex-row items-center justify-center px-4 py-3 bg-cyan-500 rounded-xl shadow-lg"
                  >
                    <Feather name="calendar" size={16} color="#ffffff" />
                    <Text
                      onPress={() => navigation.navigate("DoctorProfile")}
                      className="text-white font-semibold ml-2"
                    >
                      View Full Details
                    </Text>
                    <Feather
                      name="arrow-right"
                      size={16}
                      color="#ffffff"
                      className="ml-2"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            // Empty State (when API returns empty array)
            <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-12 items-center">
              <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                <Feather name="activity" size={64} color="#9ca3af" />
              </View>
              <Text className="text-xl font-bold text-slate-700 mb-2">
                No doctors available
              </Text>
              <Text className="text-slate-500 text-lg text-center">
                Please check back later or contact support.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Doctors;
