// Simple utility to generate time slots without API calls
export const generateSlot = {
  // Generate available dates (next 7 weekdays)
  generateAvailableDates: () => {
    const dates = [];
    const baseDate = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);

      // Only weekdays (Monday to Friday)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date.toISOString().split("T")[0],
          formattedDate: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          fullFormattedDate: date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          dayOfWeek: date.toLocaleDateString("en-US", { weekday: "long" }),
        });
      }
    }

    return dates;
  },

  // Generate time slots for a specific date
  generateTimeSlots: (date) => {
    // Standard business hours: 9 AM to 5 PM
    const timeSlots = [];

    for (let hour = 9; hour <= 17; hour++) {
      // Skip lunch hour (12 PM to 1 PM)
      if (hour === 12) continue;

      // Add :00 slot
      timeSlots.push({
        time: `${hour.toString().padStart(2, "0")}:00:00`,
        formattedTime: `${hour === 12 ? 12 : hour % 12}:00 ${hour >= 12 ? "PM" : "AM"}`,
        available: true,
      });

      // Add :30 slot (except for 5 PM)
      if (hour < 17) {
        timeSlots.push({
          time: `${hour.toString().padStart(2, "0")}:30:00`,
          formattedTime: `${hour === 12 ? 12 : hour % 12}:30 ${hour >= 12 ? "PM" : "AM"}`,
          available: true,
        });
      }
    }

    return timeSlots;
  },

  // Check if a specific slot is available
  isSlotAvailable: (doctorId, date, time) => {
    // For simplicity, we'll assume all slots are available
    // In a real app, you might check against some local storage
    return true;
  },

  // Get all available slots for a doctor on a date
  getAvailableSlots: (doctorId, date) => {
    const slots = generateSlot.generateTimeSlots(date);

    // Here you could add logic to mark some slots as unavailable
    // For example, based on doctor's existing appointments in local storage

    return slots;
  },
};

export default generateSlot;
