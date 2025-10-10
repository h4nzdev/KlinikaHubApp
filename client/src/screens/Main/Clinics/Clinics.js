import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
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

  // CATEGORIES STATE
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  const [user] = useState({
    _id: "user123",
    name: "Hanz Christian Angelo G Magbal",
  });

  // Fetch clinics from API
  const fetchClinics = async () => {
    try {
      setError(null);
      console.log("🔄 Starting fetch...");

      const data = await clinicServices.getAllClinics();
      console.log("✅ Data received:", data);

      setClinics(data);
      extractCategories(data);
    } catch (err) {
      console.error("❌ Detailed fetch error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code,
      });

      setError(
        err.response?.data?.message || err.message || "Failed to load clinics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // EXTRACT CATEGORIES FUNCTION
  const extractCategories = (clinicsData) => {
    const allCategories = new Set(["All"]); // Always include "All"

    clinicsData.forEach((clinic) => {
      if (clinic.primary_category) {
        allCategories.add(clinic.primary_category);
      }

      // Also check categories field if it exists
      if (clinic.categories) {
        try {
          const parsedCategories = JSON.parse(clinic.categories);
          if (Array.isArray(parsedCategories)) {
            parsedCategories.forEach((cat) => allCategories.add(cat));
          }
        } catch (e) {
          console.log("Error parsing categories:", e);
        }
      }
    });

    setCategories(Array.from(allCategories));
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

  // FILTER CLINICS BY CATEGORY
  const filteredClinics =
    selectedCategory === "All"
      ? clinics
      : clinics.filter((clinic) => {
          if (clinic.primary_category === selectedCategory) return true;

          if (clinic.categories) {
            try {
              const parsedCategories = JSON.parse(clinic.categories);
              return (
                Array.isArray(parsedCategories) &&
                parsedCategories.includes(selectedCategory)
              );
            } catch (e) {
              return false;
            }
          }

          return false;
        });

  // COOL CATEGORIES DISPLAY - REPLACING STATS
  const getCategoryStats = () => {
    const categoryCounts = {};

    categories.forEach((cat) => {
      if (cat === "All") {
        categoryCounts[cat] = clinics.length;
      } else {
        categoryCounts[cat] = clinics.filter((clinic) => {
          if (clinic.primary_category === cat) return true;
          if (clinic.categories) {
            try {
              const parsedCategories = JSON.parse(clinic.categories);
              return (
                Array.isArray(parsedCategories) &&
                parsedCategories.includes(cat)
              );
            } catch (e) {
              return false;
            }
          }
          return false;
        }).length;
      }
    });

    return categoryCounts;
  };

  const categoryStats = getCategoryStats();

  const handleClinicPress = (clinicId) => {
    navigation.navigate("ClinicProfile", { clinicId });
  };

  // COOL CATEGORIES GRID - REPLACES STATS SECTION
  const CategoriesGrid = () => (
    <View className="mb-2">
      <Text className="text-xl font-bold text-slate-800 mb-4">
        Browse Categories
      </Text>

      {/* Horizontal Scroll for Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mb-6"
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`mr-3 px-5 py-3 rounded-2xl border-2 ${
              selectedCategory === category
                ? "bg-cyan-500 border-cyan-600 shadow-lg"
                : "bg-white border-slate-200 shadow-sm"
            } min-w-[100px] items-center justify-center`}
          >
            <View
              className={`w-10 h-10 rounded-full mb-2 items-center justify-center ${
                selectedCategory === category ? "bg-cyan-600" : "bg-slate-100"
              }`}
            >
              <Feather
                name={getCategoryIcon(category)}
                size={18}
                color={selectedCategory === category ? "#ffffff" : "#64748b"}
              />
            </View>
            <Text
              className={`text-sm font-bold text-center ${
                selectedCategory === category ? "text-white" : "text-slate-700"
              }`}
              numberOfLines={1}
            >
              {category}
            </Text>
            <Text
              className={`text-xs mt-1 ${
                selectedCategory === category
                  ? "text-cyan-100"
                  : "text-slate-500"
              }`}
            >
              {categoryStats[category]} clinic
              {categoryStats[category] !== 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Helper function for category icons
  const getCategoryIcon = (category) => {
    const iconMap = {
      All: "grid",
      General: "home",
      Dental: "activity",
      Medical: "heart",
      Surgical: "scissors",
      Pediatric: "smile",
      Orthopedic: "bone",
      Cardiology: "heart",
      Neurology: "brain",
      Emergency: "alert-triangle",
    };
    return iconMap[category] || "folder";
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

          {/* COOL CATEGORIES GRID - REPLACES STATS SECTION */}
          <CategoriesGrid />

          {/* Section Header - SHOWS FILTERED COUNT */}
          <View>
            <Text className="text-2xl font-bold text-slate-800 mb-2">
              {selectedCategory === "All"
                ? "All Available Clinics"
                : `${selectedCategory} Clinics`}
            </Text>
            <Text className="text-slate-600 text-lg">
              {filteredClinics.length} clinic
              {filteredClinics.length !== 1 ? "s" : ""} ready to serve you
            </Text>
          </View>

          {/* Clinics List - USES FILTERED CLINICS */}
          {filteredClinics.length > 0 ? (
            <View className="gap-6">
              {filteredClinics.map((clinic) => (
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
                        {clinic.primary_category || "Healthcare Center"}
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
                      {/* Address */}
                      <View className="flex-col space-y-1">
                        <Text className="text-slate-600 text-sm font-medium">
                          Address
                        </Text>
                        <Text className="font-semibold text-slate-700 text-sm leading-5">
                          {clinic.address}
                        </Text>
                      </View>

                      {/* Hours and Status */}
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
            // Empty State
            <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-12 items-center">
              <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                <Feather name="search" size={64} color="#9ca3af" />
              </View>
              <Text className="text-xl font-bold text-slate-700 mb-2">
                No clinics found
              </Text>
              <Text className="text-slate-500 text-lg text-center mb-4">
                {selectedCategory !== "All"
                  ? `No clinics found in "${selectedCategory}" category`
                  : "No clinics available"}
              </Text>
              {selectedCategory !== "All" && (
                <TouchableOpacity
                  onPress={() => setSelectedCategory("All")}
                  className="flex-row items-center justify-center px-6 py-3 bg-cyan-500 rounded-xl"
                >
                  <Feather name="list" size={16} color="#ffffff" />
                  <Text className="text-white font-semibold ml-2">
                    Show All Clinics
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Clinics;
