import { useEffect, useRef, useState } from "react";
import Video, { ISO639_1, SelectedTrackType, TextTrackType, VideoRef, AudioTrack } from "react-native-video";
import { MediaRecord } from "theintrodb";
import { tidbClient } from "../src/TIDBClient";
import { BackHandler, View } from "react-native";
import { CustomText } from "./CustomText";
import { Button } from "./Button"
import { useKeepAwake } from "@sayem314/react-native-keep-awake";
import { VideoPlayerControls } from "./VideoPlayerControls";
import { Subtitles, SubtitlesDisplayer } from "./SubtitlesDisplayer";

export type VideoInfo = {
  showId: string;
  title: string;
  episodeInfo: {
    season: number;
    episode: number;
  } | null;
  url: string;
  referer: string;
  cookies: string;
  userAgent: string;
  extension?: string;
  serverIp: string;
  startTime: number;
  audioLanguage: ISO639_1;
}

export const VideoPlayer = ({ videoInfo, onVideoEnd }: { videoInfo: VideoInfo, onVideoEnd: () => void }) => {
    const [videoDuration, setVideoDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [tidbInfo, setTidbInfo] = useState<MediaRecord | null>(null);
    const [subtitles, setSubtitles] = useState<Subtitles[]>([]);
    const [selectedSubtitle, setSelectedSubtitle] = useState<Subtitles | null>(null);
    const [currentMediaPart, setCurrentMediaPart] = useState<'intro' | 'recap' | 'credits' | 'preview' | null>(null);
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
    const [selectedAudioTrack, setSelectedAudioTrack] = useState<AudioTrack | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const videoRef = useRef<VideoRef>(null);

    useKeepAwake();

    const handleLoad = (data: { duration: number }) => {
        console.log("Video loaded: ", data);
        setVideoDuration(data.duration);

        tidbClient.getMedia({
            tmdbId: Number(videoInfo.showId.split('/')[1]),
            durationMs: data.duration * 1000,
            season: videoInfo.episodeInfo?.season ?? undefined,
            episode: videoInfo.episodeInfo?.episode ?? undefined
        })
        .then((tidbInfos) => setTidbInfo(tidbInfos))
        .catch((error) => console.log("TIDB Error:", error));
    }

    const handleSkip = () => {
        if(videoRef.current && currentMediaPart)
        {
            const endMs = tidbInfo?.[currentMediaPart]?.[0]?.endMs;
            videoRef.current.seek(endMs ? endMs / 1000 : videoDuration);
        }
    }

    const handleProgress = (progress: { currentTime: number }) => {
        setProgress(progress.currentTime);
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
        });

        for(const part of ['intro', 'recap', 'credits', 'preview'] as const)
        {
            if(!tidbInfo || !tidbInfo[part]) continue;

            if(tidbInfo?.[part]?.[0]?.startMs < progress.currentTime * 1000 && (tidbInfo?.[part]?.[0]?.endMs ?? videoDuration * 1000) > progress.currentTime * 1000)
            {
                setCurrentMediaPart(part);
                return;
            }
        }

        setCurrentMediaPart(null);
    }

    const handleEnd = () => {
        setIsFinished(true);

        setTimeout(() => {
            onVideoEnd();
            fetch(`${videoInfo.serverIp}/showEnd`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    showId: videoInfo.showId,
                    episodeInfo: videoInfo.episodeInfo,
                    audioLanguage: selectedAudioTrack?.language
                })
            });
        }, 500);
    }

    useEffect(() => {
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            onVideoEnd();
            return true;
        });

        return () => sub.remove();
    }, []);

    useEffect(() => {
        if(videoDuration === 0)
            return;

        const params = new URLSearchParams();
        params.append('showId', videoInfo.showId.split('/')[1]);
        params.append('episodeInfo', encodeURIComponent(JSON.stringify(videoInfo.episodeInfo)));
        params.append('duration', videoDuration + '');

        fetch(`${videoInfo.serverIp}/extension/subtitles?${params}`)
            .then(res => res.json())
            .then(data => {
                console.log("Subtitles: ", data);
                if(data && data.length > 0)
                    setSubtitles([{ id: 'disabled', title: 'Désactivé', language: '' as ISO639_1, url: '' }, ...data]);
                else
                    setSubtitles([]);
            })
            .catch(err => console.log('Subtitles error:', err));
    }, [videoDuration]);

    useEffect(() => {
        setSelectedSubtitle(null);
        setSelectedAudioTrack(null);
        setSubtitles([]);
        setAudioTracks([]);
    }, [videoInfo]);
    
    return (
        <View>
            <Video
                ref={videoRef}
                source={isFinished ? undefined : {
                    uri: videoInfo.url,
                    type: videoInfo.extension,
                    startPosition: videoInfo.startTime,
                    headers: {
                        Referer: videoInfo.referer,
                        'Cookie': videoInfo.cookies,
                        'User-Agent': videoInfo.userAgent
                    },
                    bufferConfig: {
                        minBufferMs: 15000,
                        maxBufferMs: 30000,
                        bufferForPlaybackMs: 2500,
                        bufferForPlaybackAfterRebufferMs: 5000,
                    }
                }}
                onLoad={handleLoad}
                onError={(error) => console.log("ExoPlayer error:", JSON.stringify(error))}
                onBuffer={({ isBuffering }) => console.log(isBuffering ? "Buffering..." : "Playing")}
                progressUpdateInterval={0.25 * 1000}
                onProgress={handleProgress}
                onEnd={handleEnd}
                style={{width: '100%', height: '100%'}}
                resizeMode='contain'
                reportBandwidth={true}
                onAudioTracks={(e) => {
                    console.log('new audio tracks');
                    if(audioTracks.length === 0 || selectedAudioTrack === null)
                    {
                        setAudioTracks(e.audioTracks);
                        setSelectedAudioTrack(e.audioTracks.find(track => track.language === videoInfo.audioLanguage) ?? null);
                    }
                }}
                selectedAudioTrack={selectedAudioTrack ? { type: SelectedTrackType.INDEX, value: selectedAudioTrack.index } : { type: SelectedTrackType.SYSTEM }}
                paused={isFinished}
                // controlsStyles={{
                //     hideFullscreen: true
                // }}
            />
            <SubtitlesDisplayer 
                subtitles={selectedSubtitle}
                progress={progress}
                serverIp={videoInfo.serverIp}
                className="absolute bottom-[10%] left-[5%] right-[5%]"
            />
            <VideoPlayerControls 
                title={videoInfo.title}
                episodeInfo={videoInfo.episodeInfo ?? undefined}
                duration={videoDuration}
                currentTime={progress}
                videoRef={videoRef}
                audioTracks={audioTracks}
                onSelectAudioTrack={(track) => setSelectedAudioTrack(track)}
                selectedAudioTrack={selectedAudioTrack ?? undefined}
                subtitles={subtitles}
                selectedSubtitle={selectedSubtitle ?? undefined}
                onSelectSubtitle={(subtitle) => setSelectedSubtitle(subtitle.id === 'disabled' ? null : subtitle)}
                currentMediaPart={currentMediaPart}
                handleSkip={handleSkip}
            />
        </View>
    )
}