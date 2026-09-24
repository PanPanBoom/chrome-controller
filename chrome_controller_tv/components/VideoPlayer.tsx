import { useEffect, useRef, useState } from "react";
import Video, { ISO639_1, SelectedTrackType, TextTrackType, VideoRef } from "react-native-video";
import { MediaRecord } from "theintrodb";
import { tidbClient } from "../src/TIDBClient";
import { View } from "react-native";
import { CustomText } from "./CustomText";
import { Button } from "./Button"
import { useKeepAwake } from "@sayem314/react-native-keep-awake";
import { type SubtitleData } from "wyzie-lib";

export type VideoInfo = {
  showId: string;
  episodeInfo: {
    season: number;
    episode: number;
  } | null;
  url: string;
  referer: string;
  cookies: string;
  userAgent: string;
  extension: string;
  serverIp: string;
  startTime: number;
}

const skipButtonLabels = {
    'intro': 'le générique',
    'recap': 'le récap',
    'credits': 'les credits',
    'preview': 'la preview'
}

export const VideoPlayer = ({ videoInfo, onVideoEnd }: { videoInfo: VideoInfo, onVideoEnd: () => void }) => {
    const [videoDuration, setVideoDuration] = useState(0);
    const [tidbInfo, setTidbInfo] = useState<MediaRecord | null>(null);
    const [subtitles, setSubtitles] = useState<{
        title: string;
        language: ISO639_1,
        type: TextTrackType,
        uri: string
    }[] | null>(null);
    const [currentMediaPart, setCurrentMediaPart] = useState<'intro' | 'recap' | 'credits' | 'preview' | null>(null);
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
                    episodeInfo: videoInfo.episodeInfo
                })
            });
        }, 500);
    }

    useEffect(() => {
        console.log("Subtitles:", JSON.stringify(subtitles));
    }, [subtitles]);

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('showId', videoInfo.showId.split('/')[1]);
        params.append('episodeInfo', encodeURIComponent(JSON.stringify(videoInfo.episodeInfo)));
        params.append('duration', videoDuration + '');

        fetch(`${videoInfo.serverIp}/extension/subtitles?${params}`)
            .then(res => res.json())
            .then(data => {
                if(data && data.length > 0)
                {
                    setSubtitles([{
                        title: 'Français',
                        language: 'fr',
                        type: TextTrackType.VTT,
                        uri: `${videoInfo.serverIp}/extension/proxy-subtitles?url=${encodeURIComponent(data[0].url)}`
                    }]);
                }
                else
                    setSubtitles([]);
            })
            .catch(err => console.log('Subtitles error:', err));

        return () => {
            setIsFinished(true);
        };
    }, []);

    if(subtitles === null)
        return <View className="flex bg-black" />
    
    return (
        <View>
            <Video
                ref={videoRef}
                source={isFinished ? undefined : {
                    uri: videoInfo.url,
                    type: videoInfo.extension,
                    startPosition: videoInfo.startTime,
                    textTracks: subtitles,
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
                selectedTextTrack={
                    subtitles.length > 0 ?
                    {
                        type: SelectedTrackType.INDEX,
                        value: 0
                    } : { type: SelectedTrackType.DISABLED }
                }
                onLoad={handleLoad}
                onError={(error) => console.log("ExoPlayer error:", JSON.stringify(error))}
                onBuffer={({ isBuffering }) => console.log(isBuffering ? "Buffering..." : "Playing")}
                progressUpdateInterval={1 * 1000}
                onProgress={handleProgress}
                onEnd={handleEnd}
                onTextTracks={(e) => console.log("onTextTracks:", JSON.stringify(e))}
                style={{width: '100%', height: '100%'}}
                controls={true}
                resizeMode='contain'
                reportBandwidth={true}
                paused={isFinished}
                // controlsStyles={{
                //     hideFullscreen: true
                // }}
            />
            {
                currentMediaPart &&
                <Button
                    className="absolute bottom-[25%] right-[5%]"
                    onPress={handleSkip}
                    hasTVPreferredFocus={true}
                    >
                    <CustomText>{`Passer ${skipButtonLabels[currentMediaPart]}`}</CustomText>
                </Button>
            }
        </View>
    )
}