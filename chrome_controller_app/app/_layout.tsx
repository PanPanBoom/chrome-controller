import { Stack } from "expo-router";
import "../global.css";
import { AppProvider } from "@/contexts/appContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Satoshi': require('../assets/fonts/Satoshi-Regular.otf'),
    'Satoshi-Light': require('../assets/fonts/Satoshi-Light.otf')
  });

  return (
    <AppProvider>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <Stack screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen name="index"/>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen 
            name="modal"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents'
            }} />
        </Stack>
      </SafeAreaView>
    </AppProvider>
  );
}
