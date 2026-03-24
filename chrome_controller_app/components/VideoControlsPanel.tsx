import { colors } from "@/constants/colors";
import { cn } from "@/etc/utils";
import { FastForward, Pause, Play, Rewind } from "lucide-react-native"
import { Pressable, View, ViewProps } from "react-native"
import { IconButton } from "./ui/IconButton";
import { useContext, useEffect, useState } from "react";
import { sendForward, sendPlayPause, sendRewind, socket } from "@/server/socket";
import { AppContext } from "@/contexts/appContext";

export const VideoControlsPanel = ({className, ...props}: ViewProps) => {
    const { server } = useContext(AppContext);
    
    const [isDisabled, setIsDisabled] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const buttonsStyle = "bg-background-light flex-1 justify-center items-center active:bg-background-hover h-full rounded-none aspect-auto";
    const iconColor = colors.text;

    useEffect(() => {
        socket.on('videoEnabled', () => setIsDisabled(false));
        socket.on('videoDisabled', () => setIsDisabled(true));
    }, []);

    const handlePlayPauseClick = () => {
        sendPlayPause(server.ip).then(() => setIsPaused(prev => !prev));
    }
    
    return (
        <View className={cn("flex-row justify-center items-center", className)}>
            <IconButton icon={Rewind} color={iconColor} className={cn(buttonsStyle, "rounded-l-full")} onPress={() => sendRewind(server.ip)} disabled={isDisabled} />
            <IconButton icon={isPaused ? Pause : Play} color={iconColor} className={buttonsStyle} onPress={handlePlayPauseClick} disabled={isDisabled} />
            <IconButton icon={FastForward} color={iconColor} className={cn(buttonsStyle, "rounded-r-full")} onPress={() => sendForward(server.ip)} disabled={isDisabled} />
        </View>
    )
}