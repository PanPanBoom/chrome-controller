import { View } from "react-native"
import { CustomTitle } from "./CustomTitle"
import { CustomText } from "./CustomText"
import { Button } from "./Button"
import { Captions, FastForward, FileVolume, Pause, Play, Rewind } from "lucide-react-native"
import { colors } from "../constants"
import { useState } from "react"
import { usePlayerRemote } from "../hooks/usePlayerRemote"
import { useAutoHide } from "../hooks/useAutoHide"
import LinearGradient from "react-native-linear-gradient"
import { MenuButton } from "./MenuButton"
import { AudioTrack } from "react-native-video"
import { AudioTracksWidget } from "./AudioTracksWidget"
import { SubtitlesTracksWidget, SubtitlesTracksWidgetProps } from "./SubtitlesTracksWidget"
import { MenuButtonGroup } from "./MenuButtonGroup"

type VideoPlayerControlsProps = {
    title: string;
    episodeInfo?: {
        season: number;
        episode: number;
    },
    duration: number;
    currentTime: number;
    videoRef: React.RefObject<any>;
    audioTracks: AudioTrack[];
    onSelectAudioTrack?: (track: AudioTrack) => void;
    subtitles: SubtitlesTracksWidgetProps['subtitles'];
    onSelectSubtitle?: (subtitle: SubtitlesTracksWidgetProps['subtitles'][number]) => void;
    selectedSubtitle?: SubtitlesTracksWidgetProps['subtitles'][number];
}

const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours > 0 ? `${hours}:` : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export const VideoPlayerControls = (props: VideoPlayerControlsProps) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const { visible } = useAutoHide(5000, !isPlaying);

    const buttonGroupDescription = [
        {
            icon: FileVolume,
            widget: <AudioTracksWidget audioTracks={props.audioTracks} onSelectTrack={props.onSelectAudioTrack} />,
            disabled: props.audioTracks.length <= 1
        },
        {
            icon: Captions,
            widget: <SubtitlesTracksWidget subtitles={props.subtitles} selectedSubtitle={props.selectedSubtitle} onSelectSubtitle={props.onSelectSubtitle}/>,
            disabled: props.subtitles.length === 0
        }
    ]

    const handlePlayPause = () => {
        if (props.videoRef.current) {
            if (isPlaying) {
                props.videoRef.current.pause();
            } else {
                props.videoRef.current.resume();
            }
        }

        setIsPlaying(!isPlaying);
    }

    const handleSeek = (seconds: number) => {
        if (props.videoRef.current) {
            const newTime = props.currentTime + seconds;
            props.videoRef.current.seek(newTime);
        }
    }

    usePlayerRemote({
        onTogglePlay: handlePlayPause,
        onSeek: handleSeek
    });

    if(!visible)
        return null;

    return (
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} className="absolute bottom-0 left-0 right-0 py-6 px-14 gap-4">
            <View>
                <View className="flex-row justify-between items-end">
                    <View>
                        <CustomTitle className="text-5xl leading-snug" adjustsFontSizeToFit>{props.title}</CustomTitle>
                        {
                            props.episodeInfo &&
                            <CustomText className="text-secondary">
                                {props.episodeInfo ? `Saison ${props.episodeInfo.season} - Episode ${props.episodeInfo.episode}` : "Informations sur l'épisode"}
                            </CustomText>
                        }
                    </View>
                    <CustomText className="text-secondary">
                        {formatTime(props.currentTime)} / {formatTime(props.duration)}
                    </CustomText>
                </View>
            </View>
            <View className="bg-secondary rounded-full h-2 flex-row">
                <View className="bg-primary rounded-full relative" style={{ width: `${(props.currentTime / props.duration) * 100}%` }}>
                    <View className="absolute right-0 top-1/2 w-0 items-center justify-center">
                        <View className="w-4 rounded-full aspect-square bg-white -translate-y-1/2" />
                    </View>
                </View>
            </View>
            <View className="flex-row items-center justify-center relative">
                <View className="flex-row items-center gap-6">
                    <Button onFocusClassName="bg-secondary" className="bg-secondary/50 rounded-full p-4 aspect-square justify-center items-center" onPress={() => handleSeek(-10)}>
                        <Rewind color={colors.text} />
                    </Button>
                    <Button onFocusClassName="bg-primary" onFocusStyle={{ boxShadow: [{offsetX: 0, offsetY: 0, blurRadius: 24, spreadDistance: 4, color: colors.primary}]}} className="bg-primary/50 rounded-full p-6" style={{outlineColor: colors.text, outlineWidth: 3, outlineOffset: 5}} hasTVPreferredFocus={true} onPress={handlePlayPause}>
                        {isPlaying ? <Pause color={colors.text} size={40}/> : <Play color={colors.text} size={40} />}
                    </Button>
                    <Button onFocusClassName="bg-secondary" className="bg-secondary/50 rounded-full p-4 aspect-square justify-center items-center" onPress={() => handleSeek(10)}>
                        <FastForward color={colors.text} />
                    </Button>
                </View>
                <MenuButtonGroup 
                    className="absolute right-0 gap-6 flex-row"
                    buttonsClassName="bg-secondary/50 rounded-full p-4 aspect-square justify-center items-center"
                    buttonsFocusClassName="bg-secondary"
                    buttons={buttonGroupDescription}
                />
            </View>
        </LinearGradient>
    )
}