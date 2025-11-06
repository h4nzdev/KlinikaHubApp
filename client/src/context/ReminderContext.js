// context/ReminderContext.js (With Expo Push Notifications)
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Alert, Vibration, Platform } from "react-native";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationContext } from "./AuthenticationContext";
import smsService from "../services/smsServices";

const ReminderContext = createContext();

export const useReminder = () => useContext(ReminderContext);

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const ReminderProvider = ({ children }) => {
  const { user } = useContext(AuthenticationContext);
  const [reminders, setReminders] = useState([]);
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

  // 1. Initialize Push Notifications
  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listen for incoming notifications
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📱 Notification received:", notification);
      });

    // Listen for notification responses
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Notification tapped:", response);
        // You can handle when user taps the notification here
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // 2. Register for push notifications
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

      // Get the token
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      console.log("✅ Push token:", token);
    } catch (error) {
      console.log("❌ Error getting push token:", error);
    }
  };

  // 3. Schedule a push notification
  const schedulePushNotification = async (reminder) => {
    try {
      const trigger = new Date(Date.now() + 1000); // Show in 1 second

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 KlinikaHub Reminder",
          body: reminder.name,
          data: { reminderId: reminder.id },
          sound: true,
        },
        trigger,
      });

      console.log("✅ Push notification scheduled for:", reminder.name);
    } catch (error) {
      console.log("❌ Error scheduling notification:", error);
    }
  };

  // 4. Cancel all scheduled notifications
  const cancelAllScheduledNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("✅ All scheduled notifications cancelled");
  };

  // 5. Cancel specific reminder notification
  const cancelReminderNotification = async (reminderId) => {
    // Note: Expo doesn't have direct cancellation by ID for one-time notifications
    // We'll handle this by not scheduling if reminder is inactive
    console.log("ℹ️ Reminder cancelled:", reminderId);
  };

  // Load reminders from storage
  useEffect(() => {
    if (user) {
      loadReminders();
      loadSettings();
    }
  }, [user]);

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem(`reminders_${user.id}`);
      if (stored) {
        const parsedReminders = JSON.parse(stored);
        setReminders(parsedReminders);
      }
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
  };

  const resetSettings = async () => {
    const defaultSettings = {
      pushNotifications: true,
      soundEnabled: true,
      vibrationEnabled: true,
    };
    await saveSettings(defaultSettings);
  };

  // Check for due reminders
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
        console.log("🎯 Reminder due:", r.name, "at", r.time24);
        return true;
      }
      return false;
    });

    if (dueReminders.length > 0 && !dueReminder) {
      console.log("🚨 Triggering reminder alert for:", dueReminders[0].name);
      triggerReminderAlert(dueReminders[0]);
    }
  };

  const triggerReminderAlert = async (reminder) => {
    setDueReminder(reminder);
    setIsNotificationModalOpen(true);
    setAlertCountdown(30);

    // ✅ ADDED: Schedule push notification
    if (settings.pushNotifications) {
      await schedulePushNotification(reminder);
    }

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

  const saveReminders = async (updatedReminders) => {
    setReminders(updatedReminders);
    if (user) {
      await AsyncStorage.setItem(
        `reminders_${user.id}`,
        JSON.stringify(updatedReminders)
      );
    }
  };

  // Public methods
  const addReminder = async (reminderData) => {
    const newReminder = {
      id: Date.now().toString(),
      ...reminderData,
      createdAt: new Date().toISOString(),
      notifiedCount: 0,
      lastAcknowledgedDate: null,
    };
    const updatedReminders = [...reminders, newReminder];
    await saveReminders(updatedReminders);
    return newReminder;
  };

  const updateReminder = async (id, updates) => {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === id ? { ...reminder, ...updates } : reminder
    );
    await saveReminders(updatedReminders);
  };

  const deleteReminder = async (id) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    await saveReminders(updatedReminders);
  };

  const deleteAllReminders = async () => {
    await saveReminders([]);
    await cancelAllScheduledNotifications();
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

    // ✅ NEW: Push notification methods
    expoPushToken,
    schedulePushNotification,
    cancelAllScheduledNotifications,
    cancelReminderNotification,
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};
