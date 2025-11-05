import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

const Time = ({
  formData,
  setFormData,
  availableSlots,
  setAvailableSlots,
  nextTab,
  prevTab,
}) => {
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour;
        const displayMinute = minute.toString().padStart(2, "0");

        const timeString = `${displayHour}:${displayMinute} ${period}`;
        const militaryTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

        slots.push({
          display: timeString,
          military: militaryTime,
        });
      }
    }
    return slots;
  };

  useEffect(() => {
    if (availableSlots.length === 0) {
      setAvailableSlots(generateTimeSlots());
    }
  }, []);

  return (
    <View className="flex-1">
      <View className="items-center mb-6">
        <Text className="text-xl font-semibold text-slate-800">
          Choose Time
        </Text>
        <Text className="text-slate-500 mt-2 text-center">
          Select your preferred time slot
        </Text>
      </View>

      <View className="flex-1 mb-4">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="flex-row flex-wrap justify-between gap-2 pb-4">
            {availableSlots.map((slot, index) => (
              <TouchableOpacity
                key={`time-${slot.military}-${index}`}
                onPress={() =>
                  setFormData({ ...formData, time: slot.military })
                }
                className={`p-4 rounded-xl border-2 w-[48%] items-center ${
                  formData.time === slot.military
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <Text
                  className={`font-semibold text-base ${
                    formData.time === slot.military
                      ? "text-cyan-700"
                      : "text-slate-800"
                  }`}
                >
                  {slot.display}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className="flex-row gap-3 pt-4">
        <TouchableOpacity
          onPress={prevTab}
          className="flex-1 py-4 border-2 border-slate-300 rounded-xl items-center"
        >
          <Text className="text-slate-700 font-semibold text-base">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nextTab}
          disabled={!formData.time}
          className={`flex-1 py-4 rounded-xl items-center justify-center ${!formData.time ? "bg-cyan-300" : "bg-cyan-500"}`}
        >
          <Text className="text-white font-semibold text-base">
            {!formData.time ? "Select Time" : "Continue to Details"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Time;
