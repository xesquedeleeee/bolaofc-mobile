import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import useAuthStore from "../src/store/authStore";
import useThemeStore from "../src/store/themeStore";
import { Colors } from "../constants/theme";

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { user, hydrated, hydrate } = useAuthStore();
  const { isDark, hydrate: hydrateTheme } = useThemeStore();
  const segments = useSegments();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate();
    hydrateTheme();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, [hydrated]);

  useEffect(() => {
    if (!ready) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, segments, ready]);

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />{" "}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sobre" />
        <Stack.Screen name="perfil-luan" />
        <Stack.Screen name="perfil-alexis" />
        <Stack.Screen name="perfil-levi" />
        <Stack.Screen name="championship/[id]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}
