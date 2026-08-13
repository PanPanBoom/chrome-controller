import { Stack } from "expo-router";
import "../global.css";
import { AppProvider } from "@/contexts/appContext";
import { useFonts } from 'expo-font';
import { ModalProvider } from "@/contexts/modalProvider";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Satoshi': require('../assets/fonts/Satoshi-Regular.otf'),
    'Satoshi-Light': require('../assets/fonts/Satoshi-Light.otf'),
    'Satoshi-Bold': require('../assets/fonts/Satoshi-Bold.otf')
  });

  return (
    <AppProvider>
      <ModalProvider>
        <Stack screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen name="index"/>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="scanNetwork" />
          <Stack.Screen name="show/[id]" />
          <Stack.Screen 
            name="modal"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents'
            }} />
        </Stack>
      </ModalProvider>
    </AppProvider>
  );
}
