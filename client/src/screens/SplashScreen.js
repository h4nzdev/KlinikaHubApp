import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { AuthenticationContext } from "../context/AuthenticationContext";

const SplashScreen = ({ onFinish }) => {
  const containerOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0);
  const outerRingRotation = useSharedValue(0);
  const innerRingRotation = useSharedValue(0);
  const centerScale = useSharedValue(0);
  const centerPulse = useSharedValue(1);
  const greetingY = useSharedValue(50);
  const greetingOpacity = useSharedValue(0);
  const welcomeY = useSharedValue(50);
  const welcomeOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(50);
  const subtitleOpacity = useSharedValue(0);
  const dotsScale = useSharedValue(1);
  const bottomLineWidth = useSharedValue(0);

  // Floating background elements
  const float1Y = useSharedValue(0);
  const float2Y = useSharedValue(0);
  const float3Y = useSharedValue(0);
  const { user } = useContext(AuthenticationContext);

  useEffect(() => {
    // Container fade in
    containerOpacity.value = withTiming(1, { duration: 500 });

    // Floating background animations
    float1Y.value = withRepeat(
      withTiming(20, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    float2Y.value = withDelay(
      1000,
      withRepeat(
        withTiming(-25, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
    float3Y.value = withDelay(
      2000,
      withRepeat(
        withTiming(15, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );

    // Logo animations
    logoScale.value = withDelay(200, withTiming(1, { duration: 600 }));

    // Rotating rings
    outerRingRotation.value = withDelay(
      400,
      withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      )
    );

    innerRingRotation.value = withDelay(
      400,
      withRepeat(
        withTiming(-360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      )
    );

    // Center icon
    centerScale.value = withDelay(
      500,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.back) })
    );

    centerPulse.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(1.1, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );

    // Text animations
    greetingY.value = withDelay(700, withTiming(0, { duration: 600 }));
    greetingOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));

    welcomeY.value = withDelay(900, withTiming(0, { duration: 600 }));
    welcomeOpacity.value = withDelay(900, withTiming(1, { duration: 600 }));

    subtitleY.value = withDelay(1100, withTiming(0, { duration: 600 }));
    subtitleOpacity.value = withDelay(1100, withTiming(1, { duration: 600 }));

    // Loading dots
    dotsScale.value = withDelay(
      1300,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 750, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );

    // Bottom line
    bottomLineWidth.value = withDelay(
      1500,
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) })
    );

    // Auto dismiss after 3 seconds
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const float1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: float1Y.value }],
  }));

  const float2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: float2Y.value }],
  }));

  const float3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: float3Y.value }],
  }));

  const logoContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const outerRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${outerRingRotation.value}deg` }],
  }));

  const innerRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${innerRingRotation.value}deg` }],
  }));

  const centerIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: centerScale.value * centerPulse.value }],
    opacity: interpolate(centerPulse.value, [1, 1.1], [0.8, 1]),
  }));

  const greetingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: greetingY.value }],
    opacity: greetingOpacity.value,
  }));

  const welcomeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: welcomeY.value }],
    opacity: welcomeOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subtitleY.value }],
    opacity: subtitleOpacity.value,
  }));

  const bottomLineStyle = useAnimatedStyle(() => ({
    width: `${bottomLineWidth.value * 80}%`,
    opacity: bottomLineWidth.value * 0.6,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Floating background elements */}
      <Animated.View style={[styles.floatingBg1, float1Style]} />
      <Animated.View style={[styles.floatingBg2, float2Style]} />
      <Animated.View style={[styles.floatingBg3, float3Style]} />

      <View style={styles.content}>
        {/* Logo/Icon */}
        <Animated.View style={[styles.logoContainer, logoContainerStyle]}>
          {/* Outer ring */}
          <Animated.View style={[styles.outerRing, outerRingStyle]} />

          {/* Inner ring */}
          <Animated.View style={[styles.innerRing, innerRingStyle]} />

          {/* Center icon */}
          <Animated.View style={[styles.centerIconContainer, centerIconStyle]}>
            <View style={styles.centerIcon}>
              <View style={styles.centerIconOverlay}>
                <View style={styles.centerIconDot} />
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Greeting text */}
        <Animated.View style={greetingStyle}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
        </Animated.View>

        {/* Welcome message */}
        <Animated.View style={welcomeStyle}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.clinicName}>
            <Text className="text-cyan-800">Klinika</Text>
            <Text className="text-green-800">Hub</Text>
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={subtitleStyle}>
          <Text style={styles.subtitle}>We're glad to have you here</Text>
        </Animated.View>

        {/* Loading dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => {
            const dotScale = useSharedValue(1);

            useEffect(() => {
              dotScale.value = withDelay(
                1300 + index * 200,
                withRepeat(
                  withSequence(
                    withTiming(1.2, {
                      duration: 750,
                      easing: Easing.inOut(Easing.ease),
                    }),
                    withTiming(1, {
                      duration: 750,
                      easing: Easing.inOut(Easing.ease),
                    })
                  ),
                  -1,
                  false
                )
              );
            }, []);

            const dotStyle = useAnimatedStyle(() => ({
              transform: [{ scale: dotScale.value }],
              opacity: interpolate(dotScale.value, [1, 1.2], [0.5, 1]),
            }));

            return <Animated.View key={index} style={[styles.dot, dotStyle]} />;
          })}
        </View>

        {/* Bottom line */}
        <Animated.View style={[styles.bottomLine, bottomLineStyle]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecfeff",
    position: "relative",
    overflow: "hidden",
  },
  floatingBg1: {
    position: "absolute",
    top: 80,
    left: 80,
    width: 128,
    height: 128,
    backgroundColor: "rgba(103, 232, 249, 0.2)",
    borderRadius: 64,
    opacity: 0.4,
  },
  floatingBg2: {
    position: "absolute",
    bottom: 128,
    right: 128,
    width: 160,
    height: 160,
    backgroundColor: "rgba(103, 232, 249, 0.15)",
    borderRadius: 80,
    opacity: 0.4,
  },
  floatingBg3: {
    position: "absolute",
    top: "50%",
    left: "25%",
    width: 96,
    height: 96,
    backgroundColor: "rgba(147, 197, 253, 0.2)",
    borderRadius: 48,
    opacity: 0.4,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    zIndex: 10,
  },
  logoContainer: {
    width: 96,
    height: 96,
    marginBottom: 32,
    position: "relative",
  },
  outerRing: {
    position: "absolute",
    width: 96,
    height: 96,
    borderWidth: 4,
    borderColor: "rgba(103, 232, 249, 0.6)",
    borderRadius: 48,
  },
  innerRing: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 72,
    height: 72,
    borderWidth: 2,
    borderColor: "rgba(96, 165, 250, 0.7)",
    borderRadius: 36,
  },
  centerIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  centerIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#0891b2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerIconOverlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  centerIconDot: {
    width: 20,
    height: 20,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "300",
    color: "#475569",
    marginBottom: 8,
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#0891b2",
    textAlign: "center",
  },
  clinicName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0e7490",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "#64748b",
    marginTop: 16,
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 48,
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22d3ee",
  },
  bottomLine: {
    position: "absolute",
    bottom: 48,
    height: 2,
    backgroundColor: "#22d3ee",
  },
});

export default SplashScreen;
