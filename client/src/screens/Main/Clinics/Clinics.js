import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Components
import Header from "../../../components/Header";

// Hooks & Utils
import { useClinics } from "../../../hooks/useClinics";
import { filterClinics, extractCategories } from "../../../utils/clinicHelpers";

// Import components with correct paths
import LoadingState from "./components/common/LoadingState";
import ErrorState from "./components/common/ErrorState";
import EmptyState from "./components/common/EmptyState";
import CategoriesGrid from "./components/CategoriesGrid";
import ClinicList from "./components/ClinicList";
import ClinicSearchBar from "./components/ClinicSearchBar";

const Clinics = () => {
  const navigation = useNavigation();
  const {
    clinics,
    allClinics,
    loading,
    error,
    refreshing,
    searchQuery,
    fetchClinics,
    onRefresh,
    updateSearchQuery,
    clearSearch,
  } = useClinics();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([
    "All",
    "General",
    "Dental",
    "Medical",
    "Surgical",
    "Pediatric",
    "Orthopedic",
    "Cardiology",
    "Neurology",
    "Emergency",
    "Dermatology",
    "Ophthalmology",
    "Psychiatry",
    "Radiology",
    "Oncology",
    "Urology",
    "Gynecology",
    "Endocrinology",
  ]);

  // Update categories when clinics data changes
  React.useEffect(() => {
    if (allClinics.length > 0) {
      const extractedCategories = extractCategories(allClinics);
      setCategories(extractedCategories);
    }
  }, [allClinics]);

  // Apply both category and search filters
  const filteredClinics = filterClinics(
    allClinics,
    selectedCategory,
    searchQuery
  );

  const handleClinicPress = (clinicId) => {
    navigation.navigate("ClinicProfile", { clinicId });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Clear search when category changes to avoid confusion
    if (searchQuery) {
      clearSearch();
    }
  };

  const handleSearchChange = (query) => {
    updateSearchQuery(query);
    // If searching, set category to "All" to show results from all categories
    if (query.trim() && selectedCategory !== "All") {
      setSelectedCategory("All");
    }
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  // Loading State
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" />
        <Header />
        <LoadingState />
      </SafeAreaView>
    );
  }

  // Error State (only if no clinics exist)
  if (error && allClinics.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" />
        <Header />
        <ErrorState error={error} onRetry={fetchClinics} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      <Header />

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
        <View className="p-4 gap-6">
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

          {/* Search Bar */}
          <ClinicSearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />

          {/* Categories Grid */}
          <CategoriesGrid
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            clinics={allClinics}
          />

          {/* Section Header with combined filter info */}
          <View>
            <Text className="text-2xl font-bold text-slate-800 mb-2 capitalize">
              {searchQuery
                ? "Search Results"
                : selectedCategory === "All"
                  ? "All Available Clinics"
                  : `${selectedCategory} Clinics`}
            </Text>

            <Text className="text-slate-600 text-lg">
              {filteredClinics.length} clinic
              {filteredClinics.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
              {searchQuery &&
                selectedCategory !== "All" &&
                ` in ${selectedCategory}`}
            </Text>

            {/* Active filters indicator */}
            {(searchQuery || selectedCategory !== "All") && (
              <View className="flex-row flex-wrap mt-2 gap-2">
                {searchQuery && (
                  <View className="flex-row items-center bg-cyan-100 px-3 py-1 rounded-full">
                    <Text className="text-cyan-800 text-sm font-medium">
                      Search: "{searchQuery}"
                    </Text>
                    <TouchableOpacity
                      onPress={handleClearSearch}
                      className="ml-2"
                    >
                      <Feather name="x" size={14} color="#0e7490" />
                    </TouchableOpacity>
                  </View>
                )}
                {selectedCategory !== "All" && (
                  <View className="flex-row items-center bg-slate-100 px-3 py-1 rounded-full">
                    <Text className="text-slate-700 text-sm font-medium">
                      Category: {selectedCategory}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setSelectedCategory("All")}
                      className="ml-2"
                    >
                      <Feather name="x" size={14} color="#475569" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Clinics List */}
          {filteredClinics.length > 0 ? (
            <ClinicList
              clinics={filteredClinics}
              onClinicPress={handleClinicPress}
            />
          ) : (
            <EmptyState
              selectedCategory={selectedCategory}
              onShowAll={() => {
                setSelectedCategory("All");
                clearSearch();
              }}
              searchQuery={searchQuery}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Clinics;
