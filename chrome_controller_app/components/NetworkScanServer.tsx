import { colors } from "@/constants/colors"
import { ServerDataDTO } from "@/dtos/serverData"
import { Computer } from "lucide-react-native"
import { Animated, Image, Pressable, useAnimatedValue, ViewProps } from "react-native"
import { CustomText } from "./ui/CustomText"
import { useEffect } from "react"
import { cn } from "@/etc/utils"

type NetworkScanServer = ViewProps & {
    server: ServerDataDTO;
}

export const NetworkScanServer = ({className, ...props}: NetworkScanServer) => {
    const fadeAnimation = useAnimatedValue(0);

    useEffect(() => {
        Animated.timing(fadeAnimation, {
            toValue: 100,
            duration: 6000,
            useNativeDriver: true
        }).start();
    }, [])

    return (
        <Animated.View {...props} className={cn("absolute w-[13%] left-50 top-10", className)} style={{opacity: fadeAnimation.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 100]
        })}}>
            <Pressable className="flex-1 justify-center items-center active:saturate-50">
                {/* <Computer color={colors.text} size={20} strokeWidth={1} fill={colors.secondary} /> */}
                <Image source={{uri: props.server.serverData.img}} className="w-full aspect-square rounded-full border border-secondary"/>
                <CustomText className="text-xs">{props.server.serverData.name}</CustomText>
            </Pressable>
        </Animated.View>
    )
}