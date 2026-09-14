import { useEffect, useRef, useState } from "react";
import Video, { VideoRef } from "react-native-video";
import { MediaRecord } from "theintrodb";
import { tidbClient } from "../src/TIDBClient";
import { View } from "react-native";
import { CustomText } from "./CustomText";
import { Button } from "./Button"

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
    const [currentMediaPart, setCurrentMediaPart] = useState<'intro' | 'recap' | 'credits' | 'preview' | null>(null);
    const videoRef = useRef<VideoRef>(null);

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
    }
    
    return (
        <View>
            <Video
                ref={videoRef}
                source={{
                    uri: videoInfo.url,
                    type: videoInfo.extension,
                    startPosition: videoInfo.startTime,
                    headers: {
                        Referer: videoInfo.referer,
                        'Cookie': videoInfo.cookies,
                        'User-Agent': videoInfo.userAgent
                    },
                    bufferConfig: {
                        minBufferMs: 30000,
                        maxBufferMs: 60000,
                        bufferForPlaybackMs: 5000,
                        bufferForPlaybackAfterRebufferMs: 8000,
                    }
                }}
                onLoad={handleLoad}
                onError={(error) => console.log("ExoPlayer error:", error.error)}
                onBuffer={({ isBuffering }) => console.log(isBuffering ? "Buffering..." : "Playing")}
                progressUpdateInterval={1 * 1000}
                onProgress={handleProgress}
                onEnd={handleEnd}
                style={{width: '100%', height: '100%'}}
                controls={true}
                resizeMode='contain'
                reportBandwidth={true}
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