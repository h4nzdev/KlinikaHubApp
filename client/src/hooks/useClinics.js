import { useState, useEffect } from "react";
import clinicServices from "../services/clinicServices";

export const useClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter clinics based on search query
  const filterClinicsBySearch = (query, clinicsData) => {
    if (!query.trim()) return clinicsData;

    const lowercaseQuery = query.toLowerCase().trim();

    return clinicsData.filter((clinic) => {
      const searchableFields = [
        clinic.institute_name,
        clinic.primary_category,
        clinic.address,
        clinic.mobileno,
        clinic.working_hours,
      ].filter(Boolean); // Remove null/undefined values

      return searchableFields.some((field) =>
        field.toLowerCase().includes(lowercaseQuery)
      );
    });
  };

  const fetchClinics = async () => {
    try {
      setError(null);
      const data = await clinicServices.getAllClinics();

      // Normalize tenant fields to what the UI expects
      const normalized = data.map((clinic) => ({
        id: clinic.id,
        institute_name: clinic.clinic_name || clinic.institute_name || "",
        primary_category: clinic.clinic_type || clinic.primary_category || "",
        address: clinic.address || "",
        mobileno: clinic.contact_number || clinic.mobileno || "",
        working_hours: clinic.working_hours || "",
        raw: clinic, // keep original record if needed elsewhere
      }));

      setClinics(normalized);
      setFilteredClinics(normalized); // Initialize filtered clinics
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load clinics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchClinics();
  };

  // Update filtered clinics when search query or clinics change
  useEffect(() => {
    const filtered = filterClinicsBySearch(searchQuery, clinics);
    setFilteredClinics(filtered);
  }, [searchQuery, clinics]);

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  return {
    clinics: filteredClinics, // Return filtered clinics for display
    allClinics: clinics, // Keep original clinics for category filtering
    loading,
    error,
    refreshing,
    searchQuery,
    fetchClinics,
    onRefresh,
    updateSearchQuery,
    clearSearch,
  };
};
