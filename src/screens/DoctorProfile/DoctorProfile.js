import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../components/Header";

// Mock doctor data
const mockDoctor = {
  _id: "1",
  name: "Dr. Sarah Johnson",
  specialty: "Cardiology",
  qualification: "MD, FACC",
  experience: 12,
  gender: "Female",
  status: "Active",
  email: "sarah.johnson@kinika.com",
  phone: "+1 234 567 8900",
  profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
  availability: [
    { day: "Monday", startTime: "09:00 AM", endTime: "05:00 PM" },
    { day: "Wednesday", startTime: "09:00 AM", endTime: "05:00 PM" },
    { day: "Friday", startTime: "09:00 AM", endTime: "02:00 PM" },
  ],
};

// Mock reviews data
const mockReviews = [
  {
    _id: "1",
    patient: {
      name: "John Doe",
      patientPicture: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    rating: 5,
    comment:
      "Excellent doctor! Very professional and caring. Highly recommend!",
    createdAt: "2024-01-15T10:00:00",
  },
  {
    _id: "2",
    patient: {
      name: "Jane Smith",
      patientPicture: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    rating: 4,
    comment: "Great experience. Dr. Johnson explained everything clearly.",
    createdAt: "2024-01-10T14:00:00",
  },
];

const DoctorProfile = ({ route, navigation }) => {
  const [doctor] = useState(mockDoctor);
  const [reviews, setReviews] = useState(mockReviews);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [hasUnpaid] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "#059669";
    if (rating >= 3) return "#eab308";
    return "#f97316";
  };

  const handleBookAppointment = () => {
    if (hasUnpaid) {
      Alert.alert(
        "Unpaid Balance",
        "You have an unpaid balance. Please settle it before booking."
      );
      return;
    }
    setIsBookingModalVisible(true);
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }
    if (!reviewComment.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    const newReview = {
      _id: Date.now().toString(),
      patient: {
        name: "Current User",
        patientPicture: "https://randomuser.me/api/portraits/men/5.jpg",
      },
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString(),
    };

    setReviews([newReview, ...reviews]);
    setIsReviewModalVisible(false);
    setReviewRating(0);
    setReviewComment("");
    Alert.alert("Success", "Review submitted successfully!");
  };

  if (!doctor) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <Header />
        <View className="flex-1 items-center justify-center p-4">
          <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-12 items-center max-w-md">
            <View className="bg-slate-100 rounded-2xl p-6 mb-6">
              <Feather name="activity" size={64} color="#9ca3af" />
            </View>
            <Text className="text-xl font-bold text-slate-700 mb-2">
              Doctor not found
            </Text>
            <Text className="text-slate-500 text-lg text-center">
              The requested doctor profile could not be found.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
        <View className="p-4 gap-6">
          {/* Doctor Header Card */}
          <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6">
            <View className="items-center mb-6">
              {/* Doctor Image */}
              <View className="relative mb-4">
                <Image
                  source={{ uri: doctor.profileImage }}
                  className="w-32 h-32 rounded-2xl"
                  style={{ backgroundColor: "#e0f2fe" }}
                />
                <View className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white items-center justify-center">
                  <View className="w-3 h-3 bg-white rounded-full" />
                </View>
              </View>

              {/* Doctor Name */}
              <Text className="text-3xl font-bold text-slate-800 text-center mb-4">
                {doctor.name}
              </Text>

              {/* Doctor Info Grid */}
              <View className="w-full gap-3 mb-4">
                <View className="flex-row items-center justify-center">
                  <Feather name="activity" size={20} color="#0891b2" />
                  <Text className="text-slate-600 font-medium ml-3 text-base">
                    {doctor.specialty}
                  </Text>
                </View>

                <View className="flex-row items-center justify-center">
                  <Feather name="award" size={20} color="#059669" />
                  <Text className="text-slate-600 font-medium ml-3 text-base">
                    {doctor.qualification}
                  </Text>
                </View>

                <View className="flex-row items-center justify-center">
                  <Feather name="briefcase" size={20} color="#d97706" />
                  <Text className="text-slate-600 font-medium ml-3 text-base">
                    {doctor.experience} years experience
                  </Text>
                </View>

                <View className="flex-row items-center justify-center">
                  <Feather name="user" size={20} color="#9333ea" />
                  <Text className="text-slate-600 font-medium ml-3 text-base">
                    {doctor.gender}
                  </Text>
                </View>
              </View>

              {/* Rating */}
              <View className="flex-row items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Feather key={star} name="star" size={18} color="#eab308" />
                ))}
                <Text className="text-slate-600 font-semibold ml-2">
                  4.9 (150+ reviews)
                </Text>
              </View>

              {/* Status Badge */}
              <View
                className={`flex-row items-center gap-2 px-4 py-2 rounded-full ${
                  doctor.status === "Active" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <Feather
                  name="award"
                  size={16}
                  color={doctor.status === "Active" ? "#059669" : "#dc2626"}
                />
                <Text
                  className={`font-semibold ${
                    doctor.status === "Active"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {doctor.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6">
            <Text className="text-2xl font-bold text-slate-800 mb-6">
              Contact Information
            </Text>

            <View className="gap-4">
              <View className="flex-row items-center gap-4 p-4 bg-slate-50/80 rounded-xl">
                <View className="p-3 bg-cyan-100 rounded-xl">
                  <Feather name="mail" size={20} color="#0891b2" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                    Email
                  </Text>
                  <Text className="text-slate-700 font-medium">
                    {doctor.email}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-4 p-4 bg-slate-50/80 rounded-xl">
                <View className="p-3 bg-emerald-100 rounded-xl">
                  <Feather name="phone" size={20} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                    Phone
                  </Text>
                  <Text className="text-slate-700 font-medium">
                    {doctor.phone}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Availability */}
          <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6">
            <Text className="text-2xl font-bold text-slate-800 mb-6">
              Availability
            </Text>

            <View className="gap-3">
              {doctor.availability.map((schedule, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between p-4 bg-slate-50/80 rounded-xl"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="p-2 bg-purple-100 rounded-lg">
                      <Feather name="calendar" size={16} color="#9333ea" />
                    </View>
                    <Text className="font-semibold text-slate-700">
                      {schedule.day}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Feather name="clock" size={16} color="#64748b" />
                    <Text className="font-medium text-slate-600 text-sm">
                      {schedule.startTime} - {schedule.endTime}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* About Section */}
          <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6">
            <Text className="text-2xl font-bold text-slate-800 mb-6">
              About Dr. {doctor.name.split(" ")[0]}
            </Text>

            <View className="gap-4 mb-6">
              <View className="bg-cyan-50 rounded-2xl p-6 items-center border border-cyan-100">
                <View className="p-4 bg-cyan-100 rounded-2xl mb-4">
                  <Feather name="award" size={32} color="#0891b2" />
                </View>
                <Text className="text-2xl font-bold text-slate-800 mb-1">
                  {doctor.experience}+
                </Text>
                <Text className="text-cyan-700 font-semibold">
                  Years Experience
                </Text>
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1 bg-emerald-50 rounded-2xl p-6 items-center border border-emerald-100">
                  <View className="p-4 bg-emerald-100 rounded-2xl mb-4">
                    <Feather name="users" size={32} color="#059669" />
                  </View>
                  <Text className="text-2xl font-bold text-slate-800 mb-1">
                    500+
                  </Text>
                  <Text className="text-emerald-700 font-semibold text-center">
                    Happy Patients
                  </Text>
                </View>

                <View className="flex-1 bg-amber-50 rounded-2xl p-6 items-center border border-amber-100">
                  <View className="p-4 bg-amber-100 rounded-2xl mb-4">
                    <Feather name="star" size={32} color="#d97706" />
                  </View>
                  <Text className="text-2xl font-bold text-slate-800 mb-1">
                    4.9
                  </Text>
                  <Text className="text-amber-700 font-semibold text-center">
                    Patient Rating
                  </Text>
                </View>
              </View>
            </View>

            <View className="p-6 bg-slate-50/80 rounded-xl">
              <Text className="text-slate-600 leading-relaxed">
                Dr. {doctor.name} is a dedicated {doctor.specialty} with{" "}
                {doctor.experience} years of experience in providing quality
                healthcare services. Known for compassionate care and expertise
                in the field.
              </Text>
            </View>
          </View>

          {/* Patient Reviews */}
          <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-slate-800">
                Patient Reviews
              </Text>
              <TouchableOpacity
                onPress={() => setIsReviewModalVisible(true)}
                className="px-4 py-2 bg-cyan-500 rounded-xl"
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold text-sm">
                  Add Review
                </Text>
              </TouchableOpacity>
            </View>

            <View className="gap-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <View
                    key={review._id}
                    className="p-6 bg-slate-50 rounded-2xl border border-slate-200"
                  >
                    <View className="flex-row gap-4 mb-4">
                      <Image
                        source={{ uri: review.patient.patientPicture }}
                        className="w-14 h-14 rounded-full"
                        style={{ backgroundColor: "#e0f2fe" }}
                      />
                      <View className="flex-1">
                        <Text className="font-bold text-slate-800 text-lg mb-1">
                          {review.patient.name}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <Feather name="calendar" size={12} color="#64748b" />
                          <Text className="text-sm text-slate-500">
                            {formatDate(review.createdAt)}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-200">
                        <Feather
                          name="star"
                          size={16}
                          color={getRatingColor(review.rating)}
                        />
                        <Text className="text-sm font-semibold text-slate-600">
                          {review.rating}/5
                        </Text>
                      </View>
                    </View>

                    <View className="p-4 bg-white rounded-xl border border-slate-100">
                      <Text className="text-slate-700 leading-relaxed">
                        "{review.comment}"
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View className="py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 items-center">
                  <View className="w-20 h-20 bg-slate-200 rounded-full items-center justify-center mb-6">
                    <Feather name="star" size={40} color="#9ca3af" />
                  </View>
                  <Text className="text-xl font-semibold text-slate-600 mb-2">
                    No Reviews Yet
                  </Text>
                  <Text className="text-slate-500 text-center px-4">
                    Be the first to share your experience with this doctor.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Book Appointment Button */}
          <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6">
            <Text className="text-2xl font-bold text-slate-800 mb-2 text-center">
              Ready to schedule your appointment?
            </Text>
            <Text className="text-slate-600 mb-6 text-center">
              Book a consultation with Dr. {doctor.name} today
            </Text>
            <TouchableOpacity
              onPress={handleBookAppointment}
              className={`flex-row items-center justify-center px-8 py-4 rounded-2xl shadow-lg ${
                hasUnpaid ? "bg-gray-400" : "bg-cyan-500"
              }`}
              activeOpacity={0.8}
            >
              <Feather name="calendar" size={20} color="#ffffff" />
              <Text className="text-white font-semibold ml-3 text-lg">
                Book an Appointment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={isBookingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsBookingModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-slate-800">
                Book Appointment
              </Text>
              <TouchableOpacity
                onPress={() => setIsBookingModalVisible(false)}
                activeOpacity={0.7}
              >
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text className="text-slate-600 mb-6">
              Select your preferred date and time to book an appointment with
              Dr. {doctor.name}.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsBookingModalVisible(false);
                Alert.alert("Success", "Appointment request sent!");
              }}
              className="px-6 py-4 bg-cyan-500 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-center text-base">
                Confirm Booking
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal
        visible={isReviewModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsReviewModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-slate-800">
                Add Review
              </Text>
              <TouchableOpacity
                onPress={() => setIsReviewModalVisible(false)}
                activeOpacity={0.7}
              >
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <View>
                <Text className="text-sm font-semibold text-slate-700 mb-2">
                  Rating
                </Text>
                <View className="flex-row gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setReviewRating(star)}
                      activeOpacity={0.7}
                    >
                      <Feather
                        name="star"
                        size={32}
                        color={star <= reviewRating ? "#eab308" : "#e2e8f0"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text className="text-sm font-semibold text-slate-700 mb-2">
                  Comment
                </Text>
                <TextInput
                  placeholder="Share your experience..."
                  value={reviewComment}
                  onChangeText={setReviewComment}
                  multiline
                  numberOfLines={4}
                  className="px-4 py-3 border border-slate-200 rounded-xl bg-white"
                  placeholderTextColor="#94a3b8"
                  style={{ textAlignVertical: "top" }}
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmitReview}
                className="px-6 py-4 bg-cyan-500 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-center text-base">
                  Submit Review
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DoctorProfile;
