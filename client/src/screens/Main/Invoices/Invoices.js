import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";

// Mock invoices data
const mockInvoices = [
  {
    _id: "1",
    invoiceNumber: "INV-2024-001",
    clinicId: { clinicName: "Kinika Medical Center" },
    doctorId: { name: "Dr. Sarah Johnson" },
    totalAmount: 2500.0,
    dueDate: "2024-02-15T00:00:00",
    status: "paid",
    services: ["Consultation", "Laboratory Tests"],
    createdAt: "2024-01-15T10:00:00",
  },
  {
    _id: "2",
    invoiceNumber: "INV-2024-002",
    clinicId: { clinicName: "Kinika Medical Center" },
    doctorId: { name: "Dr. Mike Chen" },
    totalAmount: 1800.0,
    dueDate: "2024-02-20T00:00:00",
    status: "unpaid",
    services: ["Consultation", "Prescription"],
    createdAt: "2024-01-20T14:00:00",
  },
  {
    _id: "3",
    invoiceNumber: "INV-2024-003",
    clinicId: { clinicName: "Kinika Medical Center" },
    doctorId: { name: "Dr. Emily Rodriguez" },
    totalAmount: 3200.0,
    dueDate: "2024-01-10T00:00:00",
    status: "overdue",
    services: ["Consultation", "X-Ray", "Medication"],
    createdAt: "2023-12-28T09:00:00",
  },
];

const Invoices = ({ navigation }) => {
  const [invoices] = useState(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const searchTermLower = searchTerm.toLowerCase();
    const clinicName = invoice.clinicId?.clinicName?.toLowerCase() || "";
    const invoiceNumber = invoice.invoiceNumber?.toLowerCase() || "";
    return (
      clinicName.includes(searchTermLower) ||
      invoiceNumber.includes(searchTermLower)
    );
  });

  // Calculate stats
  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + (invoice.totalAmount || 0),
    0
  );
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const unpaidInvoices = invoices.filter(
    (invoice) => invoice.status === "unpaid"
  );
  const overdueInvoices = invoices.filter(
    (invoice) => invoice.status === "overdue"
  );

  const getStatusBadge = (status) => {
    const statusMap = {
      paid: { bg: "bg-emerald-100", text: "text-emerald-800" },
      unpaid: { bg: "bg-amber-100", text: "text-amber-800" },
      overdue: { bg: "bg-red-100", text: "text-red-800" },
    };
    return statusMap[status] || { bg: "bg-slate-100", text: "text-slate-800" };
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalVisible(true);
  };

  const handlePay = (invoice) => {
    setSelectedInvoice(invoice);
    setIsPayModalVisible(true);
  };

  const handlePaymentConfirm = () => {
    setIsPayModalVisible(false);
    Alert.alert("Success", "Payment processed successfully!");
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 gap-8">
          {/* Welcome Section - Same as Dashboard */}
          <View>
            <View className="flex-row items-center gap-3">
              <View className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
                <Feather name="credit-card" size={24} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-semibold text-slate-800">
                  My Invoices
                </Text>
                <Text className="text-slate-600 mt-1">
                  View and manage your medical invoices and payments
                </Text>
              </View>
            </View>
          </View>

          {/* EXACT SAME STATS LAYOUT AS DASHBOARD */}
          <View>
            <View className="gap-4">
              {/* Total Invoices Card */}
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Total Invoices
                    </Text>
                    <Text className="text-4xl font-semibold text-cyan-600 mt-2">
                      {invoices.length}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <Feather name="trending-up" size={14} color="#059669" />
                      <Text className="text-sm text-emerald-600 ml-1 font-medium">
                        ₱{totalAmount.toLocaleString()} total amount
                      </Text>
                    </View>
                  </View>
                  <View className="bg-cyan-500 p-4 rounded-2xl shadow-md">
                    <Feather name="file-text" size={32} color="#ffffff" />
                  </View>
                </View>
              </View>

              {/* Payment Overview Card */}
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">
                      Payment Overview
                    </Text>
                    <View className="flex-row justify-between mb-3">
                      <View>
                        <Text className="text-2xl font-semibold text-slate-800">
                          {paidInvoices.length}
                        </Text>
                        <Text className="text-slate-600 text-xs">Paid</Text>
                      </View>
                      <View>
                        <Text className="text-2xl font-semibold text-slate-800">
                          {unpaidInvoices.length}
                        </Text>
                        <Text className="text-slate-600 text-xs">Unpaid</Text>
                      </View>
                      <View>
                        <Text className="text-2xl font-semibold text-slate-800">
                          {overdueInvoices.length}
                        </Text>
                        <Text className="text-slate-600 text-xs">Overdue</Text>
                      </View>
                    </View>
                  </View>
                  <View className="bg-emerald-500 p-4 rounded-2xl shadow-md">
                    <Feather name="dollar-sign" size={32} color="#ffffff" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View className="relative">
            <Feather
              name="search"
              size={20}
              color="#94a3b8"
              style={{ position: "absolute", left: 12, top: 14, zIndex: 1 }}
            />
            <TextInput
              placeholder="Search by clinic or invoice #..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="pl-10 h-12 rounded-xl border border-slate-200 bg-white/80"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Invoices List - Clean and Simple */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-semibold text-slate-800">
                All Invoices
              </Text>
              <Text className="text-slate-600 font-medium">
                {filteredInvoices.length} invoice
                {filteredInvoices.length !== 1 ? "s" : ""}
              </Text>
            </View>

            {filteredInvoices.length > 0 ? (
              <View className="gap-4">
                {filteredInvoices.map((invoice, index) => {
                  const statusStyle = getStatusBadge(invoice.status);
                  return (
                    <TouchableOpacity
                      key={invoice._id}
                      onPress={() => handleView(invoice)}
                      className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
                      activeOpacity={0.7}
                    >
                      {/* Clinic & Status Row */}
                      <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-1 mr-2">
                          <Text className="font-bold text-slate-800 text-lg mb-1">
                            {invoice.clinicId.clinicName}
                          </Text>
                          <Text className="text-cyan-600 font-semibold text-sm">
                            #{invoice.invoiceNumber}
                          </Text>
                        </View>
                        <View
                          className={`flex-row items-center gap-2 px-3 py-1 rounded-full ${statusStyle.bg}`}
                        >
                          <Feather
                            name={
                              invoice.status === "paid"
                                ? "check-circle"
                                : invoice.status === "unpaid"
                                  ? "clock"
                                  : "alert-circle"
                            }
                            size={14}
                            color={
                              statusStyle.text === "text-emerald-800"
                                ? "#065f46"
                                : statusStyle.text === "text-amber-800"
                                  ? "#92400e"
                                  : "#991b1b"
                            }
                          />
                          <Text
                            className={`text-xs font-medium ${statusStyle.text}`}
                          >
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </Text>
                        </View>
                      </View>

                      {/* Doctor & Amount */}
                      <View className="mb-3">
                        <Text className="text-slate-600 text-base mb-2">
                          Dr. {invoice.doctorId.name}
                        </Text>
                        <Text className="text-2xl font-bold text-slate-800">
                          ₱{invoice.totalAmount.toFixed(2)}
                        </Text>
                      </View>

                      {/* Due Date & Actions */}
                      <View className="flex-row items-center justify-between pt-4 border-t border-slate-100">
                        <View className="flex-row items-center">
                          <Feather name="calendar" size={14} color="#64748b" />
                          <Text className="text-slate-500 text-sm ml-2">
                            Due {formatDate(invoice.dueDate)}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Text className="text-cyan-600 font-semibold text-sm mr-2">
                            {invoice.status === "paid"
                              ? "View Details"
                              : "Pay Now"}
                          </Text>
                          <Feather
                            name="chevron-right"
                            size={16}
                            color="#0891b2"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 items-center">
                <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                  <Feather name="file-text" size={64} color="#9ca3af" />
                </View>
                <Text className="text-xl font-bold text-slate-700 mb-2">
                  No invoices found
                </Text>
                <Text className="text-slate-500 text-center">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Your invoices will appear here once available"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* View Invoice Modal */}
      <Modal
        visible={isViewModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsViewModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[85%]">
            <View className="flex-row items-center justify-between p-6 border-b border-slate-200">
              <Text className="text-xl font-bold text-slate-800">
                Invoice Details
              </Text>
              <TouchableOpacity
                onPress={() => setIsViewModalVisible(false)}
                activeOpacity={0.7}
              >
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
              {selectedInvoice && (
                <View className="gap-6">
                  {/* Invoice Number */}
                  <View className="bg-slate-50 rounded-2xl p-4">
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Invoice Number
                    </Text>
                    <Text className="text-lg font-bold text-slate-800">
                      {selectedInvoice.invoiceNumber}
                    </Text>
                  </View>

                  {/* Clinic */}
                  <View className="bg-slate-50 rounded-2xl p-4">
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Clinic
                    </Text>
                    <Text className="text-lg font-semibold text-slate-700">
                      {selectedInvoice.clinicId.clinicName}
                    </Text>
                  </View>

                  {/* Doctor */}
                  <View className="bg-slate-50 rounded-2xl p-4">
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Doctor
                    </Text>
                    <Text className="text-lg font-semibold text-slate-700">
                      Dr. {selectedInvoice.doctorId.name}
                    </Text>
                  </View>

                  {/* Services */}
                  <View className="bg-cyan-50 rounded-2xl p-4">
                    <Text className="text-sm font-semibold text-cyan-700 uppercase tracking-wider mb-2">
                      Services
                    </Text>
                    {selectedInvoice.services.map((service, idx) => (
                      <Text
                        key={idx}
                        className="text-base text-slate-700 mb-1 font-medium"
                      >
                        • {service}
                      </Text>
                    ))}
                  </View>

                  {/* Amount */}
                  <View className="bg-emerald-50 rounded-2xl p-4">
                    <Text className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                      Total Amount
                    </Text>
                    <Text className="text-2xl font-bold text-slate-800">
                      ₱{selectedInvoice.totalAmount.toFixed(2)}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="gap-3 pt-4">
                    {selectedInvoice.status !== "paid" && (
                      <TouchableOpacity
                        onPress={() => {
                          setIsViewModalVisible(false);
                          handlePay(selectedInvoice);
                        }}
                        className="flex-row items-center justify-center px-6 py-4 bg-cyan-500 rounded-xl shadow-lg"
                        activeOpacity={0.8}
                      >
                        <Feather name="credit-card" size={20} color="#ffffff" />
                        <Text className="text-white font-semibold ml-2 text-base">
                          Pay Now
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => setIsViewModalVisible(false)}
                      className="flex-row items-center justify-center px-6 py-4 bg-slate-100 rounded-xl border border-slate-200"
                      activeOpacity={0.7}
                    >
                      <Text className="text-slate-700 font-semibold text-base">
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={isPayModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPayModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-slate-800">
                Payment Confirmation
              </Text>
              <TouchableOpacity
                onPress={() => setIsPayModalVisible(false)}
                activeOpacity={0.7}
              >
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {selectedInvoice && (
              <View className="gap-6">
                <Text className="text-base text-slate-600 text-center">
                  Confirm payment for this invoice?
                </Text>

                <View className="bg-slate-50 rounded-xl p-4">
                  <Text className="text-sm text-slate-500 mb-1 text-center">
                    Amount to Pay
                  </Text>
                  <Text className="text-3xl font-bold text-slate-800 text-center">
                    ₱{selectedInvoice.totalAmount.toFixed(2)}
                  </Text>
                </View>

                <View className="gap-3">
                  <TouchableOpacity
                    onPress={handlePaymentConfirm}
                    className="px-6 py-4 bg-cyan-500 rounded-xl shadow-lg"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-semibold text-base text-center">
                      Confirm Payment
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setIsPayModalVisible(false)}
                    className="px-6 py-4 bg-slate-100 rounded-xl border border-slate-200"
                    activeOpacity={0.7}
                  >
                    <Text className="text-slate-700 font-semibold text-base text-center">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Invoices;
