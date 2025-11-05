import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

const Details = ({ formData, setFormData, nextTab, prevTab }) => {
  const [localNotes, setLocalNotes] = useState(formData.notes);

  const handleNext = () => {
    setFormData((prev) => ({ ...prev, notes: localNotes }));
    nextTab();
  };

  const handleBack = () => {
    setFormData((prev) => ({ ...prev, notes: localNotes }));
    prevTab();
  };

  return (
    <View className="flex-1">
      <View className="items-center mb-6">
        <Text className="text-xl font-semibold text-slate-800">
          Additional Details
        </Text>
        <Text className="text-slate-500 mt-2 text-center">
          Provide any additional information
        </Text>
      </View>

      <View className="flex-1 mb-4">
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Appointment Type
          </Text>
          <Text className="text-cyan-600 font-semibold text-base capitalize">
            {formData.type.replace(/-/g, " ")}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Additional Notes (Optional)
          </Text>
          <TextInput
            value={localNotes}
            onChangeText={setLocalNotes}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            className="border-2 border-slate-300 rounded-xl bg-white p-4 text-slate-800 text-base h-32"
            placeholder="Any specific concerns, symptoms, or notes for the doctor..."
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <View className="flex-row gap-3 pt-4">
        <TouchableOpacity
          onPress={handleBack}
          className="flex-1 py-4 border-2 border-slate-300 rounded-xl items-center"
        >
          <Text className="text-slate-700 font-semibold text-base">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          className="flex-1 py-4 bg-cyan-500 rounded-xl items-center justify-center"
        >
          <Text className="text-white font-semibold text-base">
            Review Booking
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Details;
