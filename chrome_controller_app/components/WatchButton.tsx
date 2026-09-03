import { ActivityIndicator, PressableProps, ViewProps } from "react-native";
import { Button } from "./ui/Button";
import { useContext, useEffect, useState } from "react";
import { isShowAvailable, sendShowCast } from "@/server/socket";
import { AppContext } from "@/contexts/appContext";
import { Ban, Play } from "lucide-react-native";
import { CustomText } from "./ui/CustomText";
import { colors } from "@/constants/colors";
import { cn } from "@/etc/utils";

type WatchButtonProps = ViewProps & {
    showId: string;
    episodeInfo?: {
        season: number;
        episode: number;
    };
    nextStartTime?: number;
    shouldCheck?: boolean;
}

export const WatchButton = ({ showId, episodeInfo, nextStartTime = 0, shouldCheck = true, className, ...props }: WatchButtonProps) => {
    const { server } = useContext(AppContext);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

    useEffect(() => {
        if(shouldCheck)
            isShowAvailable(server.ip, showId, episodeInfo)
            .then(res => res.json())
            .then(data => setIsAvailable(data));
    }, [shouldCheck]);

    console.log(nextStartTime);

    return (
        <Button disabled={isAvailable === null || isAvailable === false} className={cn("bg-primary flex-row gap-2 rounded-full", className)} onPress={() => sendShowCast(server.ip, 'tmdb', showId, episodeInfo, nextStartTime ?? 0)} {...props}>
            {
                isAvailable === null ?
                <ActivityIndicator /> :
                (
                    isAvailable === false ?
                    <Ban color={colors.background} size={20}/> :
                    <Play color={colors.background} fill={colors.background} size={20}/>
                )
            }
            <CustomText className="text-background text-lg">
                {
                    isAvailable === false ?
                    "Indisponible" :
                    `${nextStartTime ?
                    "Reprendre" :
                    "Regarder"} ${showId.includes('tv') ? `S${episodeInfo?.season ?? 1}:E${episodeInfo?.episode ?? 1}` : ''}`
                }
            </CustomText>
        </Button>
    )
}