import { View } from "react-native"
import { AudioTrack } from "react-native-video"
import { CustomText } from "./CustomText"
import { Button } from "./Button"
import { Check } from "lucide-react-native"

type AudioTracksWidgetProps = {
    audioTracks: AudioTrack[];
    onSelectTrack?: (track: AudioTrack) => void;
}

export const AudioTracksWidget = (props: AudioTracksWidgetProps) => {
    return (
        <>
            {props.audioTracks?.map((track, index) => (
                <Button key={index} className="p-2 justify-between flex-row shadow-none" onFocusStyle="bg-background-hover/30" hasTVPreferredFocus={track.selected} onPress={() => props.onSelectTrack?.(track)}>
                    <CustomText className="text-black">{track.title || `Track ${index + 1}`}</CustomText>
                    {
                        track.selected &&
                        <Check color="black" />
                    }
                </Button>
            ))}
        </>
    )
}