// components/AppointmentBookingModal.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert, // ADD THIS IMPORT
} from "react-native";
import { Feather } from "@expo/vector-icons";
import appointmentServices from "../../services/appointmentsServices";
import { doctorServices } from "../../services/doctorServices";
import { AuthenticationContext } from "../../context/AuthenticationContext";

const AppointmentBookingModal = ({
  visible,
  onClose,
  clinicId,
  onAppointmentAdded,
  clinicName,
}) => {
  const [doctors, setDoctors] = useState([]);
  const [currentTab, setCurrentTab] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: "",
    date: new Date(),
    time: "",
    type: "consultation",
    status: "scheduled",
    bookingType: "walk-in",
    notes: "",
    paymentMethod: "cash",
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { user } = useContext(AuthenticationContext);

  const appointmentTypes = [
    { value: "consultation", label: "Consultation", color: "bg-cyan-500" },
    { value: "follow-up", label: "Follow-up", color: "bg-blue-500" },
    { value: "check-up", label: "Check-up", color: "bg-emerald-500" },
    { value: "surgery", label: "Surgery", color: "bg-red-500" },
    { value: "therapy", label: "Therapy", color: "bg-purple-500" },
    { value: "vaccination", label: "Vaccination", color: "bg-green-500" },
    { value: "screening", label: "Screening", color: "bg-orange-500" },
  ];

  const steps = [
    { number: 1, title: "Date", icon: "calendar", completed: currentTab > 1 },
    { number: 2, title: "Time", icon: "clock", completed: currentTab > 2 },
    { number: 3, title: "Confirm", icon: "user", completed: currentTab > 3 },
    {
      number: 4,
      title: "Details",
      icon: "activity",
      completed: currentTab > 4,
    },
  ];

  const fetchDoctorsByClinic = async () => {
    try {
      if (!clinicId) return;

      console.log("🔄 Fetching doctors for clinic:", clinicId);
      const doctorsData = await doctorServices.getDoctorsByClinicId(clinicId);
      console.log("✅ Doctors fetched:", doctorsData);

      // DEBUG: Check the structure of the first doctor
      if (doctorsData.length > 0) {
        console.log("🔍 First doctor object:", doctorsData[0]);
        console.log("🔍 Available keys:", Object.keys(doctorsData[0]));
      }

      setDoctors(doctorsData);

      if (doctorsData.length === 1) {
        setSelectedDoctor(doctorsData[0]);
        // Try different possible ID fields
        const doctorId =
          doctorsData[0]._id || doctorsData[0].id || doctorsData[0].doctor_id;
        console.log("🔍 Setting doctorId:", doctorId);
        setFormData((prev) => ({ ...prev, doctorId }));
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      Alert.alert("Error", "Failed to load doctors for this clinic");
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  useEffect(() => {
    if (clinicId && visible) {
      fetchDoctorsByClinic();
      setAvailableSlots(generateTimeSlots());
    }
  }, [clinicId, visible]);

  const resetForm = () => {
    setCurrentTab(1);
    setFormData({
      doctorId: "",
      date: new Date(),
      time: "",
      type: "consultation",
      status: "scheduled",
      bookingType: "walk-in",
      notes: "",
      paymentMethod: "cash",
    });
    setSelectedDoctor(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const nextTab = () => setCurrentTab((prev) => Math.min(prev + 1, 4));
  const prevTab = () => setCurrentTab((prev) => Math.max(prev - 1, 1));

  const handleAddAppointment = async () => {
    console.log("🔄 Form Data:", formData); // Debug log

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
      const appointmentDateTime = `${datePart}T${formData.time}:00.000Z`;

      const appointmentData = {
        appointment_id: `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        clinic_id: clinicId,
        doctor_id: formData.doctorId,
        patient_id: user?._id || "default-patient-id",
        consultation_fees: selectedDoctor?.consultationFee || "50.00",
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

      Alert.alert("Success", "Appointment booked successfully! 🎉");

      if (onAppointmentAdded) {
        onAppointmentAdded();
      }

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Error booking appointment:", error);
      Alert.alert("Error", "Failed to book appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tab Components
  const DateTab = () => (
    <View className="space-y-6">
      <View className="items-center">
        <Text className="text-xl font-semibold text-slate-800">
          Select Date
        </Text>
        <Text className="text-slate-500 mt-2 text-center">
          Choose your preferred date
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        key="date-scrollview" // ADD KEY PROP
      >
        <View className="flex-row gap-3">
          {[...Array(7)].map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index);
            const isSelected =
              formData.date.toDateString() === date.toDateString();

            return (
              <TouchableOpacity
                key={`date-${index}`} // UNIQUE KEY
                onPress={() => setFormData({ ...formData, date })}
                className={`p-4 rounded-xl border-2 min-w-[80px] items-center ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${isSelected ? "text-cyan-700" : "text-slate-600"}`}
                >
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </Text>
                <Text
                  className={`text-lg font-bold mt-1 ${isSelected ? "text-cyan-700" : "text-slate-800"}`}
                >
                  {date.getDate()}
                </Text>
                <Text
                  className={`text-xs ${isSelected ? "text-cyan-600" : "text-slate-500"}`}
                >
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={nextTab}
        disabled={!doctors.length}
        className={`w-full py-4 rounded-xl items-center ${
          !doctors.length ? "bg-cyan-300" : "bg-cyan-500"
        }`}
      >
        <Text className="text-white font-medium text-base">
          {doctors.length ? "Continue to Time" : "Loading doctors..."}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const TimeTab = () => (
    <View className="space-y-6">
      <View className="items-center">
        <Text className="text-xl font-semibold text-slate-800">
          Choose Time
        </Text>
        <Text className="text-slate-500 mt-2 text-center">
          Select your preferred time
        </Text>
      </View>

      <ScrollView
        className="max-h-64"
        key="time-scrollview" // ADD KEY PROP
      >
        <View className="flex-row flex-wrap justify-between gap-2">
          {availableSlots.map((slot, index) => (
            <TouchableOpacity
              key={`time-${slot}-${index}`} // UNIQUE KEY
              onPress={() => setFormData({ ...formData, time: slot })}
              className={`p-4 rounded-xl border-2 w-[48%] items-center ${
                formData.time === slot
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <Text
                className={`font-semibold ${formData.time === slot ? "text-blue-700" : "text-slate-800"}`}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="flex-row gap-3 pt-4">
        <TouchableOpacity
          onPress={prevTab}
          className="flex-1 py-3 border border-slate-200 rounded-xl items-center"
        >
          <Text className="text-slate-600 font-medium">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nextTab}
          disabled={!formData.time}
          className={`flex-1 py-3 rounded-xl items-center ${
            !formData.time ? "bg-cyan-300" : "bg-cyan-500"
          }`}
        >
          <Text className="text-white font-medium">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const BookingTab = () => (
    <View className="space-y-6">
      <View className="items-center">
        <Text className="text-xl font-semibold text-slate-800">
          Confirm Booking
        </Text>
        <Text className="text-slate-500 mt-2 text-center">
          Review your appointment
        </Text>
      </View>

      <View className="bg-slate-50 rounded-2xl p-6 space-y-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-600">Clinic:</Text>
          <Text className="font-semibold text-slate-800">{clinicName}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-600">Doctor:</Text>
          <Text className="font-semibold text-slate-800">
            {selectedDoctor?.name || "Not selected"}
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
          <Text className="font-semibold text-slate-800">{formData.time}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-600">Type:</Text>
          <Text className="font-semibold text-slate-800 capitalize">
            {formData.type}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-3 pt-4">
        <TouchableOpacity
          onPress={prevTab}
          className="flex-1 py-3 border border-slate-200 rounded-xl items-center"
        >
          <Text className="text-slate-600 font-medium">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nextTab}
          className="flex-1 py-3 bg-cyan-500 rounded-xl items-center"
        >
          <Text className="text-white font-medium">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const DetailsTab = () => (
    <View className="space-y-6">
      <View className="items-center">
        <Text className="text-xl font-semibold text-slate-800">
          Final Details
        </Text>
        <Text className="text-slate-500 mt-2 text-center">
          Complete your booking
        </Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Appointment Type
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            key="appointment-type-scrollview" // ADD KEY PROP
          >
            <View className="flex-row gap-2">
              {appointmentTypes.map((type) => (
                <TouchableOpacity
                  key={`type-${type.value}`} // UNIQUE KEY
                  onPress={() => setFormData({ ...formData, type: type.value })}
                  className={`px-4 py-2 rounded-lg ${
                    formData.type === type.value ? type.color : "bg-slate-100"
                  }`}
                >
                  <Text
                    className={
                      formData.type === type.value
                        ? "text-white font-medium"
                        : "text-slate-700"
                    }
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View>
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Select Doctor
          </Text>
          <ScrollView className="max-h-32" key="doctors-scrollview">
            {doctors.map((doctor) => {
              // Try different possible ID fields
              const doctorId = doctor._id || doctor.id || doctor.doctor_id;
              console.log("🔍 Doctor available:", doctor.name, "ID:", doctorId);

              return (
                <TouchableOpacity
                  key={`doctor-${doctorId}`}
                  onPress={() => {
                    console.log(
                      "👨‍⚕️ Doctor selected:",
                      doctor.name,
                      "ID:",
                      doctorId
                    );
                    setSelectedDoctor(doctor);
                    setFormData({ ...formData, doctorId });
                  }}
                  className={`p-3 rounded-lg mb-2 border ${
                    formData.doctorId === doctorId
                      ? "bg-cyan-50 border-cyan-500"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <Text className="font-semibold text-slate-800">
                    {doctor.name}
                  </Text>
                  <Text className="text-slate-600 text-sm">
                    {doctor.specialization}
                  </Text>
                  {doctor.consultationFee && (
                    <Text className="text-green-600 text-sm mt-1">
                      Fee: ${doctor.consultationFee}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View>
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Additional Notes
          </Text>
          <TextInput
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={3}
            className="border border-slate-300 rounded-xl bg-white p-3 text-slate-800"
            placeholder="Any specific concerns or notes..."
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <View className="flex-row gap-3 pt-4">
        <TouchableOpacity
          onPress={prevTab}
          className="flex-1 py-3 border border-slate-200 rounded-xl items-center"
        >
          <Text className="text-slate-600 font-medium">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAddAppointment}
          disabled={isLoading || !formData.doctorId}
          className={`flex-1 py-3 rounded-xl items-center ${
            isLoading || !formData.doctorId
              ? "bg-emerald-300"
              : "bg-emerald-500"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white font-medium">
              {!formData.doctorId ? "Select Doctor First" : "Confirm Booking"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const tabContent = () => {
    switch (currentTab) {
      case 1:
        return <DateTab key="tab-1" />; // ADD KEY
      case 2:
        return <TimeTab key="tab-2" />; // ADD KEY
      case 3:
        return <BookingTab key="tab-3" />; // ADD KEY
      case 4:
        return <DetailsTab key="tab-4" />; // ADD KEY
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-3xl w-full max-w-md max-h-[90%]">
          {/* Header */}
          <View className="bg-cyan-500 p-6 rounded-t-3xl">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-white">
                  Book Appointment
                </Text>
                <Text className="text-cyan-100 text-sm mt-1">{clinicName}</Text>
              </View>
              <TouchableOpacity onPress={handleClose} className="p-2">
                <Feather name="x" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Progress Steps */}
            <View className="flex-row justify-between items-center">
              {steps.map((step, index) => (
                <View
                  key={`step-${step.number}`} // UNIQUE KEY
                  className="flex-col items-center flex-1"
                >
                  <View
                    className={`w-8 h-8 rounded-full border-2 items-center justify-center ${
                      currentTab >= step.number
                        ? "bg-white border-white"
                        : "border-white/30"
                    }`}
                  >
                    {step.completed ? (
                      <Feather name="check" size={14} color="#0891b2" />
                    ) : (
                      <Feather
                        name={step.icon}
                        size={14}
                        color={currentTab >= step.number ? "#0891b2" : "white"}
                      />
                    )}
                  </View>
                  <Text
                    className={`text-xs mt-1 font-medium ${
                      currentTab >= step.number ? "text-white" : "text-white/60"
                    }`}
                  >
                    {step.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Content */}
          <ScrollView
            className="p-6"
            showsVerticalScrollIndicator={false}
            key="main-content-scrollview" // ADD KEY PROP
          >
            {tabContent()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentBookingModal;
