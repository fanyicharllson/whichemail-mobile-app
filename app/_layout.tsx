/* eslint-disable @typescript-eslint/no-unused-vars */
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { View, Text, ActivityIndicator, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "./globals.css";
import Toast from "react-native-toast-message";
import { getToastConfig } from "@/utils/toastConfig";
import { useAppUpdate } from "@/hooks/useAppUpdate";
import { AppUpdateModal } from "@/components/AppUpdateModal";
import { ClipboardMonitorProvider } from "@/components/ClipboardMonitorProvider";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { NetworkProvider, useNetwork } from "@/components/NetworkProvider";
import NetworkErrorModal from "@/components/common/NetworkErrorModal";
import { createURL } from "expo-linking";
import * as Sentry from "@sentry/react-native";
import ErrorBoundary from "@/components/ErrorBoundary";

Sentry.init({
  dsn: "https://25e0a6978df07d48859aa843db0fb26e@o4508563067699200.ingest.de.sentry.io/4510264738775120",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const queryClient = new QueryClient();
const prefix = createURL("/");

// Inner App component that uses useTheme (must be inside ThemeProvider)
function App({
  updateAvailable,
  isDownloading,
  reloadApp,
}: {
  updateAvailable: boolean;
  isDownloading: boolean;
  reloadApp: () => void;
}) {
  const { actualTheme } = useTheme(); // Now safe to call here

  return (
    <ErrorBoundary>
      <ClipboardMonitorProvider>
        <NetworkProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="welcome" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="service" />
          </Stack>
          {/* Toast config */}
          <Toast config={getToastConfig(actualTheme)} />

          {/* Update modal in case any updates */}
          <AppUpdateModal
            visible={updateAvailable}
            isDownloading={isDownloading}
            onReload={reloadApp}
          />

          {/* Network overlay */}
          <NetworkOverlay />
          <SyncIndicator />
        </NetworkProvider>
      </ClipboardMonitorProvider>
    </ErrorBoundary>
  );
}

// Small overlay component that consumes network context to render global modal
function NetworkOverlay() {
  const { isConnected, error, triggerRefetch, isSyncing } = useNetwork();

  return (
    <NetworkErrorModal
      visible={isConnected === false}
      error={error}
      onRetry={async () => {
        await triggerRefetch();
      }}
    />
  );
}

// Small global sync indicator shown on top-right when any global sync is running
function SyncIndicator() {
  const { isSyncing } = useNetwork();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let alive = true;
    if (isSyncing) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -24,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (alive) setMounted(false);
      });
    }

    return () => {
      alive = false;
    };
  }, [isSyncing, translateY, opacity]);

  if (!mounted) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: insets.top + 8,
        left: 0,
        right: 0,
        alignItems: "center",
        transform: [{ translateY }],
        opacity,
        zIndex: 9999,
        elevation: 999,
      }}
    >
      <View className="flex-row items-center bg-gray-200 dark:bg-slate-600 rounded-full px-3 py-2 shadow-md">
        <ActivityIndicator
          size="small"
          color="#ef4444"
          style={{ marginRight: 8 }}
        />
        <Text className="text-slate-900 dark:text-slate-100 text-sm">
          Syncing your data…
        </Text>
      </View>
    </Animated.View>
  );
}

export default Sentry.wrap(function RootLayout() {
  // Call useAppUpdate here (outside providers)
  const { updateAvailable, isDownloading, reloadApp } = useAppUpdate();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* Pass props to App so it can use them */}
        <App
          updateAvailable={updateAvailable}
          isDownloading={isDownloading}
          reloadApp={reloadApp}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
});
