import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import appointmentServices from "../services/appointmentsServices";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthenticationContext);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching appointments with details...");

      // USE THE NEW METHOD WITH DETAILS!
      const data =
        await appointmentServices.getAppointmentsByPatientIdWithDetails(
          user.id
        );
      console.log("✅ Appointments with details fetched:", data);
      setAppointments(data || []);
    } catch (error) {
      console.error("❌ Error fetching appointments with details:", error);
      setError(error.message);

      // Fallback to regular method if details fail
      try {
        console.log("🔄 Trying regular appointments fetch as fallback...");
        const fallbackData =
          await appointmentServices.getAppointmentsByPatientId(user.id);
        setAppointments(fallbackData || []);
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
        setAppointments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchAppointments();
  };

  useEffect(() => {
    if (user && user.id) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    appointments,
    loading,
    error,
    refetch,
  };
};
