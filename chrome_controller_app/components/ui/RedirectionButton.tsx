import { ChevronDown, ChevronRight, Computer, LucideIcon } from "lucide-react-native"
import { Button } from "./Button"
import { colors } from "@/constants/colors"
import { CustomText } from "./CustomText"
import { ActivityIndicator, Animated, Dimensions, Image, PressableProps, View } from "react-native"
import { cn } from "@/etc/utils"
import { useRef, useState } from "react"

type RedirectionButtonProps = PressableProps & 
    { 
        label: string;
        children: React.ReactNode;
        loading: boolean;
    } & (
        | {img: string; icon?: never}
        | {icon: LucideIcon; img?: never}
    )

export const RedirectionButton = ({className, style, children, ...props}: RedirectionButtonProps) => {
    const [expanded, setExpanded] = useState(false);
    const [listHeight, setListHeight] = useState(0);
    const buttonHeight = Dimensions.get('window').height * 0.05;
    const expandAnimation = useRef(new Animated.Value(buttonHeight)).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current;

    const toggleExpand = () => {
        Animated.parallel([
            Animated.spring(expandAnimation, {
                toValue: expanded ? buttonHeight : buttonHeight + listHeight + 10,
                useNativeDriver: false
            }),
            Animated.timing(rotateAnimation, {
                toValue: expanded ? 0 : 1,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();

        setExpanded(!expanded);
    }

    const spin = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });

    const iconSize = 20;

    return (
        <Animated.View style={{ height: expandAnimation, overflow: 'hidden' }} className={cn('bg-background-light rounded-2xl', className)}>
            <Button onPress={toggleExpand} className="flex-row rounded-2xl gap-2 p-1" style={[{ height: buttonHeight }, style as any]} {...props}>
                {
                    props.icon &&
                    <Computer color={colors.text} size={iconSize}/> 
                }
                {
                    props.img &&
                    <Image source={{ uri: props.img }} className="aspect-square rounded-full" style={{width: "20%"}}/>
                }
                { 
                    props.loading ?
                    <ActivityIndicator /> :
                    <CustomText className="text-lg">{props.label}</CustomText>
                }
                <Animated.View style={{ transform: [{ rotate: spin }]}}>
                    <ChevronRight color={colors.secondary} size={iconSize} />
                </Animated.View>
            </Button>
            <View className="mx-4" onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}>
                {children}
            </View>
        </Animated.View>
    )
}