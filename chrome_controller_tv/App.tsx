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
  showId: string;
  episodeInfo: {
    season: number;
    episode: number;
  } | null;
  url: string;
  referer: string;
  extension: string;
  serverIp: string;
  startTime: number;
}

function AppContent() {
  // const safeAreaInsets = useSafeAreaInsets();
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);

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
      <Video
        source={{
          uri: videoInfo.url,
          type: videoInfo.extension,
          startPosition: videoInfo.startTime,
          headers: {
            Referer: videoInfo.referer,
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
          setVideoDuration(data.duration);
        }}
        onError={(error) => {
          console.log("❌ ERREUR EXOPLAYER :", error.error);
        }}
        onBuffer={({ isBuffering }) => {
          console.log(isBuffering ? "⏳ Mise en cache..." : "▶️ Lecture");
        }}
        progressUpdateInterval={10 * 1000}
        onProgress={(progress) => {
          console.log(`${videoInfo.serverIp}/updateStartTime`);
          fetch(`${videoInfo.serverIp}/updateStartTime`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              showId: videoInfo.showId,
              nextStartTime: progress.currentTime * 1000,
              episodeInfo: videoInfo.episodeInfo,
              percentageWatched: progress.currentTime / videoDuration * 100
            })
          })
        }}
        onEnd={() => {
          fetch(`${videoInfo.serverIp}/updateStartTime`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              showId: videoInfo.showId,
              nextStartTime: 0,
              episodeInfo: videoInfo.episodeInfo,
              percentageWatched: 0
            })
          })
        }}
        style={{width: '100%', height: '100%'}}
        controls={true}
        resizeMode='contain'
        reportBandwidth={true}
        fullscreen={true}
      />
      // <View className='flex bg-background flex-1 justify-center items-center gap-2'>
      //   <CustomText>URL: {videoInfo.url}</CustomText>
      //   <CustomText>Extension: {videoInfo.extension}</CustomText>
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
