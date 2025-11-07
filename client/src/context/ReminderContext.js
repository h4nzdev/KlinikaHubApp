// context/ReminderContext.js (Enhanced Version)
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Alert, Vibration, Platform } from "react-native";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationContext } from "./AuthenticationContext";
import smsService from "../services/smsServices";
import {
  cancelHealthTipNotifications,
  scheduleHealthTipNotification,
} from "../utils/healthTipsGenerator";
const ReminderContext = createContext();

export const useReminder = () => useContext(ReminderContext);

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    healthTipsEnabled: true,
  }),
});

export const ReminderProvider = ({ children }) => {
  const { user } = useContext(AuthenticationContext);
  const [reminders, setReminders] = useState([]);
  const [lastReminderId, setLastReminderId] = useState(0);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [dueReminder, setDueReminder] = useState(null);
  const [alertCountdown, setAlertCountdown] = useState(30);
  const [expoPushToken, setExpoPushToken] = useState("");

  const [settings, setSettings] = useState({
    pushNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const callTimer = useRef(null);
  const soundRef = useRef(null);
  const vibrationInterval = useRef(null);
  const countdownInterval = useRef(null);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  const loadLastReminderId = async () => {
    try {
      const storedId = await AsyncStorage.getItem(`lastReminderId_${user.id}`);
      if (storedId) {
        setLastReminderId(parseInt(storedId));
      } else {
        setLastReminderId(0);
      }
    } catch (error) {
      console.error("Error loading last reminder ID:", error);
      setLastReminderId(0);
    }
  };

  const saveLastReminderId = async (id) => {
    try {
      await AsyncStorage.setItem(`lastReminderId_${user.id}`, id.toString());
      setLastReminderId(id);
    } catch (error) {
      console.error("Error saving last reminder ID:", error);
    }
  };

  const getNextReminderId = async () => {
    const nextId = lastReminderId + 1;
    await saveLastReminderId(nextId);
    return nextId;
  };

  // 1. Initialize Push Notifications
  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listen for incoming notifications when app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📱 Notification received:", notification);
        // Handle notification when app is in foreground
        handleNotificationReceived(notification);
      });

    // Listen for notification responses (user taps notification)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Notification tapped:", response);
        handleNotificationResponse(response);
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // 2. Load and schedule existing reminders when app starts
  useEffect(() => {
    if (user) {
      loadReminders();
      loadSettings();
    }
  }, [user]);

  useEffect(() => {
    if (reminders.length > 0) {
      rescheduleAllReminders();
    }
  }, [reminders]);

  // 3. Handle notification when received in foreground
  const handleNotificationReceived = (notification) => {
    const { reminderId } = notification.request.content.data;
    const reminder = reminders.find((r) => r.id === reminderId);

    if (reminder && reminder.isActive) {
      console.log("🚨 Notification triggered for:", reminder.name);
      triggerReminderAlert(reminder);
    }
  };

  // 4. Handle when user taps notification
  const handleNotificationResponse = (response) => {
    const { reminderId } = response.notification.request.content.data;
    const reminder = reminders.find((r) => r.id === reminderId);

    if (reminder) {
      console.log("👆 User tapped notification for:", reminder.name);
      // You can show additional options or mark as acknowledged
    }
  };

  // 5. Register for push notifications (your existing code)
  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("❌ Push notification permission denied");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      console.log("✅ Push token:", token);
    } catch (error) {
      console.log("❌ Error getting push token:", error);
    }
  };

  // 6. NEW: Calculate trigger time for a reminder
  const calculateTriggerTime = (reminderTime24) => {
    const [hours, minutes] = reminderTime24.split(":").map(Number);
    const now = new Date();
    const triggerTime = new Date();

    // Set to today's date with reminder time
    triggerTime.setHours(hours, minutes, 0, 0);

    // If time already passed today, schedule for tomorrow
    if (triggerTime <= now) {
      triggerTime.setDate(triggerTime.getDate() + 1);
    }

    return triggerTime;
  };

  // 7. NEW: Schedule a single reminder notification
  const scheduleReminderNotification = async (reminder) => {
    if (!reminder.isActive || !settings.pushNotifications) {
      return;
    }

    try {
      const triggerTime = calculateTriggerTime(reminder.time24);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 KlinikaHub Reminder",
          body: reminder.name,
          data: {
            reminderId: reminder.id,
            reminderName: reminder.name,
          },
          sound: true,
        },
        trigger: triggerTime,
      });

      console.log(
        "✅ Notification scheduled for:",
        reminder.name,
        "at",
        triggerTime.toLocaleString()
      );
    } catch (error) {
      console.log(
        "❌ Error scheduling notification for",
        reminder.name,
        ":",
        error
      );
    }
  };

  // 8. NEW: Reschedule all reminders
  const rescheduleAllReminders = async () => {
    // First cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Then schedule active reminders
    const activeReminders = reminders.filter((r) => r.isActive);

    for (const reminder of activeReminders) {
      await scheduleReminderNotification(reminder);
    }

    console.log(`✅ Rescheduled ${activeReminders.length} reminders`);
  };

  // 9. NEW: Cancel specific reminder notification
  const cancelReminderNotification = async (reminderId) => {
    // Since Expo doesn't support direct cancellation by ID for one-time notifications,
    // we'll reschedule all reminders except this one
    await rescheduleAllReminders();
  };

  // 10. Load reminders from storage
  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem(`reminders_${user.id}`);
      if (stored) {
        const parsedReminders = JSON.parse(stored);
        setReminders(parsedReminders);

        // Find the highest ID from existing reminders
        if (parsedReminders.length > 0) {
          const maxId = Math.max(...parsedReminders.map((r) => r.id));
          await saveLastReminderId(maxId);
        }
      }
      // Also load the last ID separately
      await loadLastReminderId();
    } catch (error) {
      console.error("Error loading reminders:", error);
    }
  };

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(`reminder_settings_${user.id}`);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async (newSettings) => {
    setSettings(newSettings);
    if (user) {
      await AsyncStorage.setItem(
        `reminder_settings_${user.id}`,
        JSON.stringify(newSettings)
      );
    }
  };

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    await saveSettings(newSettings);

    if (key === "healthTipsEnabled") {
      if (value) {
        await scheduleHealthTipNotification();
      } else {
        await cancelHealthTipNotifications();
      }
    }

    if (key === "pushNotifications") {
      await rescheduleAllReminders();
    }
  };

  const resetSettings = async () => {
    const defaultSettings = {
      pushNotifications: true,
      soundEnabled: true,
      vibrationEnabled: true,
    };
    await saveSettings(defaultSettings);
    await rescheduleAllReminders();
  };

  // 11. Check for due reminders (for when app is in foreground)
  useEffect(() => {
    const interval = setInterval(() => {
      checkDueReminders();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [reminders, dueReminder]);

  const checkDueReminders = () => {
    if (!settings.pushNotifications) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime24 = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const dueReminders = reminders.filter((r) => {
      const isTimeMatch = r.time24 === currentTime24;
      const isActive = r.isActive;
      const notAcknowledgedToday = r.lastAcknowledgedDate !== today;

      if (isTimeMatch && isActive && notAcknowledgedToday) {
        console.log(
          "🎯 Reminder due (foreground check):",
          r.name,
          "at",
          r.time24
        );
        return true;
      }
      return false;
    });

    if (dueReminders.length > 0 && !dueReminder) {
      console.log("🚨 Triggering reminder alert for:", dueReminders[0].name);
      triggerReminderAlert(dueReminders[0]);
    }
  };

  // 12. Trigger reminder alert (your existing code with enhancements)
  const triggerReminderAlert = async (reminder) => {
    setDueReminder(reminder);
    setIsNotificationModalOpen(true);
    setAlertCountdown(30);

    // Start countdown
    countdownInterval.current = setInterval(() => {
      setAlertCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    if (settings.soundEnabled) {
      await playAlarmSound();
    }

    if (settings.vibrationEnabled) {
      startVibration();
    }

    // Set auto-call timer
    callTimer.current = setTimeout(() => {
      handleAutoCall();
    }, 30000);

    // Reschedule this reminder for tomorrow
    await scheduleReminderNotification(reminder);
  };

  const playAlarmSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/reminder2.mp3")
      );
      soundRef.current = sound;
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.playAsync();
        }
      });
    } catch (error) {
      console.warn("Could not play sound:", error);
    }
  };

  const startVibration = () => {
    vibrationInterval.current = setInterval(() => {
      Vibration.vibrate(1000);
    }, 1500);
  };

  const stopVibration = () => {
    if (vibrationInterval.current) {
      clearInterval(vibrationInterval.current);
      vibrationInterval.current = null;
    }
    Vibration.cancel();
  };

  const handleAutoCall = async () => {
    console.log("📱 Sending SMS reminder");

    if (user && user.mobileno) {
      try {
        const message = `🔔 KlinikaHub Reminder: ${dueReminder?.name}`;
        await smsService.sendReminder(user.mobileno, message);
        Alert.alert("✅ SMS Sent", `Reminder sent to ${user.mobileno}`);
      } catch (error) {
        console.error("SMS failed:", error);
        Alert.alert("⚠️ SMS Failed", error.message);
      }
    }

    stopAllAlerts();
    setIsNotificationModalOpen(false);
    setDueReminder(null);
  };

  const stopAllAlerts = async () => {
    stopVibration();

    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    if (callTimer.current) {
      clearTimeout(callTimer.current);
      callTimer.current = null;
    }

    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
  };

  const handleAcknowledge = async () => {
    if (dueReminder) {
      const today = new Date().toISOString().split("T")[0];
      const updatedReminders = reminders.map((r) =>
        r.id === dueReminder.id
          ? {
              ...r,
              notifiedCount: (r.notifiedCount || 0) + 1,
              lastAcknowledgedDate: today,
            }
          : r
      );

      await saveReminders(updatedReminders);
      await stopAllAlerts();
      setIsNotificationModalOpen(false);
      setDueReminder(null);

      Alert.alert("✅ Success", "Reminder acknowledged!");
    }
  };

  // 13. Enhanced reminder management functions
  const saveReminders = async (updatedReminders) => {
    setReminders(updatedReminders);
    if (user) {
      await AsyncStorage.setItem(
        `reminders_${user.id}`,
        JSON.stringify(updatedReminders)
      );
    }
  };

  const addReminder = async (reminderData) => {
    const nextId = await getNextReminderId();

    const newReminder = {
      id: nextId,
      userId: user.id,
      ...reminderData,
      createdAt: new Date().toISOString(),
      notifiedCount: 0,
      lastAcknowledgedDate: null,
      isActive: true,
      // Ensure appointmentId and date have default values if not provided
      appointmentId: reminderData.appointmentId || null,
      date: reminderData.date || new Date().toISOString().split("T")[0], // Default to today
    };

    const updatedReminders = [...reminders, newReminder];
    await saveReminders(updatedReminders);

    // Schedule notification for new reminder
    await scheduleReminderNotification(newReminder);

    return newReminder;
  };

  const updateReminder = async (id, updates) => {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === id ? { ...reminder, ...updates } : reminder
    );
    await saveReminders(updatedReminders);

    // Reschedule all reminders to ensure proper timing
    await rescheduleAllReminders();
  };

  const deleteReminder = async (id) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    await saveReminders(updatedReminders);
    await rescheduleAllReminders();
  };

  const deleteAllReminders = async () => {
    await saveReminders([]);
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const toggleReminder = async (id) => {
    const reminder = reminders.find((r) => r.id === id);
    if (reminder) {
      await updateReminder(id, { isActive: !reminder.isActive });
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopAllAlerts();
    };
  }, []);

  const value = {
    reminders,
    saveReminders: (reminders) => saveReminders(reminders),
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    isNotificationModalOpen,
    dueReminder,
    alertCountdown,
    handleAcknowledge,

    // Settings
    settings,
    updateSetting,
    resetSettings,
    deleteAllReminders,

    // Push notification methods
    expoPushToken,
    schedulePushNotification: scheduleReminderNotification, // Updated reference
    cancelAllScheduledNotifications: () =>
      Notifications.cancelAllScheduledNotificationsAsync(),
    cancelReminderNotification,
    rescheduleAllReminders, // NEW: Export this function
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};
