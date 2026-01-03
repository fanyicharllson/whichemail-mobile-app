import React, { useEffect, useRef, useMemo } from "react";
import { Text, View, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/components/ThemeProvider";

export default function HeroCard({
  userName = "User",
  totalServices,
  services = [],
  onQuickAction,
  onAIChat,
  onServiceOfDay,
}: HeroCardProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === "dark";

  // Animations
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const serviceShineAnim = useRef(new Animated.Value(0)).current;

  // Get service of the day (deterministic based on date)
  const serviceOfDay = useMemo(() => {
    if (services.length === 0) return null;

    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    const index = dayOfYear % services.length;

    return services[index];
  }, [services]);

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Service shine animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(serviceShineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(serviceShineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim, glowAnim, serviceShineAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅 Good Morning";
    if (hour < 17) return "☀️ Good Afternoon";
    return "🌙 Good Evening";
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  const shineTranslateX = serviceShineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
      className="mb-4"
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onQuickAction}
        activeOpacity={0.9}
        className="overflow-hidden rounded-3xl shadow-2xl"
      >
        {/* Gradient Background */}
        <LinearGradient
          colors={
            isDark
              ? ["#1e40af", "#3b82f6", "#60a5fa"]
              : ["#3b82f6", "#60a5fa", "#93c5fd"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="relative"
        >
          {/* Animated glow effect */}
          <Animated.View
            style={{
              opacity: glowOpacity,
            }}
            className="absolute inset-0"
          >
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.3)",
                "transparent",
                "rgba(255,255,255,0.2)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          {/* Decorative circles */}
          <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
          <View className="absolute -left-5 -bottom-5 w-32 h-32 bg-white/5 rounded-full" />

          <View className="p-5">
            {/* Header Section */}
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-white/80 text-xs font-semibold mb-0.5">
                  {getGreeting()}
                </Text>
                <Text
                  className="text-white text-xl font-black mb-0.5"
                  style={{ letterSpacing: -0.5 }}
                >
                  {userName}! 👋
                </Text>
                <Text className="text-white/70 text-xs font-medium">
                  {totalServices} {totalServices === 1 ? "service" : "services"}{" "}
                  organized like a pro 😎
                </Text>
              </View>

              {/* Active Badge */}
              <Animated.View
                style={{
                  transform: [{ translateY: floatAnim }],
                }}
              >
                <View className="bg-white/20 backdrop-blur rounded-full px-2.5 py-1 flex-row items-center">
                  <View className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5" />
                  <Text className="text-white text-xs font-bold">Active</Text>
                </View>
              </Animated.View>
            </View>

            {/* Service of the Day */}
            {serviceOfDay && (
              <TouchableOpacity
                onPress={() => onServiceOfDay?.(serviceOfDay)}
                activeOpacity={0.8}
                className="bg-white/15 backdrop-blur rounded-2xl p-3 mb-3 border border-white/25 overflow-hidden"
              >
                {/* Shine effect */}
                <Animated.View
                  style={{
                    transform: [{ translateX: shineTranslateX }],
                  }}
                  className="absolute inset-0 w-20 bg-white/20"
                />

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="bg-amber-400/30 rounded-xl p-2 mr-3">
                      <Ionicons
                        name={(serviceOfDay.icon as any) || "star"}
                        size={18}
                        color="#fbbf24"
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center mb-0.5">
                        <Ionicons name="sparkles" size={12} color="#fbbf24" />
                        <Text className="text-amber-200 text-xs font-bold ml-1">
                          Service of the Day
                        </Text>
                      </View>
                      <Text
                        className="text-white font-bold text-sm"
                        numberOfLines={1}
                      >
                        {serviceOfDay.serviceName}
                      </Text>
                      <Text className="text-white/60 text-xs" numberOfLines={1}>
                        {serviceOfDay.email}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="rgba(255,255,255,0.6)"
                  />
                </View>
              </TouchableOpacity>
            )}

            {/* Quick Action Buttons */}
            <View className="flex-row gap-2.5">
              {/* AI Chat Button */}
              <TouchableOpacity
                onPress={onAIChat}
                className="flex-1 bg-white/20 backdrop-blur rounded-xl p-3 flex-row items-center border border-white/30"
                activeOpacity={0.7}
              >
                <View className="bg-white/30 rounded-lg p-1.5 mr-2">
                  <Ionicons name="sparkles" size={16} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-xs">Ask AI</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color="rgba(255,255,255,0.7)"
                />
              </TouchableOpacity>

              {/* Quick Add Button */}
              <TouchableOpacity
                onPress={onQuickAction}
                className="bg-white/20 backdrop-blur rounded-xl p-3 items-center justify-center border border-white/30 px-4"
                activeOpacity={0.7}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}
