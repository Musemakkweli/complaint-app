import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { UserProvider } from "../context/UserContext"; // <-- add UserProvider

function NavigationWrapper() {
  const { theme } = useTheme();

  return (
    <NavigationThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Start at login */}
        <Stack.Screen name="index" />  

        {/* Dashboard inside tabs */}
        <Stack.Screen name="dashboard" />  

        {/* Modal screen */}
        <Stack.Screen 
          name="modal" 
          options={{ presentation: "modal", title: "" }} 
        />
      </Stack>

      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>  {/* <-- wrap Navigation with UserProvider */}
        <NavigationWrapper />
      </UserProvider>
    </ThemeProvider>
  );
}
