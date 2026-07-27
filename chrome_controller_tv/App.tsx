/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import "./global.css";
import { CustomText } from './components/CustomText';
import { CustomTitle } from './components/CustomTitle';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View className='flex bg-background flex-1 justify-center items-center gap-2'>
      <CustomTitle>Bienvenue sur Chrome Controller TV !</CustomTitle>
      <CustomText>Castez un film depuis l'application mobile pour le lancer !</CustomText>
      {/* <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      /> */}
    </View>
  );
}

export default App;
