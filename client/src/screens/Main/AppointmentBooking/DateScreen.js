import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

const DateScreen = ({ formData, setFormData, nextTab, prevTab }) => {
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = formData.date.toISOString().split("T")[0];

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: "#0891b2",
      selectedTextColor: "#ffffff",
    },
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(day.dateString);
    setFormData({ ...formData, date: selectedDate });
  };

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1">
        <View className="items-center mb-6">
          <Text className="text-xl font-semibold text-slate-800">
            Select Date
          </Text>
          <Text className="text-slate-500 mt-2 text-center">
            Choose your preferred date for {formData.type.replace(/-/g, " ")}
          </Text>
        </View>

        <View className="mb-4 px-4">
          <Calendar
            current={today}
            minDate={today}
            maxDate={
              new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            }
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
                  <Text className="text-xl font-bold text-slate-800">
                    {month}
                  </Text>
                </View>
              );
            }}
            enableSwipeMonths={true}
          />
        </View>

        <View className="px-4">
          <View className="bg-cyan-50 rounded-xl p-4 mb-4 border border-cyan-200">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-cyan-700 font-semibold text-base">
                  Selected Date
                </Text>
                <Text className="text-cyan-600 text-sm">
                  {formData.date.toLocaleDateString("en-US", {
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

          <View className="flex-row gap-3 pt-4 pb-8">
            <TouchableOpacity
              onPress={prevTab}
              className="flex-1 py-4 border-2 border-slate-300 rounded-xl items-center"
            >
              <Text className="text-slate-700 font-semibold text-base">
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={nextTab}
              className="flex-1 justify-center py-4 bg-cyan-500 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-base">
                Continue to Doctors
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DateScreen;
