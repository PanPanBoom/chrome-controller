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
import { useEffect, useState } from 'react';
import { VideoInfo, VideoPlayer } from './components/VideoPlayer';

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
  // const safeAreaInsets = useSafeAreaInsets();
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  useEffect(() => {
    Linking.addEventListener('url', ({ url }) => {
      const params = new URL(url);

      const videoUrl = params.searchParams.get('url');
      const extension = videoUrl?.match(/\.(mp4|webm|mkv|mov|avi|flv|wmv|m4v|mpg|mpeg|3gp|ogv|m3u8|mpd)(\?|$)/i);
      const episodeInfo = params.searchParams.get('episodeInfo');

      setVideoInfo({
        showId: params.searchParams.get('showId') ?? "",
        episodeInfo: episodeInfo ? JSON.parse(decodeURIComponent(episodeInfo)) : null,
        url: decodeURIComponent(params.searchParams.get('url') ?? ""),
        referer: decodeURIComponent(params.searchParams.get('referer') ?? ""),
        cookies: decodeURIComponent(params.searchParams.get('cookies') ?? ""),
        userAgent: decodeURIComponent(params.searchParams.get('userAgent') ?? ""),
        extension: extension ? extension[1] : "m3u8",
        serverIp: decodeURIComponent(params.searchParams.get('serverIp') ?? ""),
        startTime: Number(params.searchParams.get('startTime') ?? 0)
      });
    })
  }, []);

  useEffect(() => {
    console.log(videoInfo);
  }, [videoInfo]);

  if(videoInfo?.url && videoInfo.url.length > 0)
    return (
      <View className='bg-black'>
        <VideoPlayer videoInfo={videoInfo} onVideoEnd={() => setVideoInfo(null)} />
      </View>
    )

  return (
    <View className='flex bg-background flex-1 justify-center items-center gap-2'>
      <CustomTitle>Bienvenue sur Chrome Controller TV !</CustomTitle>
      <CustomText>Castez un film depuis l'application mobile pour le lancer !</CustomText>
    </View>
  )
}

export default App;
