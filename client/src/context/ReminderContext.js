// context/ReminderContext.js (Expo Go compatible)
import { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  Alert,
  Vibration,
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationContext } from "./AuthenticationContext";

const ReminderContext = createContext();

export const useReminder = () => useContext(ReminderContext);

export const ReminderProvider = ({ children }) => {
  const { user } = useContext(AuthenticationContext);
  const [reminders, setReminders] = useState([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [dueReminder, setDueReminder] = useState(null);
  const [alertCountdown, setAlertCountdown] = useState(30);

  const callTimer = useRef(null);
  const soundRef = useRef(null);
  const vibrationInterval = useRef(null);
  const countdownInterval = useRef(null);

  // Load reminders from storage
  useEffect(() => {
    if (user) {
      loadReminders();
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

  // Check for due reminders
  useEffect(() => {
    const interval = setInterval(() => {
      checkDueReminders();
    }, 10000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders, dueReminder]);

  const checkDueReminders = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime24 = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    console.log("🔔 Checking reminders at:", currentTime24);

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

    // Play alarm sound
    await playAlarmSound();

    // Start vibration
    startVibration();

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

      // Use a simple beep sound (you can replace with your own sound file)
      // For now, we'll create a simple tone using expo-av
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/reminder2.mp3")
      );
      soundRef.current = sound;
      await sound.playAsync();

      // Loop the sound
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.playAsync();
        }
      });
    } catch (error) {
      console.warn("Could not play sound:", error);
      // Fallback to vibration only
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

  const handleAutoCall = () => {
    console.log("📞 Auto-call triggered for:", dueReminder?.name);

    if (user && user.mobileno) {
      Alert.alert(
        "📞 Auto-Call Initiated",
        `Would have called ${user.mobileno} for reminder: ${dueReminder?.name}`,
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "📞 Auto-Call Initiated",
        `Would have called your phone for reminder: ${dueReminder?.name}`,
        [{ text: "OK" }]
      );
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
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}

      {/* Reminder Alert Modal */}
      <Modal
        visible={isNotificationModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleAcknowledge}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
                <Text className="text-3xl">⏰</Text>
              </View>
              <Text className="text-2xl font-bold text-slate-800 mb-2">
                Reminder Alert!
              </Text>
              <Text className="text-lg text-slate-600 text-center mb-1">
                {dueReminder?.name}
              </Text>
              <Text className="text-sm text-red-500 font-semibold">
                Auto-call in: {alertCountdown}s
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleAcknowledge}
              className="px-6 py-4 bg-green-500 rounded-xl shadow-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-lg text-center">
                Acknowledge Reminder
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ReminderContext.Provider>
  );
};
