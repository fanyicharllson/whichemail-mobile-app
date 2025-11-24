import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  error?: Error | null;
  onRetry?: () => Promise<void> | void;
  /**
   * Optional close handler. If not provided the component will call BackHandler.exitApp()
   * to preserve previous behavior.
   */
  onClose?: () => void;
};

export default function NetworkErrorModal({
  visible,
  error,
  onRetry,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const translateY = useRef(new Animated.Value(150)).current; // start offscreen

  useEffect(() => {
    let mountedNow = true;
    if (visible) {
      setMounted(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // animate down then unmount
      Animated.timing(translateY, {
        toValue: 150,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        if (mountedNow) setMounted(false);
      });
    }

    return () => {
      mountedNow = false;
    };
  }, [visible, translateY]);

  if (!mounted) return null;

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 6 + insets.bottom,
        zIndex: 50,
      }}
      pointerEvents="box-none"
    >
      <View className="flex-row items-center bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-lg">
        <View className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mr-3">
          <Ionicons name="cloud-offline" size={22} color="#ef4444" />
        </View>

        <View className="flex-1">
          <Text className="text-slate-900 dark:text-slate-100 font-bold text-sm">
            Connection Error
          </Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs mt-1">
            Unable to reach the internet. Check your connection and try again.
          </Text>

          {error && (
            <Text className="text-red-700 dark:text-red-400 text-[11px] mt-1">
              {error.message || "Network error"}
            </Text>
          )}
        </View>

        <View className="flex-row items-center ml-3">
          <TouchableOpacity
            onPress={async () => {
              if (onRetry) await onRetry();
            }}
            className="bg-blue-600 dark:bg-blue-500 px-3 py-2 rounded-md flex-row items-center mr-2"
            accessibilityLabel="Retry Connection"
          >
            <Ionicons name="refresh" size={16} color="white" />
            <Text className="text-white font-bold text-sm ml-2">Retry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (onClose) return onClose();
              BackHandler.exitApp();
            }}
            className="p-2"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
