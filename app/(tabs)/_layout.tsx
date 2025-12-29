import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="CustomerComplaints" />
      <Stack.Screen name="Profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="ChatScreen" />
      <Stack.Screen name="Notifications" />
      <Stack.Screen name="explore" />
    </Stack>
  );
}
