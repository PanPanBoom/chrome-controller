import { useEffect, useState } from "react";
import { SubtitlesTracksWidgetProps } from "./SubtitlesTracksWidget";
import { View } from "react-native";
import { CustomText } from "./CustomText";
import { cn } from "../etc/utils";

type SubtitlesDisplayerProps = {
    subtitles: SubtitlesTracksWidgetProps['subtitles'][number] | null;
    progress: number;
    serverIp: string;
    className?: string;
}

export const SubtitlesDisplayer = (props: SubtitlesDisplayerProps) => {
    const [parsedSubtitles, setParsedSubtitles] = useState<{
        identifier: string;
        start: number;
        end: number;
        text: string;
        styles: string;
    }[] | null>(null);

    const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number | null>(null);
    
    useEffect(() => {
        if(props.subtitles === null || props.subtitles?.url?.length === 0)
        {
            setParsedSubtitles(null);
            return;
        }
        
        fetch(`${props.serverIp}/extension/proxy-subtitles?url=${encodeURIComponent(props?.subtitles?.url)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => setParsedSubtitles(data));
    }, [props.subtitles]);

    useEffect(() => {
        if(parsedSubtitles === null || parsedSubtitles.length === 0)
            return;

        const currentIndex = parsedSubtitles.findIndex(subtitle => props.progress >= subtitle.start && props.progress <= subtitle.end);
        setCurrentSubtitleIndex(currentIndex > 0 ? currentIndex : null);
    }, [props.progress, parsedSubtitles]);

    if(parsedSubtitles === null || parsedSubtitles.length === 0 || currentSubtitleIndex === null || currentSubtitleIndex < 0 || currentSubtitleIndex >= parsedSubtitles.length)
        return null;

    return (
        <View pointerEvents="none" className={cn("items-center", props.className)}>
            <View className="p-1 bg-black/50 max-w-full">
                {
                    parsedSubtitles[currentSubtitleIndex].text.split('\n').map((line, index) => 
                        <CustomText key={index} className={cn("text-white text-center text-2xl", parsedSubtitles[currentSubtitleIndex].styles)}>{line}</CustomText>
                    )
                }
            </View>
        </View>
    )
}