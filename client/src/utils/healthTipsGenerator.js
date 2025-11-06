// 🌟 Modern ES6 health tips with arrow functions and const
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

const healthTips = [
  "💧 Hydration Station! Drink a glass of water, you beautiful human!",
  "👀 Screen break! Look 20 feet away for 20 seconds - your eyes will thank you!",
  "🚶 Up we go! Stand up and do a little dance if you're feeling fancy!",
  "🌿 Breathe in, breathe out... repeat 4 more times. Feel that? Magic!",
  "🥗 Fuel up! Eat something colorful - rainbows are delicious!",
  "☀️ Vitamin D time! Get some sunlight or just pretend you're a plant!",
  "📵 Digital detox! Put your phone away and be present for 10 minutes!",
  "🧘 Posture check! Sit like the majestic royalty you are!",
  "💤 Break time! Your brain needs rest too - no arguments!",
  "❤️ Move it! Shake those limbs for 5 minutes - dance party approved!",
  "😊 Smile! It confuses people and burns calories! Win-win!",
  "🎵 Music break! Listen to your favorite song and have a mini-concert!",
  "👃 Scent-sational! Smell something nice - coffee, flowers, whatever floats your boat!",
  "💪 Quick strength! Do 10 squats - your future self will thank you!",
  "🧠 Brain break! Close your eyes and count to 10 slowly!",
  "🤝 Social boost! Send a nice message to someone you care about!",
];

// 🎯 Arrow function for random tips - so clean!
export const getRandomTip = () => {
  const randomIndex = Math.floor(Math.random() * healthTips.length);
  return healthTips[randomIndex];
};

// 🔥 NEW: Simple notification scheduler
export const scheduleHealthTipNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🌟 KlinikaHub Health Tip!",
        body: getRandomTip(),
        sound: true,
      },
      trigger: {
        seconds: 3 * 60 * 60, // 3 hours
        repeats: true, // 🔁 This is the magic!
      },
    });
    console.log("✅ Health tips scheduled every 3 hours!");
  } catch (error) {
    console.log("❌ Error:", error);
  }
};

// 🔥 NEW: Cancel health tips
export const cancelHealthTipNotifications = async () => {
  const allNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  // Cancel all repeating notifications (health tips)
  for (const notification of allNotifications) {
    if (notification.trigger.repeats) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }
  console.log("🔕 Health tips cancelled");
};
