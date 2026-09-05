import { colors } from "@/constants/colors";
import { cn } from "@/etc/utils";
import { FastForward, Pause, Play, Rewind } from "lucide-react-native"
import { Pressable, View, ViewProps } from "react-native"
import { IconButton } from "./ui/IconButton";
import { useContext, useEffect, useState } from "react";
import { getIsVideoEnabled, sendKeyPress, socket } from "@/server/socket";
import { AppContext } from "@/contexts/appContext";
import { RemoteContext } from "@/contexts/remoteContext";
import { useRemoteButton } from "@/hooks/useRemoteButton";

export const VideoControlsPanel = ({className, ...props}: ViewProps) => {
    const { server } = useContext(AppContext);
    const { commands } = useContext(RemoteContext);
    
    const [isDisabled, setIsDisabled] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const buttonsStyle = "bg-background-light flex-1 justify-center items-center active:bg-background-hover h-full rounded-none aspect-auto";
    const iconColor = colors.text;

    useEffect(() => {
        socket.on('videoEnabled', () => {
            setIsDisabled(false);
            setIsPaused(false);
        });
        socket.on('videoDisabled', () => setIsDisabled(true));

        getIsVideoEnabled(server.ip);
    }, []);

    const handlePlayPauseClick = () => {
        sendKeyPress(server.ip, commands.videoControls.playPause, commands?.directions?.shortPress).then(() => setIsPaused(prev => !prev));
    }

    const rewindButton = useRemoteButton(server.ip, commands.videoControls.rewind, commands.directions);
    const forwardButton = useRemoteButton(server.ip, commands.videoControls.forward, commands.directions);
    
    return (
        <View className={cn("flex-row justify-center items-center", className)}>
            <IconButton icon={Rewind} color={iconColor} className={cn(buttonsStyle, "rounded-l-full")} {...rewindButton} disabled={isDisabled} />
            <IconButton icon={isPaused ? Play : Pause} color={iconColor} className={buttonsStyle} onPress={handlePlayPauseClick} disabled={isDisabled} />
            <IconButton icon={FastForward} color={iconColor} className={cn(buttonsStyle, "rounded-r-full")} {...forwardButton} disabled={isDisabled} />
        </View>
    )
}