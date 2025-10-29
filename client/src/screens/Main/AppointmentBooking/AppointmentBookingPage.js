"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import appointmentServices from "../../../services/appointmentsServices";
import { doctorServices } from "../../../services/doctorServices";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import {
  getSpecialties,
  getSpecialtyDoctor,
} from "../../../utils/getSpecialty";

const AppointmentBookingPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clinicId, clinicName } = route.params;

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
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
    specialtyFilter: "",
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { user } = useContext(AuthenticationContext);

  const appointmentTypes = [
    {
      value: "consultation",
      label: "General Consultation",
      color: "bg-cyan-500",
      specialties: ["General Medicine", "Family Medicine", "Internal Medicine"],
    },
    {
      value: "dental",
      label: "Dental",
      color: "bg-blue-500",
      specialties: ["Dentistry", "Orthodontics", "Oral Surgery"],
    },
    {
      value: "cardiology",
      label: "Heart & Cardiology",
      color: "bg-red-500",
      specialties: ["Cardiology", "Hypertension", "Heart Disease"],
    },
    {
      value: "pediatrics",
      label: "Pediatrics",
      color: "bg-green-500",
      specialties: ["Pediatrics", "Child Care", "Vaccinations"],
    },
    {
      value: "orthopedics",
      label: "Orthopedics",
      color: "bg-orange-500",
      specialties: ["Orthopedics", "Sports Medicine", "Joint Pain"],
    },
    {
      value: "diabetes",
      label: "Diabetes Care",
      color: "bg-purple-500",
      specialties: ["Diabetes", "Endocrinology", "Metabolic Disorders"],
    },
    {
      value: "screening",
      label: "Health Screening",
      color: "bg-yellow-500",
      specialties: ["General Medicine", "Preventive Care"],
    },
  ];

  const steps = [
    { number: 1, title: "Specialty", icon: "heart", completed: currentTab > 1 },
    { number: 2, title: "Date", icon: "calendar", completed: currentTab > 2 },
    { number: 3, title: "Doctor", icon: "user", completed: currentTab > 3 },
    { number: 4, title: "Time", icon: "clock", completed: currentTab > 4 },
    { number: 5, title: "Details", icon: "edit-3", completed: currentTab > 5 },
    { number: 6, title: "Confirm", icon: "check", completed: currentTab > 6 },
  ];

  const fetchDoctorsByClinic = async () => {
    try {
      if (!clinicId) return;

      console.log("🔄 Fetching doctors for clinic:", clinicId);
      const doctorsData = await doctorServices.getDoctorsByClinicId(clinicId);
      console.log("✅ Doctors fetched:", doctorsData);

      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      Alert.alert("Error", "Failed to load doctors for this clinic");
    }
  };

  const getUniqueSpecialties = () => {
    const specialties = new Set();
    doctors.forEach((doctor) => {
      const doctorSpecialties = getSpecialties(doctor.specialties);

      if (Array.isArray(doctorSpecialties)) {
        doctorSpecialties.forEach((spec) => {
          if (spec && typeof spec === "string") {
            specialties.add(spec.trim());
          }
        });
      } else if (doctorSpecialties && typeof doctorSpecialties === "string") {
        doctorSpecialties.split(",").forEach((spec) => {
          const trimmedSpec = spec.trim();
          if (trimmedSpec) {
            specialties.add(trimmedSpec);
          }
        });
      }
    });
    return Array.from(specialties).slice(0, 8);
  };

  const filterDoctorsBySpecialty = (specialtyFilter) => {
    if (!specialtyFilter) {
      setFilteredDoctors(doctors);
      return;
    }

    const filtered = doctors.filter((doctor) => {
      const doctorSpecialties =
        doctor.specialties || doctor.specialization || "";
      const searchTerm = specialtyFilter.toLowerCase();

      if (Array.isArray(doctorSpecialties)) {
        return doctorSpecialties.some(
          (spec) =>
            spec &&
            typeof spec === "string" &&
            spec.toLowerCase().includes(searchTerm)
        );
      } else if (doctorSpecialties && typeof doctorSpecialties === "string") {
        return doctorSpecialties.toLowerCase().includes(searchTerm);
      }
      return false;
    });

    setFilteredDoctors(filtered);
  };

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
    if (clinicId) {
      fetchDoctorsByClinic();
      setAvailableSlots(generateTimeSlots());
    }
  }, [clinicId]);

  const nextTab = () => setCurrentTab((prev) => Math.min(prev + 1, 6));
  const prevTab = () => setCurrentTab((prev) => Math.max(prev - 1, 1));

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

  const SpecialtyTab = () => {
    const popularSpecialties = getUniqueSpecialties();

    return (
      <View className="flex-1">
        <View className="items-center mb-6">
          <Text className="text-xl font-semibold text-slate-800">
            What type of care do you need?
          </Text>
          <Text className="text-slate-500 mt-2 text-center">
            Choose a specialty to find the right doctor
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-3">
            Popular Specialties
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-2 pr-6">
              {popularSpecialties.map((specialty, index) => (
                <TouchableOpacity
                  key={`specialty-${index}`}
                  onPress={() => {
                    setFormData((prev) => ({
                      ...prev,
                      specialtyFilter: specialty,
                    }));
                    filterDoctorsBySpecialty(specialty);
                  }}
                  className={`px-4 py-3 rounded-xl border-2 ${
                    formData.specialtyFilter === specialty
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <Text
                    className={
                      formData.specialtyFilter === specialty
                        ? "text-cyan-700 font-medium"
                        : "text-slate-700"
                    }
                  >
                    {specialty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="flex-1 mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-3">
            Or choose appointment type
          </Text>
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="gap-3 pb-4">
              {appointmentTypes.map((type) => (
                <TouchableOpacity
                  key={`type-${type.value}`}
                  onPress={() => {
                    setFormData((prev) => ({
                      ...prev,
                      type: type.value,
                      specialtyFilter: type.specialties[0],
                    }));
                    filterDoctorsBySpecialty(type.specialties[0]);
                  }}
                  className={`p-4 rounded-xl border-2 ${
                    formData.type === type.value
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={
                        formData.type === type.value
                          ? "text-cyan-700 font-semibold text-base"
                          : "text-slate-800 font-medium text-base"
                      }
                    >
                      {type.label}
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={20}
                      color={
                        formData.type === type.value ? "#0891b2" : "#64748b"
                      }
                    />
                  </View>
                  {formData.type === type.value && (
                    <Text className="text-cyan-600 text-sm mt-1">
                      Specialists in: {type.specialties.join(", ")}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="pt-4">
          <TouchableOpacity
            onPress={nextTab}
            disabled={!formData.type}
            className={`w-full py-4 rounded-xl items-center justify-center ${!formData.type ? "bg-cyan-300" : "bg-cyan-500"}`}
          >
            <Text className="text-white font-medium text-base">
              {!formData.type
                ? "Select Care Type"
                : "Continue to Date Selection"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const DateTab = () => (
    <View className="flex-1">
      <View className="items-center mb-6">
        <Text className="text-xl font-semibold text-slate-800">
          Select Date
        </Text>
        <Text className="text-slate-500 mt-2 text-center">
          Choose your preferred date for {formData.type.replace(/-/g, " ")}
        </Text>
      </View>

      <View className="mb-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3 pr-6">
            {[...Array(7)].map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index);
              const isSelected =
                formData.date.toDateString() === date.toDateString();

              return (
                <TouchableOpacity
                  key={`date-${index}`}
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
      </View>

      <View className="flex-row gap-3 mt-auto pt-4">
        <TouchableOpacity
          onPress={prevTab}
          className="flex-1 py-4 border-2 border-slate-300 rounded-xl items-center"
        >
          <Text className="text-slate-700 font-semibold text-base">Back</Text>
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
  );

  const DoctorTab = () => (
    <View className="flex-1">
      <View className="items-center mb-6">
        <Text className="text-xl font-semibold text-slate-800">
          Select Doctor
        </Text>
        <Text className="text-slate-500 mt-2 text-center">
          {formData.specialtyFilter
            ? `Specialists in ${formData.specialtyFilter}`
            : "Choose your preferred doctor"}
        </Text>
        {filteredDoctors.length > 0 && (
          <Text className="text-slate-400 text-sm mt-1">
            {filteredDoctors.length} doctor
            {filteredDoctors.length !== 1 ? "s" : ""} available
          </Text>
        )}
      </View>

      {formData.specialtyFilter && (
        <View className="flex-row items-center justify-between bg-cyan-50 p-3 rounded-xl mb-4">
          <View className="flex-row items-center gap-2">
            <Feather name="filter" size={16} color="#0891b2" />
            <Text className="text-cyan-700 font-medium">
              Filtered by: {formData.specialtyFilter}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setFormData((prev) => ({ ...prev, specialtyFilter: "" }));
              setFilteredDoctors(doctors);
            }}
            className="p-1"
          >
            <Feather name="x" size={16} color="#0891b2" />
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-1 mb-4">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {filteredDoctors.length === 0 ? (
            <View className="items-center py-8">
              <Feather name="user-x" size={48} color="#94a3b8" />
              <Text className="text-slate-500 mt-3 text-center">
                {doctors.length === 0
                  ? "No doctors available at this clinic"
                  : `No doctors found for "${formData.specialtyFilter}"`}
              </Text>
              {doctors.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setFormData((prev) => ({ ...prev, specialtyFilter: "" }));
                    setFilteredDoctors(doctors);
                  }}
                  className="mt-3 px-4 py-2 bg-cyan-500 rounded-lg"
                >
                  <Text className="text-white font-medium">
                    Show All Doctors
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="gap-3 pb-4">
              {filteredDoctors.map((doctor) => {
                const doctorId = doctor._id || doctor.id || doctor.doctor_id;
                const specialties = getSpecialties(doctor.specialties);
                const experience =
                  doctor.experience_years || doctor.experience || 0;
                const rating = doctor.rating || 4.5;
                const consultationFee =
                  doctor.consultation_fee || doctor.consultationFee || "50.00";

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
                    className={`p-4 rounded-xl border-2 ${
                      formData.doctorId === doctorId
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <View className="flex-row items-start gap-3">
                      <View className="w-12 h-12 rounded-full bg-cyan-100 items-center justify-center">
                        {doctor.photo ? (
                          <Image
                            source={{ uri: doctor.photo }}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <Feather name="user" size={20} color="#0891b2" />
                        )}
                      </View>

                      <View className="flex-1">
                        <Text className="font-semibold text-slate-800 text-lg">
                          {doctor.name}
                        </Text>

                        <Text className="text-cyan-600 text-sm font-medium mt-1">
                          {specialties}
                        </Text>

                        <View className="flex-row items-center gap-4 mt-2">
                          <View className="flex-row items-center gap-1">
                            <Feather name="award" size={14} color="#f59e0b" />
                            <Text className="text-slate-600 text-sm">
                              {experience} years
                            </Text>
                          </View>

                          <View className="flex-row items-center gap-1">
                            <Feather name="star" size={14} color="#f59e0b" />
                            <Text className="text-slate-600 text-sm">
                              {rating}/5
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row justify-between items-center mt-2">
                          <Text className="text-green-600 font-semibold text-base">
                            ₱{consultationFee}
                          </Text>
                          <View
                            className={`px-2 py-1 rounded-full ${
                              doctor.is_active === 0
                                ? "bg-red-100"
                                : "bg-green-100"
                            }`}
                          >
                            <Text
                              className={`text-xs font-medium ${
                                doctor.is_active === 0
                                  ? "text-red-700"
                                  : "text-green-700"
                              }`}
                            >
                              {doctor.is_active === 0
                                ? "Not Available"
                                : "Available"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
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
          disabled={!formData.doctorId}
          className={`flex-1 py-4 rounded-xl items-center justify-center ${!formData.doctorId ? "bg-cyan-300" : "bg-cyan-500"}`}
        >
          <Text className="text-white font-semibold text-base">
            {!formData.doctorId ? "Select Doctor" : "Continue to Time"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const TimeTab = () => (
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

  const DetailsTab = () => {
    // Create a completely isolated state for notes
    const [localNotes, setLocalNotes] = useState(formData.notes);

    // Only update the main form data when we leave this tab
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

  const ConfirmTab = () => {
    const selectedTimeSlot = availableSlots.find(
      (slot) => slot.military === formData.time
    );
    const displayTime = selectedTimeSlot
      ? selectedTimeSlot.display
      : formData.time;

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
                  {selectedDoctor?.specialties ||
                    selectedDoctor?.specialization}
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
            className={`flex-1 py-4 rounded-xl items-center justify-center ${isLoading ? "bg-emerald-300" : "bg-emerald-500"}`}
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

  const tabContent = () => {
    switch (currentTab) {
      case 1:
        return <SpecialtyTab key="tab-1" />;
      case 2:
        return <DateTab key="tab-2" />;
      case 3:
        return <DoctorTab key="tab-3" />;
      case 4:
        return <TimeTab key="tab-4" />;
      case 5:
        return <DetailsTab key="tab-5" />;
      case 6:
        return <ConfirmTab key="tab-6" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="bg-cyan-500 px-6 pt-4 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 ml-4">
            <Text className="text-2xl font-bold text-white text-center">
              Book Appointment
            </Text>
            <Text className="text-cyan-100 text-sm text-center mt-1">
              {clinicName}
            </Text>
          </View>
          <View className="w-8" />
        </View>

        <View className="flex-row justify-between items-center px-2">
          {steps.map((step, index) => (
            <React.Fragment key={`step-${step.number}`}>
              <View className="flex-col items-center">
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
                  className={`text-xs mt-1 font-medium ${currentTab >= step.number ? "text-white" : "text-white/60"}`}
                >
                  {step.title}
                </Text>
              </View>

              {index < steps.length - 1 && (
                <View
                  className={`flex-1 h-0.5 mx-1 ${currentTab > step.number ? "bg-white" : "bg-white/30"}`}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <View className="flex-1 px-6 py-6">{tabContent()}</View>
    </SafeAreaView>
  );
};

export default AppointmentBookingPage;
