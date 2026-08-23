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

type VideoInfo = {
  url: string;
  referer: string;
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  useEffect(() => {
    Linking.addEventListener('url', ({ url }) => {
      const params = new URL(url);

      setVideoInfo({
        url: params.searchParams.get('url') ?? "",
        referer: params.searchParams.get('referer') ?? ""
      });
    })
  }, []);

  useEffect(() => {
    console.log(videoInfo);
  }, [videoInfo]);

  if(videoInfo?.url && videoInfo.url.length > 0)
    return (
      <Video
        source={{
          uri: videoInfo.url,
          headers: {
            Referer: videoInfo.referer
          },
          bufferConfig: {
            minBufferMs: 30000,
            maxBufferMs: 60000,
            bufferForPlaybackMs: 5000,
            bufferForPlaybackAfterRebufferMs: 8000,
          }
        }}
        onLoad={(data) => {
          console.log("✅ VIDÉO CHARGÉE !", data);
        }}
        onError={(error) => {
          console.log("❌ ERREUR EXOPLAYER :", error.error);
          // error.error contient généralement un code d'erreur réseau très utile (ex: 403)
        }}
        onBuffer={({ isBuffering }) => {
          console.log(isBuffering ? "⏳ Mise en cache..." : "▶️ Lecture");
        }}
        style={{width: '100%', height: '100%'}}
        controls={true}
        resizeMode='contain'
        reportBandwidth={true}
        fullscreen={true}
      />
      // <View className='flex bg-background flex-1 justify-center items-center gap-2'>
      //   <CustomText>URL : {videoInfo.url}</CustomText>
      //   <CustomText>Referer : {videoInfo.referer}</CustomText>
      //   <CustomText>User-Agent : {videoInfo.userAgent}</CustomText>
      //   <CustomText>Cookies : {videoInfo.cookies}</CustomText>
      // </View>
    )

  return (
    <View className='flex bg-background flex-1 justify-center items-center gap-2'>
      <CustomTitle>Bienvenue sur Chrome Controller TV !</CustomTitle>
      <CustomText>Castez un film depuis l'application mobile pour le lancer !</CustomText>
    </View>
  )
}

export default App;
