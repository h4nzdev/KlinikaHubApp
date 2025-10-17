import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import clinicServices from "../../../services/clinicServices";
import reviewServices from "../../../services/reviewServices"; // 👈 ADD THIS IMPORT
import { getSpecialties } from "../../../utils/getSpecialty";

const ClinicProfile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { clinicId } = route.params;

  const [clinic, setClinic] = useState(null);
  const [ratingStats, setRatingStats] = useState({
    // 👈 ADD REAL RATING STATE
    average: 0,
    totalReviews: 0,
    stars: [
      { count: 0, percentage: 0 },
      { count: 0, percentage: 0 },
      { count: 0, percentage: 0 },
      { count: 0, percentage: 0 },
      { count: 0, percentage: 0 },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true); // 👈 ADD SEPARATE LOADING FOR REVIEWS

  // Fetch clinic data AND review stats
  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        setLoading(true);
        setReviewsLoading(true);

        console.log("🔄 Fetching clinic and review data...");

        // Fetch clinic data
        const clinicData = await clinicServices.getClinicById(clinicId);
        setClinic(clinicData);

        // Fetch REAL rating stats
        const statsData = await reviewServices.getClinicRatingStats(clinicId);
        console.log("🔍 REAL STATS DATA:", statsData);

        if (statsData) {
          const transformedStats = transformRatingStats(statsData);
          console.log("🎯 TRANSFORMED STATS:", transformedStats);
          setRatingStats(transformedStats);
        }
      } catch (error) {
        console.error("❌ Error fetching clinic data:", error);
        Alert.alert("Error", "Failed to load clinic details");
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    if (clinicId) {
      fetchClinicData();
    }
  }, [clinicId]);

  // Transform backend stats to frontend format
  const transformRatingStats = (stats) => {
    console.log("🔍 Transforming stats:", stats);

    const total = stats.total_reviews || 0;
    const average = parseFloat(stats.average_rating || 0).toFixed(1);

    const stars = [
      {
        count: stats.five_star || 0,
        percentage: total > 0 ? Math.round((stats.five_star / total) * 100) : 0,
      },
      {
        count: stats.four_star || 0,
        percentage: total > 0 ? Math.round((stats.four_star / total) * 100) : 0,
      },
      {
        count: stats.three_star || 0,
        percentage:
          total > 0 ? Math.round((stats.three_star / total) * 100) : 0,
      },
      {
        count: stats.two_star || 0,
        percentage: total > 0 ? Math.round((stats.two_star / total) * 100) : 0,
      },
      {
        count: stats.one_star || 0,
        percentage: total > 0 ? Math.round((stats.one_star / total) * 100) : 0,
      },
    ];

    return {
      average: parseFloat(average) || 0,
      totalReviews: total,
      stars: stars,
    };
  };

  const handleBookAppointment = () => {
    navigation.navigate("AppointmentBookingPage", {
      clinicId,
      clinicName: clinic?.data?.institute_name,
    });
  };

  const handleCallClinic = () => {
    if (clinic?.mobileno) {
      Linking.openURL(`tel:${clinic.mobileno}`);
    }
  };

  const handleEmailClinic = () => {
    if (clinic?.institute_email) {
      Linking.openURL(`mailto:${clinic.institute_email}`);
    }
  };

  // Render star rating component
  const renderStars = (rating) => {
    return (
      <View className="flex-row gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Feather
            key={star}
            name="star"
            size={16}
            color={star <= rating ? "#fbbf24" : "#e5e7eb"}
            fill={star <= rating ? "#fbbf24" : "none"}
          />
        ))}
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="text-slate-600 mt-4 text-lg">
            Loading clinic details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!clinic) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center p-4">
          <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 items-center max-w-md">
            <View className="bg-slate-100 rounded-2xl p-6 mb-6">
              <Feather name="home" size={64} color="#9ca3af" />
            </View>
            <Text className="text-xl font-bold text-slate-700 mb-2">
              Clinic not found
            </Text>
            <Text className="text-slate-500 text-lg text-center">
              The requested clinic could not be found.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Hero Section with Gradient */}
        <View className="bg-gradient-to-b from-cyan-500 to-cyan-600 pt-8 pb-8 px-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <View className="items-center">
            {/* Clinic Logo/Image */}
            <View className=" rounded-2xl bg-white/20 items-center justify-center mb-4 border-2 border-white/30">
              <Feather name="home" size={40} color="cyan" />
            </View>

            {/* Clinic Name */}
            <Text className="text-3xl font-bold text-cyan-900 text-center mb-2">
              {clinic.data.institute_name}
            </Text>

            {/* Specialty */}
            <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-full mb-4">
              <Feather name="activity" size={16} color="#ffffff" />
              <Text className="text-cyan-700 font-semibold ml-2 text-sm">
                Specialty:{" "}
                {getSpecialties(clinic.data.specialties) || "General Practice"}
              </Text>
            </View>

            {/* Rating - NOW WITH REAL DATA */}
            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Feather
                    key={star}
                    name="star"
                    size={16}
                    color="#fbbf24"
                    fill={
                      star <= Math.floor(ratingStats.average)
                        ? "#fbbf24"
                        : "none"
                    }
                  />
                ))}
              </View>
              <Text className="text-white font-semibold">
                {ratingStats.average > 0 ? ratingStats.average : "No"}
                {ratingStats.average > 0 ? " Stars" : " Reviews Yet"}
                {ratingStats.totalReviews > 0 &&
                  ` (${ratingStats.totalReviews}+ reviews)`}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 -mt-6">
          <View className="bg-white rounded-2xl p-4 shadow-lg shadow-black/10 border border-slate-100">
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="items-center flex-1"
                activeOpacity={0.7}
                onPress={handleBookAppointment}
              >
                <View className="w-12 h-12 rounded-xl bg-cyan-50 items-center justify-center mb-2">
                  <Feather name="calendar" size={20} color="#0891b2" />
                </View>
                <Text className="text-slate-700 font-medium text-xs text-center">
                  Book Appointment
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center flex-1"
                activeOpacity={0.7}
                onPress={handleCallClinic}
              >
                <View className="w-12 h-12 rounded-xl bg-green-50 items-center justify-center mb-2">
                  <Feather name="phone" size={20} color="#059669" />
                </View>
                <Text className="text-slate-700 font-medium text-xs text-center">
                  Call Now
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center flex-1"
                activeOpacity={0.7}
                onPress={handleEmailClinic}
              >
                <View className="w-12 h-12 rounded-xl bg-blue-50 items-center justify-center mb-2">
                  <Feather name="mail" size={20} color="#2563eb" />
                </View>
                <Text className="text-slate-700 font-medium text-xs text-center">
                  Send Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center flex-1"
                activeOpacity={0.7}
              >
                <View className="w-12 h-12 rounded-xl bg-purple-50 items-center justify-center mb-2">
                  <Feather name="map-pin" size={20} color="#9333ea" />
                </View>
                <Text className="text-slate-700 font-medium text-xs text-center">
                  Get Directions
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Information Sections */}
        <View className="p-6 gap-6">
          {/* Operating Hours */}
          <View className="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-slate-100">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 rounded-xl bg-cyan-50 items-center justify-center">
                <Feather name="clock" size={20} color="#0891b2" />
              </View>
              <Text className="text-xl font-bold text-slate-800">
                Operating Hours
              </Text>
            </View>

            <View className="gap-3">
              {clinic.data.working_hours ? (
                <Text className="text-slate-600">
                  {clinic.data.working_hours}
                </Text>
              ) : (
                <>
                  <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
                    <Text className="font-semibold text-slate-700">
                      Mon-Fri
                    </Text>
                    <Text className="text-slate-600">9:00 AM - 6:00 PM</Text>
                  </View>
                  <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
                    <Text className="font-semibold text-slate-700">
                      Saturday
                    </Text>
                    <Text className="text-slate-600">9:00 AM - 1:00 PM</Text>
                  </View>
                  <View className="flex-row justify-between items-center py-3">
                    <Text className="font-semibold text-slate-700">Sunday</Text>
                    <Text className="text-slate-600">Closed</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Address */}
          <View className="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-slate-100">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center">
                <Feather name="map-pin" size={20} color="#ea580c" />
              </View>
              <Text className="text-xl font-bold text-slate-800">Address</Text>
            </View>

            <Text className="text-slate-700 leading-6 text-base">
              {clinic.data.address ||
                "123 Health Ave, Suite 456, Anytown, CA 91234"}
            </Text>
          </View>

          {/* Contact & Social Media - Grouped */}
          <View className="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-slate-100">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center">
                <Feather name="phone" size={20} color="#2563eb" />
              </View>
              <Text className="text-xl font-bold text-slate-800">Contact</Text>
            </View>

            {/* Contact Information */}
            <View className="gap-4 mb-6">
              <View className="flex-row items-center gap-3">
                <Feather name="phone" size={18} color="#64748b" />
                <Text className="text-slate-700 text-base">
                  {clinic.data.mobileno || "(555) 123-4567"}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Feather name="mail" size={18} color="#64748b" />
                <Text className="text-slate-700 text-base">
                  {clinic.data.institute_email || "info@medicare.com"}
                </Text>
              </View>
            </View>

            {/* Social Media Links */}
            {(clinic.data.facebook_url ||
              clinic.data.twitter_url ||
              clinic.data.linkedin_url ||
              clinic.data.youtube_url) && (
              <View className="border-t border-slate-100 pt-4">
                <View className="flex-row items-center gap-2 mb-3">
                  <Feather name="share-2" size={16} color="#64748b" />
                  <Text className="text-slate-700 font-medium">Follow Us</Text>
                </View>
                <View className="flex-row gap-3">
                  {clinic.data.facebook_url && (
                    <TouchableOpacity
                      className="w-10 h-10 rounded-lg bg-slate-50 items-center justify-center"
                      onPress={() => Linking.openURL(clinic.data.facebook_url)}
                    >
                      <Feather name="facebook" size={18} color="#64748b" />
                    </TouchableOpacity>
                  )}
                  {clinic.data.twitter_url && (
                    <TouchableOpacity
                      className="w-10 h-10 rounded-lg bg-slate-50 items-center justify-center"
                      onPress={() => Linking.openURL(clinic.data.twitter_url)}
                    >
                      <Feather name="twitter" size={18} color="#64748b" />
                    </TouchableOpacity>
                  )}
                  {clinic.data.linkedin_url && (
                    <TouchableOpacity
                      className="w-10 h-10 rounded-lg bg-slate-50 items-center justify-center"
                      onPress={() => Linking.openURL(clinic.data.linkedin_url)}
                    >
                      <Feather name="linkedin" size={18} color="#64748b" />
                    </TouchableOpacity>
                  )}
                  {clinic.data.youtube_url && (
                    <TouchableOpacity
                      className="w-10 h-10 rounded-lg bg-slate-50 items-center justify-center"
                      onPress={() => Linking.openURL(clinic.data.youtube_url)}
                    >
                      <Feather name="youtube" size={18} color="#64748b" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* Patient Reviews Summary - NOW WITH REAL DATA */}
          <View className="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-slate-100">
            <View className="flex-row items-center gap-3 mb-6">
              <View className="w-10 h-10 rounded-xl bg-amber-50 items-center justify-center">
                <Feather name="star" size={20} color="#d97706" />
              </View>
              <Text className="text-xl font-bold text-slate-800">
                Patient Reviews
              </Text>
            </View>

            {reviewsLoading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="small" color="#0891b2" />
                <Text className="text-slate-500 mt-2">Loading reviews...</Text>
              </View>
            ) : ratingStats.totalReviews === 0 ? (
              <View className="items-center py-8">
                <Feather name="message-circle" size={48} color="#e5e7eb" />
                <Text className="text-slate-500 text-lg font-medium mt-4">
                  No Reviews Yet
                </Text>
                <Text className="text-slate-400 text-center mt-2">
                  Be the first to review this clinic!
                </Text>
              </View>
            ) : (
              <>
                <View className="flex-row justify-between items-center mb-6">
                  <View>
                    <Text className="text-3xl font-bold text-slate-800 mb-1">
                      {ratingStats.average}
                    </Text>
                    <Text className="text-slate-600">
                      {ratingStats.totalReviews}+ reviews
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Feather
                        key={star}
                        name="star"
                        size={20}
                        color="#fbbf24"
                        fill={
                          star <= Math.floor(ratingStats.average)
                            ? "#fbbf24"
                            : "none"
                        }
                      />
                    ))}
                  </View>
                </View>

                {/* Star Distribution - REAL DATA */}
                <View className="gap-2 mb-6">
                  {[5, 4, 3, 2, 1].map((stars, index) => (
                    <View key={stars} className="flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1 w-8">
                        <Text className="text-slate-600 text-sm font-medium">
                          {stars}
                        </Text>
                        <Feather name="star" size={12} color="#fbbf24" />
                      </View>
                      <View className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-amber-400 rounded-full"
                          style={{
                            width: `${ratingStats.stars[index].percentage}%`,
                          }}
                        />
                      </View>
                      <Text className="text-slate-600 text-sm w-10">
                        ({ratingStats.stars[index].count})
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate("Reviews", { clinicId })}
              className="flex-row items-center justify-center gap-2 py-3 border border-slate-300 rounded-xl"
            >
              <Text className="text-slate-700 font-semibold">
                {ratingStats.totalReviews > 0
                  ? "Read All Reviews"
                  : "Write First Review"}
              </Text>
              <Feather name="chevron-right" size={16} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Book Appointment CTA */}
          <TouchableOpacity
            onPress={handleBookAppointment}
            className="flex-row items-center justify-center gap-3 py-4 rounded-2xl shadow-lg bg-cyan-500"
            activeOpacity={0.8}
          >
            <Feather name="calendar" size={24} color="#ffffff" />
            <Text className="text-white font-semibold text-lg">
              Book Appointment
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClinicProfile;
