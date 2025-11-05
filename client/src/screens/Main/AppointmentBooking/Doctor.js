import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { doctorServices } from "../../../services/doctorServices";
import { getSpecialties } from "../../../utils/getSpecialty";

const Doctor = ({
  formData,
  setFormData,
  selectedDoctor,
  setSelectedDoctor,
  doctors,
  setDoctors,
  filteredDoctors,
  setFilteredDoctors,
  clinicId,
  nextTab,
  prevTab,
}) => {
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

  useEffect(() => {
    if (clinicId && doctors.length === 0) {
      fetchDoctorsByClinic();
    }
  }, [clinicId]);

  useEffect(() => {
    if (formData.specialtyFilter) {
      filterDoctorsBySpecialty(formData.specialtyFilter);
    }
  }, [formData.specialtyFilter, doctors]);

  return (
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
};

export default Doctor;
