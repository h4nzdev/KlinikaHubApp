import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";

// Mock doctors data
const mockDoctors = [
  {
    _id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    experience: "8+ years",
    consultation: "$45",
    rating: 4.8,
    reviews: 120,
  },
  {
    _id: "2",
    name: "Dr. Mike Chen",
    specialty: "Dermatology",
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
    experience: "10+ years",
    consultation: "$50",
    rating: 4.9,
    reviews: 150,
  },
  {
    _id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
    experience: "6+ years",
    consultation: "$40",
    rating: 4.7,
    reviews: 98,
  },
  {
    _id: "4",
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
    experience: "12+ years",
    consultation: "$55",
    rating: 4.9,
    reviews: 200,
  },
  {
    _id: "5",
    name: "Dr. Lisa Anderson",
    specialty: "Neurology",
    profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
    experience: "9+ years",
    consultation: "$60",
    rating: 4.8,
    reviews: 145,
  },
  {
    _id: "6",
    name: "Dr. Robert Brown",
    specialty: "General Practice",
    profileImage: "https://randomuser.me/api/portraits/men/6.jpg",
    experience: "7+ years",
    consultation: "$35",
    rating: 4.6,
    reviews: 89,
  },
];

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const navigation = useNavigation();
  const [user] = useState({
    _id: "user123",
    name: "Hanz Christian Angelo G Magbal",
    clinicId: { _id: "clinic123" },
  });

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setDoctors(mockDoctors);
    }, 500);
  }, []);

  // Calculate unique specialties
  const uniqueSpecialties = new Set(doctors.map((d) => d.specialty)).size;

  // Stats data
  const stats = [
    {
      title: "Total Doctors",
      value: doctors.length,
      icon: "user",
      color: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "#0891b2",
      textColor: "text-cyan-700",
    },
    {
      title: "Specialties",
      value: uniqueSpecialties,
      icon: "activity",
      color: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "#059669",
      textColor: "text-emerald-700",
    },
    {
      title: "Available",
      value: doctors.length,
      icon: "star",
      color: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "#9333ea",
      textColor: "text-purple-700",
    },
  ];

  const handleDoctorPress = (doctorId) => {
    // Navigate to doctor details
    navigation.navigate("DoctorDetails", { doctorId });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-4 gap-8">
          {/* Header Section */}
          <View>
            <Text className="text-3xl font-bold text-slate-800 mb-2">
              Our Doctors
            </Text>
            <Text className="text-slate-600 text-lg">
              Meet our team of experienced healthcare professionals ready to
              serve you.
            </Text>
          </View>

          {/* Stats Section */}
          <View>
            <View className="gap-4">
              {/* First Row - 2 stats */}
              <View className="flex-row gap-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <View key={index} className="flex-1">
                    <View
                      className={`${stat.color} border border-white/20 rounded-2xl p-4 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-2 opacity-80`}
                          >
                            {stat.title}
                          </Text>
                          <Text className="text-2xl font-bold text-slate-800">
                            {stat.value}
                          </Text>
                        </View>
                        <View
                          className={`p-3 rounded-xl ${stat.iconBg} ml-3 shadow-md`}
                        >
                          <Feather
                            name={stat.icon}
                            size={20}
                            color={stat.iconColor}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Second Row - 1 stat (full width) */}
              <View>
                {stats.slice(2, 3).map((stat, index) => (
                  <View key={index + 2}>
                    <View
                      className={`${stat.color} border border-white/20 rounded-2xl p-4 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-2 opacity-80`}
                          >
                            {stat.title}
                          </Text>
                          <Text className="text-2xl font-bold text-slate-800">
                            {stat.value}
                          </Text>
                        </View>
                        <View
                          className={`p-3 rounded-xl ${stat.iconBg} ml-3 shadow-md`}
                        >
                          <Feather
                            name={stat.icon}
                            size={20}
                            color={stat.iconColor}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Section Header */}
          <View>
            <Text className="text-2xl font-bold text-slate-800 mb-2">
              Available Doctors
            </Text>
            <Text className="text-slate-600 text-lg">
              {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} ready to
              help you
            </Text>
          </View>

          {/* Doctors List */}
          {doctors.length > 0 ? (
            <View className="gap-6">
              {doctors.map((doctor) => (
                <View
                  key={doctor._id}
                  className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6"
                >
                  {/* Doctor Header */}
                  <View className="flex-row gap-4 mb-4">
                    <View className="relative">
                      <Image
                        source={{ uri: doctor.profileImage }}
                        className="w-16 h-16 rounded-xl"
                        style={{ backgroundColor: "#e0f2fe" }}
                      />
                      <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-slate-800 mb-1">
                        {doctor.name}
                      </Text>
                      <Text className="text-slate-600 font-medium text-sm mb-2">
                        {doctor.specialty}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Feather name="star" size={16} color="#eab308" />
                        <Text className="font-semibold text-slate-700 text-sm">
                          {doctor.rating}
                        </Text>
                        <Text className="text-slate-500 text-sm">
                          ({doctor.reviews}+)
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Doctor Info Card */}
                  <View className="bg-slate-50/80 rounded-xl p-4 mb-4">
                    <View className="gap-2">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-slate-600 text-sm">
                          Experience:
                        </Text>
                        <Text className="font-semibold text-slate-700 text-sm">
                          {doctor.experience}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-slate-600 text-sm">
                          Consultation:
                        </Text>
                        <Text className="font-semibold text-emerald-600 text-sm">
                          {doctor.consultation}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-slate-600 text-sm">Status:</Text>
                        <Text className="font-semibold text-green-600 text-sm">
                          Available Today
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity
                    onPress={() => handleDoctorPress(doctor._id)}
                    className="flex-row items-center justify-center px-4 py-3 bg-cyan-500 rounded-xl shadow-lg"
                  >
                    <Feather name="calendar" size={16} color="#ffffff" />
                    <Text
                      onPress={() => navigation.navigate("DoctorProfile")}
                      className="text-white font-semibold ml-2"
                    >
                      View Full Details
                    </Text>
                    <Feather
                      name="arrow-right"
                      size={16}
                      color="#ffffff"
                      className="ml-2"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            // Empty State
            <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-12 items-center">
              <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                <Feather name="activity" size={64} color="#9ca3af" />
              </View>
              <Text className="text-xl font-bold text-slate-700 mb-2">
                No doctors available
              </Text>
              <Text className="text-slate-500 text-lg text-center">
                Please check back later or contact support.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Doctors;
