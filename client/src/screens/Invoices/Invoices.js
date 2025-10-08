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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../components/Header";

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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      partial: { bg: "bg-blue-100", text: "text-blue-800" },
      overdue: { bg: "bg-red-100", text: "text-red-800" },
    };
    return statusMap[status] || { bg: "bg-slate-100", text: "text-slate-800" };
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      paid: "check-circle",
      unpaid: "clock",
      partial: "dollar-sign",
      overdue: "alert-circle",
    };
    return iconMap[status] || "file-text";
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

  // Stats data
  const stats = [
    {
      title: "Total Invoices",
      value: invoices.length,
      icon: "file-text",
      color: "bg-slate-50",
      iconBg: "bg-slate-200",
      iconColor: "#475569",
      textColor: "text-slate-700",
    },
    {
      title: "Total Amount",
      value: `₱${totalAmount.toLocaleString()}`,
      icon: "dollar-sign",
      color: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "#0891b2",
      textColor: "text-cyan-700",
    },
    {
      title: "Paid",
      value: paidInvoices.length,
      icon: "check-circle",
      color: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "#059669",
      textColor: "text-emerald-700",
    },
    {
      title: "Pending/Overdue",
      value: unpaidInvoices.length + overdueInvoices.length,
      icon: "alert-circle",
      color: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "#d97706",
      textColor: "text-amber-700",
    },
  ];

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
            <Text className="text-3xl font-bold text-slate-800">
              My Invoices
            </Text>
            <Text className="text-slate-600 mt-3 text-lg">
              View and manage your medical invoices and billing information.
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
                      className={`${stat.color} border border-white/20 rounded-2xl p-6 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-3 opacity-80`}
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
                            size={24}
                            color={stat.iconColor}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Second Row - 2 stats */}
              <View className="flex-row gap-4">
                {stats.slice(2, 4).map((stat, index) => (
                  <View key={index + 2} className="flex-1">
                    <View
                      className={`${stat.color} border border-white/20 rounded-2xl p-6 shadow-lg`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 min-w-0">
                          <Text
                            className={`${stat.textColor} text-sm font-semibold uppercase tracking-wider mb-3 opacity-80`}
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
                            size={24}
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
              All Invoices
            </Text>
            <Text className="text-slate-600 text-lg mb-4">
              {filteredInvoices.length} invoice
              {filteredInvoices.length !== 1 ? "s" : ""} found
            </Text>

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
          </View>

          {/* Invoices List */}
          {filteredInvoices.length > 0 ? (
            <View className="gap-4">
              {filteredInvoices.map((invoice, index) => {
                const statusStyle = getStatusBadge(invoice.status);
                return (
                  <View
                    key={index}
                    className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6"
                  >
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-1">
                        <Text className="font-bold text-slate-800 text-lg mb-2">
                          {invoice.clinicId.clinicName}
                        </Text>
                        <Text className="text-slate-600 text-base mb-3 font-medium">
                          Invoice #{invoice.invoiceNumber}
                        </Text>
                        <Text className="text-slate-600 text-sm mb-2">
                          Dr. {invoice.doctorId.name}
                        </Text>
                      </View>
                      <View className="ml-4">
                        <View
                          className={`flex-row items-center gap-2 px-3 py-1 rounded-full ${statusStyle.bg}`}
                        >
                          <Feather
                            name={getStatusIcon(invoice.status)}
                            size={16}
                            color={
                              statusStyle.text === "text-emerald-800"
                                ? "#065f46"
                                : statusStyle.text === "text-amber-800"
                                  ? "#92400e"
                                  : statusStyle.text === "text-red-800"
                                    ? "#991b1b"
                                    : "#1e293b"
                            }
                          />
                          <Text
                            className={`text-sm font-medium ${statusStyle.text}`}
                          >
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row gap-4 mb-4">
                      <View className="flex-1 bg-slate-50/80 rounded-xl p-3">
                        <Text className="text-slate-500 text-sm uppercase tracking-wide mb-1 font-semibold">
                          Amount
                        </Text>
                        <Text className="font-bold text-slate-700">
                          ₱{invoice.totalAmount.toFixed(2)}
                        </Text>
                      </View>
                      <View className="flex-1 bg-slate-50/80 rounded-xl p-3">
                        <Text className="text-slate-500 text-sm uppercase tracking-wide mb-1 font-semibold">
                          Due Date
                        </Text>
                        <Text className="font-bold text-slate-700">
                          {formatDate(invoice.dueDate)}
                        </Text>
                      </View>
                    </View>

                    <View className="pt-4 border-t border-slate-200/50">
                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="text-base text-slate-700 font-medium">
                            Services: {invoice.services.length} item(s)
                          </Text>
                          <Text className="text-sm text-slate-500">
                            Created: {formatDate(invoice.createdAt)}
                          </Text>
                        </View>
                        <View className="flex-row gap-2">
                          <TouchableOpacity
                            onPress={() => handleView(invoice)}
                            className="p-2 bg-slate-100 rounded-lg"
                            activeOpacity={0.7}
                          >
                            <Feather name="eye" size={20} color="#334155" />
                          </TouchableOpacity>
                          {invoice.status !== "paid" && (
                            <TouchableOpacity
                              onPress={() => handlePay(invoice)}
                              className="p-2 bg-cyan-100 rounded-lg"
                              activeOpacity={0.7}
                            >
                              <Feather
                                name="credit-card"
                                size={20}
                                color="#0891b2"
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="bg-white/80 rounded-2xl shadow-lg border border-white/20 p-12 items-center">
              <View className="bg-slate-100 rounded-2xl p-6 mb-6">
                <Feather name="file-text" size={64} color="#9ca3af" />
              </View>
              <Text className="text-xl font-bold text-slate-700 mb-2">
                No invoices found
              </Text>
              <Text className="text-slate-500 text-lg text-center">
                Your invoices will appear here once available.
              </Text>
            </View>
          )}
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
          <View className="bg-white rounded-t-3xl max-h-[80%]">
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
                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Invoice Number
                    </Text>
                    <Text className="text-lg font-bold text-slate-800">
                      {selectedInvoice.invoiceNumber}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Clinic
                    </Text>
                    <Text className="text-lg font-semibold text-slate-700">
                      {selectedInvoice.clinicId.clinicName}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Doctor
                    </Text>
                    <Text className="text-lg font-semibold text-slate-700">
                      Dr. {selectedInvoice.doctorId.name}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Services
                    </Text>
                    {selectedInvoice.services.map((service, idx) => (
                      <Text key={idx} className="text-base text-slate-700 mb-1">
                        • {service}
                      </Text>
                    ))}
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Total Amount
                    </Text>
                    <Text className="text-2xl font-bold text-slate-800">
                      ₱{selectedInvoice.totalAmount.toFixed(2)}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Status
                    </Text>
                    <View
                      className={`flex-row items-center gap-2 px-3 py-2 rounded-full self-start ${
                        getStatusBadge(selectedInvoice.status).bg
                      }`}
                    >
                      <Feather
                        name={getStatusIcon(selectedInvoice.status)}
                        size={16}
                        color="#065f46"
                      />
                      <Text
                        className={`text-sm font-medium ${
                          getStatusBadge(selectedInvoice.status).text
                        }`}
                      >
                        {selectedInvoice.status.charAt(0).toUpperCase() +
                          selectedInvoice.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => setIsViewModalVisible(false)}
                    className="px-6 py-4 bg-slate-100 rounded-xl border border-slate-200 mt-4"
                    activeOpacity={0.7}
                  >
                    <Text className="text-slate-700 font-semibold text-base text-center">
                      Close
                    </Text>
                  </TouchableOpacity>
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
                <Text className="text-base text-slate-600">
                  Are you sure you want to pay this invoice?
                </Text>

                <View className="bg-slate-50 rounded-xl p-4">
                  <Text className="text-sm text-slate-500 mb-1">Amount</Text>
                  <Text className="text-2xl font-bold text-slate-800">
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
