import { Stack } from "expo-router";
import "../global.css";
import { AppProvider } from "@/contexts/appContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="remote" />
      </Stack>
    </AppProvider>
  );
}
