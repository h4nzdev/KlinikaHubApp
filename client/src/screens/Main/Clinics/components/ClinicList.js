import React from "react";
import { View } from "react-native";
import ClinicCard from "./ClinicCard";

const ClinicList = ({ clinics, onClinicPress }) => (
  <View className="gap-6">
    {clinics.map((clinic) => (
      <ClinicCard
        key={clinic.id}
        clinic={clinic}
        onPress={() => onClinicPress(clinic.id)}
      />
    ))}
  </View>
);

export default ClinicList;
