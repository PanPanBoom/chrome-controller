import { ActivityIndicator, PressableProps, View, ViewProps } from "react-native";
import { Button } from "./ui/Button";
import { useContext, useEffect, useState } from "react";
import { isShowAvailable, sendShowCast } from "@/server/api";
import { AppContext } from "@/contexts/appContext";
import { Ban, ChevronDown, ChevronUp, Play } from "lucide-react-native";
import { CustomText } from "./ui/CustomText";
import { colors } from "@/constants/colors";
import { cn, parseFRDate } from "@/etc/utils";

type WatchButtonProps = ViewProps & {
    showId: string;
    episodeInfo?: {
        season: number;
        episode: number;
    };
    release_date?: string;
    nextStartTime?: number;
    shouldCheck?: boolean;
}

export const WatchButton = ({ showId, episodeInfo, nextStartTime = 0, shouldCheck = true, className, ...props }: WatchButtonProps) => {
    const { server } = useContext(AppContext);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [sources, setSources] = useState<{
        name: string,
        language: string
    }[]>([]);
    const [expand, setExpand] = useState(false);

    useEffect(() => {
        if(shouldCheck)
        {
            setIsAvailable(null);
            setSources([]);
            isShowAvailable(
                server.ip,
                (msg) => {
                    switch(msg.type)
                    {
                        case "availability":
                            setIsAvailable(msg.available);
                            break;

                        case "sources":
                            setSources(msg.sources);
                            break;

                        default:
                            console.log('Error fetching availability');
                            break;
                    }
                }, 
                showId, 
                episodeInfo
            );
        }
    }, [shouldCheck]);

    if(props.release_date && parseFRDate(props.release_date) > new Date())
        return null;

    return (
        <View className={cn("flex-row gap-[1px] z-50", className)}>
            <Button disabled={isAvailable === null || isAvailable === false} className="bg-primary flex-row gap-2 rounded-s-full flex-1" onPress={() => sendShowCast(server.ip, 'tmdb', showId, episodeInfo, nextStartTime ?? 0)} {...props}>
                {
                    isAvailable === null ?
                    <ActivityIndicator /> :
                    (
                        isAvailable === false ?
                        <Ban color={colors.background} size={20}/> :
                        <Play color={colors.background} fill={colors.background} size={20}/>
                    )
                }
                <CustomText numberOfLines={1} className="text-background text-lg">
                    {
                        isAvailable === false ?
                        "Indisponible" :
                        `${nextStartTime ?
                        "Reprendre" :
                        "Regarder"} ${showId.includes('tv') ? `S${episodeInfo?.season ?? 1}:E${episodeInfo?.episode ?? 1}` : ''}`
                    }
                </CustomText>
            </Button>
            <View className="relative">
                <Button className={cn("bg-primary rounded-none flex-1", expand ? 'rounded-tr-3xl' : 'rounded-e-full')} disabled={sources.length === 0} onPress={() => setExpand(!expand)}>
                    {
                        expand ?
                        <ChevronUp color={colors.background} /> :
                        <ChevronDown color={colors.background}/>
                    }
                </Button>
                {
                    expand &&
                    <View className="absolute bg-primary w-32 top-full right-0 p-2 rounded-b-2xl border-t border-background">
                        {
                            sources.map(source => 
                                <Button key={source.name + source.language} className="bg-transparent" onPress={() => sendShowCast(server.ip, 'tmdb', showId, episodeInfo, nextStartTime, source.name, source.language)}>
                                    <CustomText className="text-background">{source.name} ({source.language})</CustomText>
                                </Button>
                            )
                        }
                    </View>
                }
            </View>
        </View>
    )
}