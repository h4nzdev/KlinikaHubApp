import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const ClinicCard = ({ clinic, onPress }) => {
  // Helper functions
  const getWorkingHours = () => {
    return clinic.working_hours?.trim() || "Mon-Sat: 8:00 AM - 5:00 PM";
  };

  const getPhoneNumber = () => {
    return clinic.contact_number || clinic.mobileno || "Not available";
  };

  const getClinicType = () => {
    if (clinic.clinic_type && clinic.clinic_type !== "general") {
      return (
        clinic.clinic_type.charAt(0).toUpperCase() + clinic.clinic_type.slice(1)
      );
    }
    return clinic.primary_category || "Healthcare Center";
  };

  const getStatusDisplay = () => {
    const status = clinic.status || "active";
    const statusConfig = {
      active: { color: "#10b981", text: "Open Now" },
      pending: { color: "#f59e0b", text: "Pending" },
      suspended: { color: "#ef4444", text: "Suspended" },
      cancelled: { color: "#6b7280", text: "Closed" },
    };
    return statusConfig[status] || statusConfig.active;
  };

  const statusConfig = getStatusDisplay();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 shadow-black/5 mb-4"
      activeOpacity={0.7}
    >
      <View className="flex-row gap-4">
        {/* RIGHT SIDE - INFORMATION ONLY (CLEAN VERSION) */}
        <View className="flex-1">
          {/* Header with Clinic Name and Status - FIXED OVERLAP */}
          <View className="flex-row justify-between items-start mb-2">
            <Text
              className="text-lg font-bold text-slate-800 flex-1 mr-3"
              numberOfLines={1}
            >
              {clinic.clinic_name || clinic.institute_name}
            </Text>
            {clinic.subscription_status &&
              clinic.subscription_status !== "trial" && (
                <View className="absolute right-24 bottom-1">
                  <View className="flex-row items-center gap-1 bg-white px-2 py-1 rounded-full border border-slate-200 shadow-sm">
                    <Feather
                      name={
                        clinic.subscription_status === "active"
                          ? "check-circle"
                          : "clock"
                      }
                      size={10}
                      color={
                        clinic.subscription_status === "active"
                          ? "#059669"
                          : "#f59e0b"
                      }
                    />
                    <Text className="font-semibold text-slate-700 text-xs">
                      {clinic.subscription_status.charAt(0).toUpperCase() +
                        clinic.subscription_status.slice(1)}
                    </Text>
                  </View>
                </View>
              )}
            <View
              className="flex-row items-center px-2 py-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: `${statusConfig.color}15` }}
            >
              <View
                className="w-1.5 h-1.5 rounded-full mr-1"
                style={{ backgroundColor: statusConfig.color }}
              />
              <Text
                className="font-semibold text-xs"
                style={{ color: statusConfig.color }}
                numberOfLines={1}
              >
                {statusConfig.text}
              </Text>
            </View>
          </View>

          {/* Clinic Type and Staff */}
          <View className="flex-row items-center gap-2 mb-3">
            <View className="flex-row items-center bg-cyan-50 px-2 py-1 rounded-full">
              <Feather name="activity" size={12} color="#0891b2" />
              <Text
                className="text-cyan-700 font-medium text-xs ml-1"
                numberOfLines={1}
              >
                {getClinicType()}
              </Text>
            </View>
            <View className="flex-row items-center bg-slate-50 px-2 py-1 rounded-full">
              <Feather name="users" size={12} color="#64748b" />
              <Text className="text-slate-600 text-xs ml-1">
                {clinic.staff_count || "1-5"} staff
              </Text>
            </View>
          </View>

          {/* Contact Information */}
          <View className="gap-1 mb-3">
            <View className="flex-row items-center gap-2">
              <Feather name="phone" size={14} color="#64748b" />
              <Text className="text-slate-600 text-sm">{getPhoneNumber()}</Text>
            </View>
            {clinic.email && (
              <View className="flex-row items-center gap-2">
                <Feather name="mail" size={14} color="#64748b" />
                <Text className="text-slate-600 text-sm" numberOfLines={1}>
                  {clinic.email}
                </Text>
              </View>
            )}
          </View>

          {/* Address */}
          <View className="mb-3">
            <Text className="text-slate-600 text-sm font-medium mb-1">
              Address
            </Text>
            <Text
              className="font-semibold text-slate-800 text-sm leading-4"
              numberOfLines={2}
            >
              {clinic.address || "Address not specified"}
            </Text>
          </View>

          {/* Operating Hours & CTA */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-slate-600 text-sm font-medium mb-1">
                Hours
              </Text>
              <Text className="font-semibold text-slate-800 text-xs">
                {getWorkingHours()}
              </Text>
            </View>

            {/* View Details Button */}
            <TouchableOpacity
              className="flex-row items-center bg-cyan-500 px-3 py-2 rounded-xl active:bg-cyan-600"
              onPress={onPress}
            >
              <Text className="text-white font-semibold text-xs mr-1">
                View
              </Text>
              <Feather name="arrow-right" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Rating Badge - MOVED to top right */}
      {clinic.rating && (
        <View className="absolute top-3 right-3 bg-amber-500 px-2 py-1 rounded-full border-2 border-white shadow-sm">
          <View className="flex-row items-center">
            <Feather name="star" size={10} color="#ffffff" fill="#ffffff" />
            <Text className="text-white font-bold text-xs ml-1">
              {clinic.rating}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ClinicCard;
