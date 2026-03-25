import { colors } from "@/constants/colors"
import { ServerDataDTO } from "@/dtos/serverData"
import { Computer } from "lucide-react-native"
import { Animated, Image, Pressable, PressableProps, StyleSheet, useAnimatedValue, ViewProps } from "react-native"
import { CustomText } from "./ui/CustomText"
import { useEffect } from "react"
import { cn } from "@/etc/utils"
import { router } from "expo-router"
import { Button } from "./ui/Button"

type NetworkScanServer = PressableProps & {
    server: ServerDataDTO;
}

export const NetworkScanServer = ({className, ...props}: NetworkScanServer) => {
    const fadeAnimation = useAnimatedValue(0);


    useEffect(() => {
        Animated.timing(fadeAnimation, {
            toValue: 100,
            duration: 2000,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <Button className={cn("absolute w-[13%] bg-transparent p-0 active:bg-transparent", className)} onPress={() => router.push({ pathname: '/modal', params: { server: JSON.stringify(props.server)} })} {...props}>
            <Animated.View className="flex-1 justify-center items-center" style={{opacity: fadeAnimation.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 1]
            })}}>
                {/* <Computer color={colors.text} size={20} strokeWidth={1} fill={colors.secondary} /> */}
                <Image source={{uri: props.server.serverData.img}} className="w-full aspect-square rounded-full border border-secondary"/>
                <CustomText className="text-xs">{props.server.serverData.name}</CustomText>
            </Animated.View>
        </Button>
    )
}