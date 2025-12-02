import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const SampleQuestions = ({
  chatCredits,
  showEmergency,
  isShown,
  setMessage,
  setIsShown,
}) => {
  if (!chatCredits.canChat || showEmergency || !isShown) return null;

  return (
    <>
      <View className="bg-blue-50 rounded-xl p-4 border border-blue-200 relative">
        <TouchableOpacity
          onPress={() => setIsShown(false)}
          className="absolute h-8 w-8 bg-cyan-100 -top-4 self-center rounded-full flex items-center justify-center"
        >
          <Feather name="chevron-down" size={18} color="#0891b2" />
        </TouchableOpacity>
        <Text className="font-medium text-blue-900 mb-3">
          Try asking about:
        </Text>
        <View className="gap-3">
          <TouchableOpacity
            onPress={() => setMessage("I have a headache and feel tired")}
            className="p-3 bg-white rounded-lg border border-blue-200"
          >
            <Text className="text-sm text-blue-800">
              "I have a headache and feel tired"
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setMessage("I want to book an appointment for a check-up")
            }
            className="p-3 bg-white rounded-lg border border-blue-200"
          >
            <Text className="text-sm text-blue-800">
              "I want to book an appointment for a check-up"
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setMessage("My cough has been persistent for 1 week")
            }
            className="p-3 bg-white rounded-lg border border-blue-200"
          >
            <Text className="text-sm text-blue-800">
              "My cough has been persistent for 1 week"
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setMessage("I need to see a doctor for prescription")
            }
            className="p-3 bg-white rounded-lg border border-blue-200"
          >
            <Text className="text-sm text-blue-800">
              "I need to see a doctor for prescription"
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-cyan-50 rounded-xl p-4 mt-5 mb-5 border border-cyan-200">
        <View className="flex-row items-center gap-2 mb-3">
          <Feather name="cpu" size={20} color="#0891b2" />
          <Text className="font-medium text-cyan-900">
            Powered by Medora AI
          </Text>
        </View>
        <Text className="text-sm text-cyan-800">
          Real-time symptom analysis with emergency detection. Your
          conversations are secure and private.
        </Text>
      </View>
    </>
  );
};

export default SampleQuestions;
