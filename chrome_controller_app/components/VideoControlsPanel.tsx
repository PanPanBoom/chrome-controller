import { colors } from "@/constants/colors";
import { cn } from "@/etc/utils";
import { FastForward, Play, Rewind } from "lucide-react-native"
import { Pressable, View, ViewProps } from "react-native"
import { IconButton } from "./ui/IconButton";

export const VideoControlsPanel = ({className, ...props}: ViewProps) => {
    const buttonsStyle = "bg-background-light flex-1 justify-center items-center active:bg-background-hover h-full rounded-none aspect-auto";
    const iconColor = colors.text;
    
    return (
        <View className={cn("flex-row justify-center items-center", className)}>
            <IconButton icon={Rewind} color={iconColor} className={cn(buttonsStyle, "rounded-l-full")} />
            <IconButton icon={Play} color={iconColor} className={buttonsStyle} />
            <IconButton icon={FastForward} color={iconColor} className={cn(buttonsStyle, "rounded-r-full")} />
        </View>
    )
}