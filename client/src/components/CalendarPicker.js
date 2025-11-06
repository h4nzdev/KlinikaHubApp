// components/CalendarPicker.js
import React from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import { Feather } from "@expo/vector-icons";

const CalendarPicker = ({ selectedDate, onDateSelect, minDate, maxDate }) => {
  const today = new Date().toISOString().split("T")[0];
  const formattedSelectedDate = selectedDate
    ? new Date(selectedDate).toISOString().split("T")[0]
    : null;

  const markedDates = formattedSelectedDate
    ? {
        [formattedSelectedDate]: {
          selected: true,
          selectedColor: "#0891b2",
          selectedTextColor: "#ffffff",
        },
      }
    : {};

  const handleDateSelect = (day) => {
    const selectedDate = new Date(day.dateString);
    onDateSelect(day.dateString);
  };

  return (
    <View className="mb-4">
      <Calendar
        current={today}
        minDate={minDate || today}
        maxDate={maxDate}
        onDayPress={handleDateSelect}
        markedDates={markedDates}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#64748b",
          selectedDayBackgroundColor: "#0891b2",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#0891b2",
          dayTextColor: "#334155",
          textDisabledColor: "#cbd5e1",
          dotColor: "#0891b2",
          selectedDotColor: "#ffffff",
          arrowColor: "#0891b2",
          monthTextColor: "#0f172a",
          textDayFontFamily: "System",
          textMonthFontFamily: "System",
          textDayHeaderFontFamily: "System",
          textDayFontWeight: "500",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
          "stylesheet.calendar.main": {
            container: {
              padding: 0,
              backgroundColor: "#ffffff",
            },
          },
          "stylesheet.day.basic": {
            base: {
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
            },
            selected: {
              backgroundColor: "#0891b2",
            },
            today: {
              backgroundColor: "#f0f9ff",
            },
            todayText: {
              color: "#0891b2",
              fontWeight: "bold",
            },
          },
        }}
        renderHeader={(date) => {
          const month = date.toString("MMMM yyyy");
          return (
            <View className="items-center py-4">
              <Text className="text-xl font-bold text-slate-800">{month}</Text>
            </View>
          );
        }}
        enableSwipeMonths={true}
      />

      {/* Selected Date Display */}
      {selectedDate && (
        <View className="bg-cyan-50 rounded-xl p-4 mt-4 border border-cyan-200">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-cyan-700 font-semibold text-base">
                Selected Date
              </Text>
              <Text className="text-cyan-600 text-sm">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <Feather name="calendar" size={24} color="#0891b2" />
          </View>
        </View>
      )}
    </View>
  );
};

export default CalendarPicker;
