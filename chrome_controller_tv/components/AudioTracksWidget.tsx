import { View } from "react-native"
import { AudioTrack } from "react-native-video"
import { CustomText } from "./CustomText"
import { Button } from "./Button"
import { Check } from "lucide-react-native"

type AudioTracksWidgetProps = {
    audioTracks: AudioTrack[];
    onSelectTrack?: (track: AudioTrack) => void;
    selectedTrack?: AudioTrack;
}

export const AudioTracksWidget = (props: AudioTracksWidgetProps) => {
    const isSelected = (track: AudioTrack) => props.selectedTrack === track;

    return (
        <>
            {props.audioTracks?.map((track, index) => (
                <Button key={index} className="p-2 justify-between flex-row shadow-none" onFocusClassName="bg-background-hover/30" hasTVPreferredFocus={isSelected(track)} onPress={() => props.onSelectTrack?.(track)}>
                    <CustomText className="text-black">{track.title || `Track ${index + 1}`}</CustomText>
                    {
                        isSelected(track) &&
                        <Check color="black" />
                    }
                </Button>
            ))}
        </>
    )
}