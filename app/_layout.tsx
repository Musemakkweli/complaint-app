import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ThemeProvider, useTheme } from "../context/ThemeContext";

function NavigationWrapper() {
  const { theme } = useTheme();

  return (
    <NavigationThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Start the app at login */}
        <Stack.Screen name="(tabs)/index" />  {/* login screen */}
        <Stack.Screen name="(tabs)/dashboard" />  {/* dashboard after login */}
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "" }} />
      </Stack>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NavigationWrapper />
    </ThemeProvider>
  );
}
