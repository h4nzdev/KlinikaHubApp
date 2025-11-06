"use client";

import { useState } from "react";
import { View, ScrollView, Pressable, Text } from "react-native";
import ClinicCard from "./ClinicCard";

const ClinicList = ({ clinics, onClinicPress }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const itemsToShowInitially = 5;
  const visibleClinics = isExpanded
    ? clinics
    : clinics.slice(0, itemsToShowInitially);
  const hasMore = clinics.length > itemsToShowInitially;
  const hiddenCount = clinics.length - itemsToShowInitially;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      className="flex-1"
    >
      <View className="gap-3 px-0">
        {visibleClinics.map((clinic, index) => (
          <View
            key={clinic.id}
            className={`${index !== visibleClinics.length - 1 ? "pb-2" : ""}`}
          >
            <ClinicCard
              clinic={clinic}
              onPress={() => onClinicPress(clinic.id)}
            />
          </View>
        ))}

        {hasMore && (
          <View className="pt-2">
            <Pressable
              onPress={() => setIsExpanded(!isExpanded)}
              className="bg-cyan-500 rounded-xl py-4 px-6 active:bg-cyan-600 shadow-lg"
            >
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-white font-semibold text-base">
                  {isExpanded
                    ? "Show Less Clinics"
                    : `Show ${hiddenCount} More Clinic${hiddenCount !== 1 ? "s" : ""}`}
                </Text>
                <Text className="text-white text-lg">
                  {isExpanded ? "−" : "+"}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ClinicList;
