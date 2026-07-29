/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, Text, Linking } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import "./global.css";
import { CustomText } from './components/CustomText';
import { CustomTitle } from './components/CustomTitle';
import Video from 'react-native-video';
import { useEffect, useState } from 'react';

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
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    Linking.addEventListener('url', ({ url }) => {
      const params = new URL(url);

      setVideoUrl(params.searchParams.get('url') ?? "");
    })
  }, []);

  return videoUrl == "" ?
        <View className='flex bg-background flex-1 justify-center items-center gap-2'>
          <CustomTitle>Bienvenue sur Chrome Controller TV !</CustomTitle>
          <CustomText>Castez un film depuis l'application mobile pour le lancer !</CustomText>
        </View> :
        <Video
          source={{
            uri: videoUrl,
            headers: {
              Referer: 'https://noxpulse.cc/'
            },
            bufferConfig: {
              minBufferMs: 30000,
              maxBufferMs: 60000,
              bufferForPlaybackMs: 5000,
              bufferForPlaybackAfterRebufferMs: 8000,
            }
          }}
          style={{width: '100%', height: '100%'}}
          controls={true}
          resizeMode='contain'
          reportBandwidth={true}
          fullscreen={true}
        />
}

export default App;
