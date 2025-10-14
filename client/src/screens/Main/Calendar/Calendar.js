"use client";

import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppointments } from "../../../hooks/useAppointments";
import Header from "../../../components/Header";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState("All");

  const { appointments: allAppointments, loading } = useAppointments();

  const clientAppointments = useMemo(() => {
    return allAppointments || [];
  }, [allAppointments]);

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const startingDay = useMemo(() => {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
  }, [currentDate]);

  const monthYear = useMemo(() => {
    return `${currentDate.toLocaleString("default", {
      month: "long",
    })}, ${currentDate.getFullYear()}`;
  }, [currentDate]);

  const appointmentsForDate = (date) => {
    return clientAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const selectedDateAppointments = useMemo(() => {
    return appointmentsForDate(selectedDate);
  }, [selectedDate, clientAppointments]);

  const pastAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = clientAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate <= today;
    });

    if (filter !== "All") {
      const statusMap = {
        Pending: 0,
        Confirmed: 1,
        Completed: 2,
        Cancelled: 3,
      };
      filtered = filtered.filter((app) => app.status === statusMap[filter]);
    }

    return filtered.sort(
      (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
    );
  }, [clientAppointments, filter]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 0:
        return { label: "Pending", color: "bg-yellow-100 text-yellow-700" };
      case 1:
        return { label: "Confirmed", color: "bg-blue-100 text-blue-700" };
      case 2:
        return { label: "Completed", color: "bg-green-100 text-green-700" };
      case 3:
        return { label: "Cancelled", color: "bg-red-100 text-red-700" };
      default:
        return { label: "Unknown", color: "bg-gray-100 text-gray-700" };
    }
  };

  const formatTime = (schedule) => {
    if (!schedule) return "Time not set";
    const date = new Date(schedule);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Header />
        <View className="px-5 pt-2 pb-6">
          <TouchableOpacity className="flex-row items-center gap-2">
            <Text className="text-2xl font-bold text-gray-900">
              {monthYear}
            </Text>
            <Feather name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View className="px-5 mb-3">
          <View className="flex-row">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
              (day, index) => (
                <View
                  key={index}
                  style={{ width: `${100 / 7}%` }}
                  className="items-center"
                >
                  <Text className="text-xs font-semibold text-gray-400">
                    {day}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        <View className="px-5">
          <View className="flex-row flex-wrap">
            {Array.from({ length: startingDay }).map((_, index) => (
              <View
                key={`empty-${index}`}
                style={{ width: `${100 / 7}%` }}
                className="aspect-square p-1"
              />
            ))}

            {daysInMonth.map((day, index) => {
              const dayAppointments = appointmentsForDate(day);
              const hasAppointments = dayAppointments.length > 0;
              const isToday = new Date().toDateString() === day.toDateString();
              const isSelected =
                selectedDate.toDateString() === day.toDateString();

              return (
                <TouchableOpacity
                  key={index}
                  style={{ width: `${100 / 7}%` }}
                  className="aspect-square p-1"
                  onPress={() => setSelectedDate(day)}
                >
                  <View
                    className={`flex-1 items-center justify-center rounded-2xl ${
                      isSelected
                        ? "bg-cyan-600"
                        : hasAppointments
                          ? "border-2 border-cyan-600"
                          : isToday
                            ? "bg-gray-100"
                            : ""
                    }`}
                  >
                    <Text
                      className={`text-base font-medium ${
                        isSelected
                          ? "text-white"
                          : hasAppointments
                            ? "text-cyan-600"
                            : "text-gray-900"
                      }`}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="px-5 pt-8 pb-4">
          <Text className="text-base font-medium text-gray-600">
            {selectedDate.getDate()}{" "}
            {selectedDate.toLocaleString("default", {
              month: "long",
            })}{" "}
            {selectedDate.getFullYear()}
          </Text>
        </View>

        {selectedDateAppointments.length > 0 && (
          <View className="px-5 pb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Appointments ({selectedDateAppointments.length})
            </Text>
            {selectedDateAppointments.map((appointment, index) => {
              const statusInfo = getStatusInfo(appointment.status);
              return (
                <View
                  key={appointment.id || index}
                  className="mb-3 bg-purple-50 rounded-2xl p-4 border border-purple-100"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-900">
                        {appointment.doctor_name || "Doctor"}
                      </Text>
                      {appointment.doctor_specialties && (
                        <Text className="text-sm text-purple-600 mt-1">
                          {appointment.doctor_specialties}
                        </Text>
                      )}
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full ${statusInfo.color}`}
                    >
                      <Text className="text-xs font-semibold">
                        {statusInfo.label}
                      </Text>
                    </View>
                  </View>

                  {appointment.doctor_qualification && (
                    <View className="flex-row items-center mb-2">
                      <Feather name="award" size={14} color="#7C3AED" />
                      <Text className="text-sm text-gray-600 ml-2">
                        {appointment.doctor_qualification}
                      </Text>
                    </View>
                  )}

                  {appointment.clinic_name && (
                    <View className="flex-row items-center mb-2">
                      <Feather name="map-pin" size={14} color="#7C3AED" />
                      <Text className="text-sm text-gray-600 ml-2">
                        {appointment.clinic_name}
                      </Text>
                    </View>
                  )}

                  <View className="flex-row items-center mb-2">
                    <Feather name="clock" size={14} color="#7C3AED" />
                    <Text className="text-sm text-gray-600 ml-2">
                      {formatTime(appointment.schedule)}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Feather name="dollar-sign" size={14} color="#7C3AED" />
                    <Text className="text-sm text-gray-600 ml-2">
                      Fee: {appointment.consultation_fees}
                      {appointment.discount > 0 &&
                        ` (Discount: ${appointment.discount})`}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Feather name="hash" size={14} color="#7C3AED" />
                    <Text className="text-sm text-gray-600 ml-2">
                      {appointment.appointment_id}
                    </Text>
                  </View>

                  {appointment.remarks && (
                    <View className="mt-2 pt-2 border-t border-purple-200">
                      <Text className="text-xs text-gray-500 font-semibold mb-1">
                        Remarks:
                      </Text>
                      <Text className="text-sm text-gray-700">
                        {appointment.remarks}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        <View className="px-5 pb-6 flex-row gap-3">
          <TouchableOpacity
            onPress={prevMonth}
            className="w-12 h-12 items-center justify-center border border-gray-200 rounded-xl"
          >
            <Feather name="chevron-left" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={nextMonth}
            className="w-12 h-12 items-center justify-center border border-gray-200 rounded-xl"
          >
            <Feather name="chevron-right" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View className="px-5 pb-6 border-t border-gray-200 pt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Appointment History ({pastAppointments.length})
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-2">
              {["All", "Completed", "Cancelled", "Pending", "Confirmed"].map(
                (filterOption) => (
                  <TouchableOpacity
                    key={filterOption}
                    onPress={() => setFilter(filterOption)}
                    className={`px-4 py-2 rounded-full ${filter === filterOption ? "bg-cyan-600" : "bg-gray-100"}`}
                  >
                    <Text
                      className={`text-sm font-semibold ${filter === filterOption ? "text-white" : "text-gray-600"}`}
                    >
                      {filterOption}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </ScrollView>

          {pastAppointments.length > 0 ? (
            <View className="gap-3">
              {pastAppointments.map((appointment, index) => {
                const statusInfo = getStatusInfo(appointment.status);
                return (
                  <View
                    key={appointment.id || index}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-200"
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900">
                          {appointment.doctor_name || "Doctor"}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {formatDate(appointment.appointment_date)} •{" "}
                          {formatTime(appointment.schedule)}
                        </Text>
                      </View>
                      <View
                        className={`px-2 py-1 rounded-full ${statusInfo.color}`}
                      >
                        <Text className="text-xs font-semibold">
                          {statusInfo.label}
                        </Text>
                      </View>
                    </View>

                    {appointment.clinic_name && (
                      <View className="flex-row items-center">
                        <Feather name="map-pin" size={12} color="#9CA3AF" />
                        <Text className="text-xs text-gray-600 ml-1">
                          {appointment.clinic_name}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="py-8 items-center">
              <Feather name="calendar" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 mt-3">
                No {filter !== "All" ? filter.toLowerCase() : ""} appointments
                found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
