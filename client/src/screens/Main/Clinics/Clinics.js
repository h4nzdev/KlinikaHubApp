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
import clinicServices from "../../../services/clinicServices";

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [user] = useState({
    _id: "user123",
    name: "Hanz Christian Angelo G Magbal",
  });

  // Fetch clinics from API
  const fetchClinics = async () => {
    try {
      setError(null);
      const data = await clinicServices.getAllClinics();
      setClinics(data);
    } catch (err) {
      console.error("Error fetching clinics:", err);
      setError("Failed to load clinics. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  console.log(clinics);

  // Initial load
  useEffect(() => {
    fetchClinics();
  }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchClinics();
  };

  // Stats data
  const stats = [
    {
      title: "Total Clinics",
      value: clinics.length,
      icon: "home",
      color: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "#0891b2",
      textColor: "text-cyan-700",
    },
    {
      title: "Available",
      value: clinics.length,
      icon: "check-circle",
      color: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "#059669",
      textColor: "text-emerald-700",
    },
    {
      title: "Services",
      value: "All",
      icon: "heart",
      color: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "#9333ea",
      textColor: "text-purple-700",
    },
  ];

  const handleClinicPress = (clinicId) => {
    navigation.navigate("ClinicProfile", { clinicId });
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
            Loading clinics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (error && clinics.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" />
        <Header />
        <View className="flex-1 justify-center items-center p-8">
          <View className="bg-red-100 rounded-2xl p-6 mb-6">
            <Feather name="alert-triangle" size={64} color="#dc2626" />
          </View>
          <Text className="text-xl font-bold text-slate-700 mb-2 text-center">
            Unable to Load Clinics
          </Text>
          <Text className="text-slate-500 text-lg text-center mb-6">
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchClinics}
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
              <TouchableOpacity onPress={fetchClinics}>
                <Feather name="x" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          )}

          {/* Header Section */}
          <View>
            <Text className="text-3xl font-bold text-slate-800 mb-2">
              Our Clinics
            </Text>
            <Text className="text-slate-600 text-lg">
              Choose from our network of trusted healthcare facilities.
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
                            ellipsizeMode="tail"
                            numberOfLines={1}
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
              Available Clinics
            </Text>
            <Text className="text-slate-600 text-lg">
              {clinics.length} clinic{clinics.length !== 1 ? "s" : ""} ready to
              serve you
            </Text>
          </View>

          {/* Clinics List */}
          {clinics.length > 0 ? (
            <View className="gap-6">
              {clinics.map((clinic) => (
                <View
                  key={clinic.id}
                  className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6"
                >
                  {/* Clinic Header */}
                  <View className="flex-row gap-4 mb-4">
                    <View className="relative">
                      <View className="w-16 h-16 rounded-xl bg-cyan-100 items-center justify-center">
                        <Feather name="home" size={24} color="#0891b2" />
                      </View>
                      <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-slate-800 mb-1">
                        {clinic.institute_name}
                      </Text>
                      <Text className="text-slate-600 font-medium text-sm mb-2">
                        Diagnostic Center
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Feather name="phone" size={14} color="#64748b" />
                        <Text className="text-slate-500 text-sm">
                          {clinic.mobileno}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Clinic Info Card */}
                  <View className="bg-slate-50/80 rounded-xl p-4 mb-4">
                    <View className="gap-3">
                      {/* Address - Stack on mobile */}
                      <View className="flex-col space-y-1">
                        <Text className="text-slate-600 text-sm font-medium">
                          Address
                        </Text>
                        <Text className="font-semibold text-slate-700 text-sm leading-5">
                          {clinic.address}
                        </Text>
                      </View>

                      {/* Hours and Status - Side by side on larger screens, stacked on mobile */}
                      <View className="flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                        {/* Hours */}
                        <View className="flex-1">
                          <Text className="text-slate-600 text-sm font-medium mb-1">
                            Operating Hours
                          </Text>
                          <Text className="font-semibold text-slate-700 text-sm">
                            {clinic.working_hours ||
                              "Mon-Sat: 8:00 AM - 5:00 PM"}
                          </Text>
                        </View>

                        {/* Status with badge */}
                        <View className="flex-row items-center justify-between sm:justify-start sm:flex-col sm:items-end sm:space-y-1">
                          <Text className="text-slate-600 text-sm font-medium sm:hidden">
                            Status
                          </Text>
                          <View className="flex-row items-center bg-green-100 px-3 py-1 rounded-full">
                            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            <Text className="font-semibold text-green-800 text-xs">
                              Open Now
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity
                    onPress={() => handleClinicPress(clinic.id)}
                    className="flex-row items-center justify-center px-4 py-3 bg-cyan-500 rounded-xl shadow-lg"
                  >
                    <Feather name="info" size={16} color="#ffffff" />
                    <Text className="text-white font-semibold ml-2">
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
                <Feather name="home" size={64} color="#9ca3af" />
              </View>
              <Text className="text-xl font-bold text-slate-700 mb-2">
                No clinics available
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

export default Clinics;
