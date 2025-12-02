import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";

const CategoryDropdown = ({
  categories,
  selectedCategory,
  onCategorySelect,
  clinics,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryCount = (category) => {
    if (category === "All") return clinics.length;
    return clinics.filter((clinic) => {
      if (clinic.primary_category === category) return true;
      if (clinic.categories) {
        try {
          const parsedCategories = JSON.parse(clinic.categories);
          return (
            Array.isArray(parsedCategories) && parsedCategories.includes(category)
          );
        } catch (e) {
          return false;
        }
      }
      return false;
    }).length;
  };

  const handleSelect = (category) => {
    onCategorySelect(category);
    setIsOpen(false);
  };

  const renderCategoryItem = ({ item: category }) => (
    <TouchableOpacity
      onPress={() => handleSelect(category)}
      className={`px-4 py-3 border-b border-slate-200 ${
        selectedCategory === category ? "bg-cyan-50" : "bg-white"
      }`}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className={`text-sm font-medium ${
            selectedCategory === category ? "text-cyan-600" : "text-slate-700"
          }`}
        >
          {category}
        </Text>
        <Text className="text-xs text-slate-500">
          {getCategoryCount(category)} clinic{getCategoryCount(category) !== 1 ? "s" : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="">
      <Text className="text-xl font-bold text-slate-800 mb-2">
        Browse Categories
      </Text>
      <View className="relative">
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          className="flex-row items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm"
        >
          <Text className="text-slate-700 font-medium">{selectedCategory}</Text>
          <Feather
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#64748b"
          />
        </TouchableOpacity>
        {isOpen && (
          <View className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg mt-1 z-10 max-h-60">
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={renderCategoryItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CategoryDropdown;
