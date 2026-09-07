import "../src/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../src/theme";
const client = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 60_000 } } });
export default function RootLayout() { return <SafeAreaProvider><QueryClientProvider client={client}><StatusBar style="dark" /><Stack screenOptions={{ headerTintColor: colors.text, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false, contentStyle: { backgroundColor: colors.background } }}><Stack.Screen name="index" options={{ headerShown: false }} /><Stack.Screen name="onboarding" options={{ headerShown: false }} /><Stack.Screen name="(tabs)" options={{ headerShown: false }} /><Stack.Screen name="product/[slug]" options={{ title: "" }} /><Stack.Screen name="farmer/[slug]" options={{ title: "Farmer" }} /><Stack.Screen name="auth" options={{ presentation: "modal", title: "Sign in" }} /><Stack.Screen name="checkout" options={{ title: "Checkout" }} /></Stack></QueryClientProvider></SafeAreaProvider>; }
