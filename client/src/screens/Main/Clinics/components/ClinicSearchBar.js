import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

const ClinicSearchBar = ({ searchQuery, onSearchChange, onClearSearch }) => {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-3">
        Find Clinics
      </Text>
      <View className="relative">
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search clinics by name, specialty, location..."
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 pl-11 text-gray-900 text-base"
          placeholderTextColor="#9CA3AF"
        />
        <View className="absolute left-3 top-3.5">
          <Feather name="search" size={18} color="#6B7280" />
        </View>

        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={onClearSearch}
            className="absolute right-3 top-3.5 bg-gray-200 rounded-full p-1"
          >
            <Feather name="x" size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search results info */}
      {searchQuery.length > 0 && (
        <Text className="text-gray-500 text-xs mt-2 ml-1">
          Searching in names, specialties, addresses, and contact information
        </Text>
      )}
    </View>
  );
};

export default ClinicSearchBar;
