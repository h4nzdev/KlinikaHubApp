export const handleSaveReminder = (reminderData) => {
  const reminderFormData = {
    name: `Appointment with ${getDoctorName(reminderData)} on ${formatDate(reminderData.appointment_date)}`,
    time: formatTime(reminderData.schedule),
    isActive: true,
  };

  addReminder(reminderFormData);

  // Add to reminded appointments set
  setRemindedAppointments((prev) => new Set(prev).add(reminderData.id));

  Toast.show({
    type: "success",
    text1: "Reminder Added Successfully",
  });
};
