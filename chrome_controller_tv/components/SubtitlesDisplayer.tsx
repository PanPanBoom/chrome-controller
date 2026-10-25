import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { CustomText } from "./CustomText";
import { cn } from "../etc/utils";
import { ISO639_1 } from "react-native-video";

export type Subtitles = {
    id: string;
    title: string;
    language: ISO639_1;
    url: string;
};

type SubtitlesDisplayerProps = {
    subtitles: Subtitles | null;
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

    const parseSubtitleStyle = (raw: string) => {
        const segments: { text: string, style: any }[] = [];
        const stack: { name: string, style: any}[] = [];
        let lastIndex = 0;

        const currentStyle = () => Object.assign({}, ...stack.map(s => s.style));

        const pushText = (text: string) => {
            if(text)
                segments.push({ text, style: currentStyle() });
        };

        for(const match of raw.matchAll(/<\/?(i|b|u|font)(?:\s+[^>]*)?>|<[^>]*>|\{\\[^}]*\}/gi))
        {
            pushText(raw.slice(lastIndex, match.index));
            lastIndex = match.index + match[0].length;

            const tag = match[0];
            const name = match[1]?.toLowerCase();

            if(!name)
                continue;

            if(tag.startsWith('</'))
            {
                const i = stack.map(s => s.name).lastIndexOf(name);
                if(i !== -1)
                    stack.splice(i, 1);
                
                continue;
            }

            let style = {};
            if (name === 'i')
                style = { fontStyle: 'italic' };
            else if(name === 'b')
                style = { fontWeight: 'bold' };
            else if(name === 'u')
                style = { textDecorationLine: 'underline' };
            else if(name === 'font')
            {
                const color = tag.match(/color\s*=\s*["']?(#[0-9a-f]{3,8}|[a-z]+)["']?/i)?.[1];
                if(color)
                    style = { color };
            }

            stack.push({ name, style });
        }

        pushText(raw.slice(lastIndex));
        return segments;
    }

    const currentSubtitle = currentSubtitleIndex !== null ? parsedSubtitles?.[currentSubtitleIndex] ?? null : null;

    const segments = useMemo(() => currentSubtitle ? parseSubtitleStyle(currentSubtitle.text) : [], [currentSubtitleIndex]);
    
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

    if(!currentSubtitle)
        return null;

    return (
        <View pointerEvents="none" className={cn("items-center", props.className)}>
            <View className="p-1 bg-black/50 max-w-full">
                <CustomText className={cn("text-white text-center text-2xl", currentSubtitle.styles)}>
                    {
                        segments.map((seg, index) => 
                            <CustomText key={index} style={seg.style}>{seg.text}</CustomText>
                        )
                    }
                </CustomText>
            </View>
        </View>
    )
}