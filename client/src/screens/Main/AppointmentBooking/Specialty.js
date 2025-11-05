import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getSpecialties } from "../../../utils/getSpecialty";

const Specialty = ({
  formData,
  setFormData,
  doctors,
  filteredDoctors,
  setFilteredDoctors,
  nextTab,
}) => {
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
                    color={formData.type === type.value ? "#0891b2" : "#64748b"}
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
            {!formData.type ? "Select Care Type" : "Continue to Date Selection"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Specialty;
