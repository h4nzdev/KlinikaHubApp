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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import reviewServices from "../../../services/reviewServices";
import { AuthenticationContext } from "../../../context/AuthenticationContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Reviews = () => {
  const route = useRoute();
  const { clinicId } = route.params;
  const { user } = useContext(AuthenticationContext);
  const navigation = useNavigation();

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

  // Load reviews and stats
  const loadReviewsData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading reviews data for clinic:", clinicId);

      // Load reviews with details
      const reviewsData =
        await reviewServices.getReviewsByClinicIdWithDetails(clinicId);
      console.log("✅ Reviews loaded:", reviewsData?.length || 0);

      // Load rating stats
      const statsData = await reviewServices.getClinicRatingStats(clinicId);
      console.log("🔍 RAW STATS DATA FROM API:", statsData);

      setReviews(reviewsData || []);

      if (statsData) {
        // Transform backend stats to frontend format
        const transformedStats = transformRatingStats(statsData);
        console.log("🔍 TRANSFORMED STATS:", transformedStats);
        setRatingStats(transformedStats);
      }
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
    console.log("🔍 Transforming stats:", stats);

    // If backend returns empty stats, calculate from reviews
    if (!stats || (!stats.total_reviews && reviews.length > 0)) {
      return calculateStatsFromReviews(reviews);
    }

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

      // Force reload both reviews and stats
      await loadReviewsData();

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
            color={star <= rating ? "#fbbf24" : "#e5e7eb"}
            fill={star <= rating ? "#fbbf24" : "none"}
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
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0891b2" />
        <Text className="text-slate-600 mt-4">Loading reviews...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Fixed Write Review Button */}
      <View className="absolute bottom-6 left-6 right-6 z-10">
        <TouchableOpacity
          onPress={openModal}
          className="bg-cyan-600 rounded-2xl py-4 flex-row items-center justify-center gap-3 shadow-lg shadow-cyan-600/30"
        >
          <Feather name="edit-3" size={20} color="white" />
          <Text className="text-white font-bold text-lg">Write a Review</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Extra space for fixed button
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Back Button */}
        <View className="flex-row items-center px-6 pt-4 pb-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Feather name="arrow-left" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text className="text-slate-800 font-bold text-xl ml-2">
            Patient Reviews
          </Text>
        </View>

        {/* Header Section */}
        <View className="bg-cyan-500 mx-6 mt-2 rounded-2xl p-6 mb-4 shadow-lg shadow-cyan-500/20">
          <View className="flex-row items-center gap-4 mb-6">
            <View className="w-14 h-14 rounded-xl bg-cyan-400 items-center justify-center">
              <Feather name="star" size={26} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">
                Patient Reviews
              </Text>
              <Text className="text-cyan-100 text-base">
                {ratingStats.totalReviews}+ verified reviews
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-6">
            <View className="items-start">
              <Text className="text-5xl font-bold text-white mb-2">
                {ratingStats.average}
              </Text>
              <View className="flex-row gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Feather
                    key={star}
                    name="star"
                    size={18}
                    color="#fbbf24"
                    fill="#fbbf24"
                  />
                ))}
              </View>
            </View>

            {/* Star Distribution */}
            <View className="flex-1 gap-2">
              {[5, 4, 3, 2, 1].map((stars, index) => (
                <View key={stars} className="flex-row items-center gap-3">
                  <Text className="text-white text-sm font-semibold w-4 text-center">
                    {stars}
                  </Text>
                  <View className="flex-1 h-2 bg-cyan-400 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-white rounded-full"
                      style={{
                        width: `${ratingStats.stars[index].percentage}%`,
                      }}
                    />
                  </View>
                  <Text className="text-white text-xs w-8">
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
            <View className="bg-white rounded-2xl p-8 items-center justify-center">
              <Feather name="message-circle" size={48} color="#cbd5e1" />
              <Text className="text-slate-500 text-lg font-medium mt-4">
                No Reviews Yet
              </Text>
              <Text className="text-slate-400 text-center mt-2">
                Be the first to share your experience with this clinic!
              </Text>
            </View>
          ) : (
            reviews.map((review) => (
              <View
                key={review.id}
                className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 border border-slate-100"
              >
                {/* Review Header */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-slate-800 font-semibold text-base">
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
                    <Text className="text-slate-500 text-xs">
                      {formatDate(review.created_at)}
                    </Text>
                  </View>
                </View>

                {/* Rating Stars */}
                <View className="mb-3">{renderStars(review.rating)}</View>

                {/* Review Text */}
                <Text className="text-slate-700 leading-6 text-sm">
                  {review.comment}
                </Text>

                {/* Helpful Actions */}
                <View className="flex-row gap-4 mt-4 pt-4 border-t border-slate-100">
                  <TouchableOpacity
                    className="flex-row items-center gap-2"
                    onPress={() => handleMarkHelpful(review.id)}
                  >
                    <Feather name="thumbs-up" size={16} color="#64748b" />
                    <Text className="text-slate-600 text-xs">
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
            }}
          >
            {/* Drag Handle */}
            <View className="items-center mb-2">
              <View className="w-12 h-1 bg-slate-300 rounded-full" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-slate-800">
                Write a Review
              </Text>
              <TouchableOpacity onPress={closeModal} className="p-2">
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              {/* Star Rating Input */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-slate-700 mb-4">
                  How was your experience?
                </Text>
                <View className="flex-row gap-3 justify-center bg-cyan-50 rounded-2xl py-5">
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
                        color={star <= selectedRating ? "#0891b2" : "#cbd5e1"}
                        fill={star <= selectedRating ? "#0891b2" : "none"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Review Text Input */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-slate-700 mb-3">
                  Share your experience
                </Text>
                <TextInput
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 min-h-32 text-base leading-6"
                  placeholder="Tell others about your experience with this clinic... What did you like? What could be improved?"
                  placeholderTextColor="#94a3b8"
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
                className={`rounded-2xl py-4 flex-row items-center justify-center gap-3 shadow-sm ${
                  submitting ? "bg-cyan-400" : "bg-cyan-600 shadow-cyan-600/30"
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
