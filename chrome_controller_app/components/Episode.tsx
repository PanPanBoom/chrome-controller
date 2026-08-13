import { View, Image, Pressable, Animated, Dimensions, ActivityIndicator } from "react-native";
import { CustomText } from "./ui/CustomText";
import { CustomTitle } from "./ui/CustomTitle";
import { useContext, useRef, useState } from "react";
import { ChevronRight } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { cn } from "@/etc/utils";
import { Button } from "./ui/Button";
import { sendEpisodeLaunch } from "@/server/socket";
import { AppContext } from "@/contexts/appContext";

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
    const { server } = useContext(AppContext);
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [loading, setLoading] = useState(false);
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
            <View className="w-1/3 aspect-[16/9] rounded-xl overflow-hidden">
                <Image source={{uri: props.episode.img}} className="w-full aspect-[16/9]" />
            </View>
            <View className="flex-1">
                <CustomTitle className="text-lg">{props.episode.episode_number}. {props.episode.title}</CustomTitle>
                <Animated.View style={{ height: contentHeight === 0 ? undefined : expandAnimation, overflow: 'hidden' }}>
                    <View className="flex gap-2" onLayout={e => {
                        if (contentHeight === 0) {
                            setContentHeight(e.nativeEvent.layout.height)
                            expandAnimation.setValue(0)
                        }
                    }}>
                        <CustomText className="text-xs text-secondary">{props.episode.runtime}min</CustomText>
                        <CustomText className="text-sm text-justify">{props.episode.overview}</CustomText>
                        <Button className="bg-primary flex-row gap-4" disabled={loading} onPress={() => {
                            setLoading(true);
                            sendEpisodeLaunch(server.ip, props.showId, props.episode.season_number, props.episode.episode_number).finally(() => setLoading(false));
                        }}>
                            {loading && <ActivityIndicator />}
                            <CustomText>Regarder</CustomText>
                        </Button>
                    </View>
                </Animated.View>
            </View>
            <AnimatedChevron style={{ transform: [{ rotate: spin }] }} color={colors.text} />
        </Pressable>
    )
}