import { ISO639_1 } from "react-native-video";
import { Button } from "./Button";
import { CustomText } from "./CustomText";
import { useState } from "react";
import { Check } from "lucide-react-native";

export type SubtitlesTracksWidgetProps = {
    subtitles: {
        id: string;
        display: string;
        language: ISO639_1;
        release: string;
        url: string;
    }[];
    onSelectSubtitle?: (subtitle: SubtitlesTracksWidgetProps['subtitles'][number]) => void;
    selectedSubtitle?: SubtitlesTracksWidgetProps['subtitles'][number];
}

export const SubtitlesTracksWidget = (props: SubtitlesTracksWidgetProps) => {
    const isSelected = (subtitle: SubtitlesTracksWidgetProps['subtitles'][number], index: number) => (props.selectedSubtitle?.id === subtitle.id || (props.selectedSubtitle === undefined && index === 0))
    return (
        <>
            {
                props.subtitles?.map((subtitle, index) => (
                    <Button key={subtitle.id} className="p-2 justify-between flex-row shadow-none" onFocusClassName="bg-background-hover/30" onPress={() => props.onSelectSubtitle?.(subtitle)} hasTVPreferredFocus={isSelected(subtitle, index)}>
                        <CustomText numberOfLines={1} className="text-black flex-1" style={{marginRight: 40}}>{subtitle.display} { subtitle?.release?.length > 0 ? `(${subtitle.release})` : '' }</CustomText>
                        {isSelected(subtitle, index) && <Check color="black"/>}
                    </Button>
                ))
            }
        </>
    )
}