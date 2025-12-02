import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const AppointmentsList = ({
  upcomingAppointments,
  navigation,
  showAllAppointments,
  setShowAllAppointments,
  showDropdown,
  getDoctorName,
  getSpecialty,
  formatDate,
  formatTime,
  getStatusBadge,
}) => {
  return (
    <View>
      <Text className="text-2xl font-semibold text-slate-800 mb-6">
        Upcoming Appointments
      </Text>

      {upcomingAppointments.length === 0 ? (
        <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 items-center">
          <View className="bg-slate-100 rounded-2xl p-6 mb-6">
            <Feather name="calendar" size={64} color="#9ca3af" />
          </View>
          <Text className="text-xl font-bold text-slate-700 mb-2">
            No upcoming appointments
          </Text>
          <Text className="text-slate-500 text-center mb-6">
            Schedule your next appointment to get started
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Clinics")}
            className="flex-row items-center px-6 py-3 bg-cyan-500 rounded-xl"
          >
            <Feather name="plus" size={18} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Schedule Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="gap-4">
          {upcomingAppointments
            .slice(0, showAllAppointments ? upcomingAppointments.length : 3)
            .map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showDropdown={showDropdown}
                getDoctorName={getDoctorName}
                getSpecialty={getSpecialty}
                formatDate={formatDate}
                formatTime={formatTime}
                getStatusBadge={getStatusBadge}
              />
            ))}

          {upcomingAppointments.length > 3 && (
            <TouchableOpacity
              onPress={() => setShowAllAppointments(!showAllAppointments)}
              className="bg-cyan-50 rounded-2xl border border-cyan-200 p-4 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-cyan-600 font-semibold">
                {showAllAppointments
                  ? "Show Less"
                  : `View All ${upcomingAppointments.length} Appointments`}
              </Text>
              <Text className="text-cyan-500 text-sm mt-1">
                {showAllAppointments
                  ? "Collapse appointment list"
                  : "See your complete appointment schedule"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const AppointmentCard = ({
  appointment,
  showDropdown,
  getDoctorName,
  getSpecialty,
  formatDate,
  formatTime,
  getStatusBadge,
}) => {
  return (
    <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 mr-2">
          <Text
            className="font-bold text-slate-800 text-lg mb-2"
            numberOfLines={1}
          >
            {getDoctorName(appointment)}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-slate-200 px-3 py-1 rounded-full">
              <Text className="text-slate-600 text-xs font-medium">
                {getSpecialty(appointment.doctor)}
              </Text>
            </View>
            <View className="bg-slate-100 px-3 py-1 rounded-full">
              <Text className="text-slate-700 text-xs font-medium capitalize">
                Consultation
              </Text>
            </View>
          </View>
        </View>

        <View className="items-end gap-2">
          {getStatusBadge(appointment.status)}
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            onPress={(event) => showDropdown(appointment, event)}
          >
            <Feather name="more-vertical" size={18} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <Feather name="calendar" size={16} color="#64748b" />
          <Text className="text-slate-600 ml-2 font-medium">
            {formatDate(appointment.appointment_date)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Feather name="clock" size={16} color="#64748b" />
          <Text className="text-slate-600 ml-2 font-medium">
            {formatTime(appointment.schedule)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AppointmentsList;
