import { colors } from "@/constants/colors";
import { cn } from "@/etc/utils";
import { FastForward, Play, Rewind } from "lucide-react-native"
import { Pressable, View, ViewProps } from "react-native"

export const VideoControlsPanel = ({className, ...props}: ViewProps) => {
    const buttonsStyle = "bg-background-light flex-1 justify-center items-center active:bg-background-hover h-full";
    const iconColor = colors.text;
    
    return (
        <View className={cn("flex-row justify-center items-center", className)}>
            <Pressable className={cn(buttonsStyle, "rounded-l-full")}>
                <Rewind color={iconColor}/>
            </Pressable>
            <Pressable className={buttonsStyle}>
                <Play color={iconColor}/>
            </Pressable>
            <Pressable className={cn(buttonsStyle, "rounded-r-full")}>
                <FastForward color={iconColor}/>
            </Pressable>
        </View>
    )
}