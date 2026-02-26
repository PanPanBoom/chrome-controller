import { Stack } from "expo-router";
import "../global.css";
import { AppProvider } from "@/contexts/appContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <AppProvider>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="(tabs)"/>
      </Stack>
      </SafeAreaView>
    </AppProvider>
  );
}
