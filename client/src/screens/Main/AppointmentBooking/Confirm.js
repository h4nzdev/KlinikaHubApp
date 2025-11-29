import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import appointmentServices from "../../../services/appointmentsServices";
import { getSpecialties } from "../../../utils/getSpecialty";
import { useRefresh } from "../../../context/RefreshContext";

const Confirm = ({
  formData,
  selectedDoctor,
  clinicId,
  clinicName,
  user,
  availableSlots,
  prevTab,
}) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { triggerRefresh } = useRefresh();

  const selectedTimeSlot = availableSlots.find(
    (slot) => slot.military === formData.time
  );
  const displayTime = selectedTimeSlot
    ? selectedTimeSlot.display
    : formData.time;

  const handleAddAppointment = async () => {
    console.log("🔄 Form Data:", formData);

    if (
      !formData.doctorId ||
      !formData.date ||
      !formData.time ||
      !formData.type
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const datePart = formData.date.toISOString().split("T")[0];
      const appointmentDateTime = `${datePart}T${formData.time}:00`;

      const appointmentData = {
        appointment_id: `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        clinic_id: clinicId,
        doctor_id: formData.doctorId,
        patient_id: user?.id || "default-patient-id",
        consultation_fees: selectedDoctor?.consultation_fee || "50.00",
        discount: "0.00",
        schedule: appointmentDateTime,
        remarks: formData.notes,
        appointment_date: datePart,
        status: 0,
        type: formData.type,
        payment_method: formData.paymentMethod,
        created_at: new Date().toISOString(),
      };

      console.log("📤 Sending appointment data:", appointmentData);
      await appointmentServices.createAppointment(appointmentData);
      triggerRefresh();

      Alert.alert("Success", "Appointment booked successfully! 🎉", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("Error booking appointment:", error);
      Alert.alert("Error", "Failed to book appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <View className="items-center mb-6">
        <Text className="text-xl font-semibold text-slate-800">
          Confirm Booking
        </Text>
        <Text className="text-slate-500 mt-2 text-center">
          Review your appointment details
        </Text>
      </View>

      <View className="flex-1 mb-4">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="bg-slate-50 rounded-2xl p-6 gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-slate-600">Clinic:</Text>
              <Text className="font-semibold text-slate-800 text-right flex-1 ml-2">
                {clinicName}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-slate-600">Doctor:</Text>
              <Text className="font-semibold text-slate-800 text-right flex-1 ml-2">
                {selectedDoctor?.name || "Not selected"}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-slate-600">Specialty:</Text>
              <Text className="font-semibold text-cyan-600 text-right flex-1 ml-2">
                {getSpecialties(selectedDoctor?.specialties)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-slate-600">Date:</Text>
              <Text className="font-semibold text-slate-800">
                {formData.date.toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-slate-600">Time:</Text>
              <Text className="font-semibold text-slate-800">
                {displayTime}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-slate-600">Type:</Text>
              <Text className="font-semibold text-slate-800 capitalize">
                {formData.type.replace(/-/g, " ")}
              </Text>
            </View>
            {selectedDoctor?.consultation_fee && (
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-600">Consultation Fee:</Text>
                <Text className="font-semibold text-green-600">
                  ₱{selectedDoctor.consultation_fee}
                </Text>
              </View>
            )}
            {formData.notes && (
              <View>
                <Text className="text-slate-600 mb-1">Notes:</Text>
                <Text className="font-semibold text-slate-800">
                  {formData.notes}
                </Text>
              </View>
            )}
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
          onPress={handleAddAppointment}
          disabled={isLoading}
          className={`flex-1 py-4 rounded-xl items-center justify-center ${isLoading ? "bg-cyan-300" : "bg-cyan-500"}`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Confirm Booking
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Confirm;
