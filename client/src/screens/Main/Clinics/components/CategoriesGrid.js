import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  getCategoryCount,
  getCategoryIcon,
} from "../../../../utils/clinicHelpers";

const CategoriesGrid = ({
  categories,
  selectedCategory,
  onCategorySelect,
  clinics,
}) => {
  const categoryStats = {};
  categories.forEach((cat) => {
    categoryStats[cat] = getCategoryCount(cat, clinics);
  });

  const activeCategories = categories.filter(
    (cat) => categoryStats[cat] > 0 || cat === "All"
  );
  const emptyCategories = categories.filter(
    (cat) => categoryStats[cat] === 0 && cat !== "All"
  );

  const CategoryItem = ({ category, isActive, isDisabled = false }) => (
    <TouchableOpacity
      onPress={() => !isDisabled && onCategorySelect(category)}
      className={`mr-3 px-4 py-3 rounded-2xl border-2 ${
        isActive
          ? "bg-cyan-500 border-cyan-600 shadow-lg"
          : isDisabled
            ? "bg-slate-100 border-slate-200 opacity-60"
            : "bg-white border-slate-200 shadow-sm"
      } min-w-[90px] items-center justify-center`}
      disabled={isDisabled}
    >
      <View
        className={`w-8 h-8 rounded-full mb-2 items-center justify-center ${
          isActive
            ? "bg-cyan-600"
            : isDisabled
              ? "bg-slate-200"
              : "bg-slate-100"
        }`}
      >
        <Feather
          name={getCategoryIcon(category)}
          size={16}
          color={isActive ? "#ffffff" : isDisabled ? "#94a3b8" : "#64748b"}
        />
      </View>
      <Text
        className={`text-xs font-bold text-center capitalize ${
          isActive
            ? "text-white"
            : isDisabled
              ? "text-slate-400"
              : "text-slate-700"
        }`}
        numberOfLines={1}
      >
        {category}
      </Text>
      <Text
        className={`text-xs mt-1 ${
          isActive
            ? "text-cyan-100"
            : isDisabled
              ? "text-slate-400"
              : "text-slate-500"
        }`}
      >
        {categoryStats[category]} clinic
        {categoryStats[category] !== 1 ? "s" : ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="mb-2">
      <Text className="text-xl font-bold text-slate-800 mb-4">
        Browse Categories
      </Text>

      {/* Active Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mb-3"
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {activeCategories.map((category) => (
          <CategoryItem
            key={category}
            category={category}
            isActive={selectedCategory === category}
          />
        ))}
      </ScrollView>

      {/* Empty Categories */}
      {emptyCategories.length > 0 && (
        <View>
          <Text className="text-sm font-medium text-slate-500 mb-2">
            Unavailable Clinics
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {emptyCategories.map((category) => (
              <CategoryItem
                key={category}
                category={category}
                isActive={false}
                isDisabled={true}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CategoriesGrid;
