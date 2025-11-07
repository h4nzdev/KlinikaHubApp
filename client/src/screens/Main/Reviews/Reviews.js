"use client";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import reviewServices from "../../../services/reviewServices";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Reviews = () => {
  const route = useRoute();
  const { clinicId } = route.params;
  const { user } = useContext(AuthenticationContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // State for real data
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({
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

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  console.log("Clinic ID:", clinicId);

  // Open modal with animation
  const openModal = () => {
    setIsModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close modal with animation
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false);
      // Reset form when closing
      setSelectedRating(0);
      setReviewText("");
    });
  };

  // Add this temporary function to test the stats API
  const testStatsAPI = async () => {
    try {
      console.log("🧪 Testing stats API directly...");
      const stats = await reviewServices.getClinicRatingStats(clinicId);
      console.log("🧪 DIRECT STATS API RESPONSE:", stats);

      // Also test reviews API
      const reviewsData =
        await reviewServices.getReviewsByClinicIdWithDetails(clinicId);
      console.log("🧪 DIRECT REVIEWS API RESPONSE count:", reviewsData?.length);
    } catch (error) {
      console.error("🧪 API TEST ERROR:", error);
    }
  };

  // Call this in your useEffect or add a debug button
  useEffect(() => {
    loadReviewsData();
    testStatsAPI(); // Add this temporary line
  }, [clinicId]);

  // Load reviews and stats
  const loadReviewsData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading reviews data for clinic:", clinicId);

      // Load reviews with details
      const reviewsData =
        await reviewServices.getReviewsByClinicIdWithDetails(clinicId);
      console.log("✅ Reviews loaded:", reviewsData?.length || 0);
      console.log("📝 Reviews data:", reviewsData);

      setReviews(reviewsData || []);

      // Always calculate stats from the reviews data we just fetched
      const calculatedStats = calculateStatsFromReviews(reviewsData || []);
      console.log("📊 Calculated stats from reviews:", calculatedStats);

      setRatingStats(calculatedStats);
    } catch (error) {
      console.error("❌ Error loading reviews data:", error);
      Alert.alert("Error", "Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Transform backend stats to frontend format
  const transformRatingStats = (stats) => {
    console.log("🔍 RAW STATS FROM BACKEND:", JSON.stringify(stats, null, 2));
    console.log("🔍 CURRENT REVIEWS COUNT:", reviews.length);

    // If backend returns empty stats, calculate from reviews
    if (!stats || (!stats.total_reviews && reviews.length > 0)) {
      console.log("🔄 Calculating stats from reviews array...");
      return calculateStatsFromReviews(reviews);
    }

    const total = stats.total_reviews || 0;
    const average = parseFloat(stats.average_rating || 0).toFixed(1);

    console.log("📊 Parsed stats - Total:", total, "Average:", average);

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

    console.log("⭐ Star distribution:", stars);

    return {
      average: parseFloat(average),
      totalReviews: total,
      stars: stars,
    };
  };

  // Fallback function to calculate stats from reviews
  const calculateStatsFromReviews = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return {
        average: 0,
        totalReviews: 0,
        stars: [
          { count: 0, percentage: 0 },
          { count: 0, percentage: 0 },
          { count: 0, percentage: 0 },
          { count: 0, percentage: 0 },
          { count: 0, percentage: 0 },
        ],
      };
    }

    const total = reviews.length;
    const average = (
      reviews.reduce((sum, review) => sum + review.rating, 0) / total
    ).toFixed(1);

    const starCounts = [0, 0, 0, 0, 0]; // 5,4,3,2,1 stars
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        starCounts[5 - review.rating]++; // 5-star is index 0, 1-star is index 4
      }
    });

    const stars = starCounts.map((count, index) => ({
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

    console.log("🔍 Calculated stats from reviews:", { average, total, stars });

    return {
      average: parseFloat(average),
      totalReviews: total,
      stars: stars,
    };
  };

  // Handle send reviews function
  const handleSendReviews = async () => {
    if (selectedRating === 0) {
      Alert.alert("Please select a rating");
      return;
    }
    if (reviewText.trim() === "") {
      Alert.alert("Please enter a review");
      return;
    }

    try {
      setSubmitting(true);
      console.log("🔄 Submitting review...");

      const reviewData = {
        clinic_id: parseInt(clinicId),
        patient_id: user.id,
        rating: selectedRating,
        comment: reviewText.trim(),
        is_verified: true,
        status: 2,
      };

      const result = await reviewServices.createReview(reviewData);
      console.log("✅ Review submitted:", result);

      // Force reload both reviews and stats with a small delay
      setTimeout(() => {
        loadReviewsData();
      }, 1000);

      // Show success message
      Alert.alert(
        "Review Submitted!",
        "Thank you for your feedback. Your review has been submitted successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              closeModal();
            },
          },
        ]
      );
    } catch (error) {
      console.error("❌ Review submission error:", error);
      Alert.alert(
        "Submission Failed",
        "There was an error submitting your review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle mark as helpful
  const handleMarkHelpful = async (reviewId) => {
    try {
      console.log("🔄 Marking review as helpful:", reviewId);
      await reviewServices.markReviewAsHelpful(reviewId);

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, helpful_count: (review.helpful_count || 0) + 1 }
            : review
        )
      );

      Alert.alert("Success", "Thank you for your feedback!");
    } catch (error) {
      console.error("❌ Mark helpful error:", error);
      Alert.alert("Error", "Failed to mark as helpful. Please try again.");
    }
  };

  // Handle pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadReviewsData();
  };

  // Load data on component mount
  useEffect(() => {
    loadReviewsData();
  }, [clinicId]);

  // Render star rating
  const renderStars = (rating) => {
    return (
      <View className="flex-row gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Feather
            key={star}
            name="star"
            size={16}
            color={star <= rating ? "#f59e0b" : "#e5e7eb"}
            fill={star <= rating ? "#f59e0b" : "none"}
          />
        ))}
      </View>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0891b2" />
        <Text className="text-gray-600 mt-4">Loading reviews...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Fixed Write Review Button */}
      <View
        className="absolute bottom-6 left-6 right-6 z-10"
        style={{ paddingBottom: insets.bottom }}
      >
        <TouchableOpacity
          onPress={openModal}
          className="bg-cyan-600 rounded-2xl py-4 flex-row items-center justify-center gap-3 shadow-lg"
        >
          <Feather name="edit-3" size={20} color="white" />
          <Text className="text-white font-bold text-lg">Write a Review</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Back Button */}
        <View className="flex-row items-center px-6 pt-6 pb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Feather name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-gray-800 font-bold text-xl ml-3">
            Patient Reviews
          </Text>
        </View>

        {/* Rating Overview Card */}
        <View className="bg-white mx-6 mt-2 rounded-2xl p-6 mb-6 border border-gray-200">
          <View className="flex-row items-center gap-4 mb-6">
            <View className="w-14 h-14 rounded-xl bg-cyan-100 items-center justify-center">
              <Feather name="star" size={26} color="#0891b2" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">
                Patient Reviews
              </Text>
              <Text className="text-gray-500 text-sm">
                {ratingStats.totalReviews}+ verified reviews
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-6">
            {/* Average Rating */}
            <View className="items-center">
              <Text className="text-4xl font-bold text-gray-800 mb-2">
                {ratingStats.average}
              </Text>
              <View className="flex-row gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Feather
                    key={star}
                    name="star"
                    size={16}
                    color="#f59e0b"
                    fill="#f59e0b"
                  />
                ))}
              </View>
            </View>

            {/* Star Distribution */}
            <View className="flex-1 gap-2">
              {[5, 4, 3, 2, 1].map((stars, index) => (
                <View key={stars} className="flex-row items-center gap-3">
                  <Text className="text-gray-600 text-sm font-medium w-4 text-center">
                    {stars}
                  </Text>
                  <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-cyan-500 rounded-full"
                      style={{
                        width: `${ratingStats.stars[index].percentage}%`,
                      }}
                    />
                  </View>
                  <Text className="text-gray-500 text-xs w-8">
                    {ratingStats.stars[index].count}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Reviews List */}
        <View className="px-6 gap-4 mb-6">
          {reviews.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center justify-center border border-gray-200">
              <Feather name="message-circle" size={48} color="#d1d5db" />
              <Text className="text-gray-600 text-lg font-medium mt-4">
                No Reviews Yet
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Be the first to share your experience with this clinic!
              </Text>
            </View>
          ) : (
            reviews.map((review) => (
              <View
                key={review.id}
                className="bg-white rounded-2xl p-5 border border-gray-200"
              >
                {/* Review Header */}
                <View className="flex-row items-start gap-4 mb-4">
                  {/* Profile Picture */}
                  <View>
                    {review.patient_photo ? (
                      <Image
                        source={{ uri: review.patient_photo }}
                        className="w-12 h-12 rounded-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center border border-gray-300">
                        <Feather name="user" size={20} color="#6b7280" />
                      </View>
                    )}
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-2">
                      <Text className="text-gray-800 font-semibold text-base flex-1">
                        {review.patient_name || "Anonymous Patient"}
                      </Text>
                      {review.is_verified && (
                        <View className="flex-row items-center gap-1 bg-cyan-50 px-2 py-1 rounded-full">
                          <Feather
                            name="check-circle"
                            size={12}
                            color="#0891b2"
                          />
                          <Text className="text-cyan-700 text-xs font-medium">
                            Verified
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Rating and Date */}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        {renderStars(review.rating)}
                      </View>
                      <Text className="text-gray-500 text-xs">
                        {formatDate(review.created_at)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Review Text */}
                <Text className="text-gray-700 leading-6 text-sm mb-4">
                  {review.comment}
                </Text>

                {/* Helpful Actions */}
                <View className="flex-row gap-4 pt-3 border-t border-gray-100">
                  <TouchableOpacity
                    className="flex-row items-center gap-2"
                    onPress={() => handleMarkHelpful(review.id)}
                  >
                    <Feather name="thumbs-up" size={16} color="#6b7280" />
                    <Text className="text-gray-600 text-xs">
                      Helpful{" "}
                      {review.helpful_count ? `(${review.helpful_count})` : ""}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        statusBarTranslucent={true}
      >
        <View className="flex-1 bg-black/50">
          {/* Backdrop */}
          <TouchableOpacity
            className="flex-1"
            onPress={closeModal}
            activeOpacity={1}
          />

          {/* Animated Modal Content */}
          <Animated.View
            className="bg-white rounded-t-3xl pt-5 px-6 pb-8"
            style={{
              transform: [{ translateY: slideAnim }],
              paddingBottom: insets.bottom || 20,
            }}
          >
            {/* Drag Handle */}
            <View className="items-center mb-4">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Write a Review
              </Text>
              <TouchableOpacity onPress={closeModal} className="p-2">
                <Feather name="x" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              {/* Star Rating Input */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-700 mb-4">
                  How was your experience?
                </Text>
                <View className="flex-row gap-3 justify-center bg-gray-50 rounded-2xl py-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setSelectedRating(star)}
                      className="p-2"
                      disabled={submitting}
                    >
                      <Feather
                        name="star"
                        size={36}
                        color={star <= selectedRating ? "#0891b2" : "#d1d5db"}
                        fill={star <= selectedRating ? "#0891b2" : "none"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Review Text Input */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-700 mb-3">
                  Share your experience
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-800 min-h-32 text-base leading-6"
                  placeholder="Tell others about your experience with this clinic... What did you like? What could be improved?"
                  placeholderTextColor="#9ca3af"
                  multiline
                  textAlignVertical="top"
                  value={reviewText}
                  onChangeText={setReviewText}
                  editable={!submitting}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSendReviews}
                disabled={submitting}
                className={`rounded-2xl py-4 flex-row items-center justify-center gap-3 ${
                  submitting ? "bg-cyan-400" : "bg-cyan-600"
                }`}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Feather name="send" size={20} color="white" />
                )}
                <Text className="text-white font-semibold text-lg">
                  {submitting ? "Submitting..." : "Submit Review"}
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Reviews;
