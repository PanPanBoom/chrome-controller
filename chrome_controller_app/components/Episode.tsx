import { View, Image, Pressable, Animated, Dimensions, ActivityIndicator } from "react-native";
import { CustomText } from "./ui/CustomText";
import { CustomTitle } from "./ui/CustomTitle";
import { useContext, useRef, useState } from "react";
import { ChevronRight } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { cn } from "@/etc/utils";
import { Button } from "./ui/Button";
import { sendShowCast } from "@/server/socket";
import { AppContext } from "@/contexts/appContext";
import { WatchButton } from "./WatchButton";

type EpisodeProps = {
    episode: {
        id: number;
        title: string;
        overview: string;
        img: string;
        air_date: string;
        episode_number: number;
        runtime: number;
        season_number: number;
    },
    showId: string;
}

const AnimatedChevron = Animated.createAnimatedComponent(ChevronRight);

export const Episode = (props: EpisodeProps) => {
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const expandAnimation = useRef(new Animated.Value(0)).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current;

    const handlePress = () => {
        Animated.parallel([
            Animated.timing(expandAnimation, {
                toValue: expanded ? 0 : contentHeight + 16,
                useNativeDriver: false
            }),
            Animated.timing(rotateAnimation, {
                toValue: expanded ? 0 : 1,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();
        setExpanded(prev => !prev)
    }

    const spin = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });

    return (
        <Pressable 
            className={cn("flex-row gap-4 rounded-xl items-center p-2", expanded && "bg-background-light")} 
            onPress={handlePress}
        >
            <View className="w-1/3 aspect-[16/9] rounded-xl overflow-hidden self-stretch">
                <Image source={{uri: props.episode.img}} className="w-full aspect-[16/9]" />
            </View>
            <View className="flex-1">
                <CustomTitle className="text-lg" numberOfLines={expanded ? 2 : 1}>{props.episode.episode_number}. {props.episode.title}</CustomTitle>
                <Animated.View style={{ height: contentHeight === 0 ? undefined : expandAnimation, overflow: 'hidden' }}>
                    <View className="flex gap-2" onLayout={e => {
                        if (contentHeight === 0) {
                            setContentHeight(e.nativeEvent.layout.height)
                            expandAnimation.setValue(0)
                        }
                    }}>
                        <CustomText className="text-xs text-secondary">{props.episode.runtime}min</CustomText>
                        <CustomText className="text-sm text-justify">{props.episode.overview}</CustomText>
                        <WatchButton showId={props.showId} episodeInfo={{ season: props.episode.season_number, episode: props.episode.episode_number }} shouldCheck={expanded}/>
                    </View>
                </Animated.View>
            </View>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <ChevronRight color={colors.text} />
            </Animated.View>
        </Pressable>
    )
}