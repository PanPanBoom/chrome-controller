import { ChevronRight, Computer, LucideIcon } from "lucide-react-native"
import { Button } from "./Button"
import { colors } from "@/constants/colors"
import { CustomText } from "./CustomText"
import { Animated, Dimensions, Image, PressableProps, View } from "react-native"
import { cn } from "@/etc/utils"
import { useRef, useState } from "react"

type RedirectionButtonProps = PressableProps & 
    { 
        label: string;
        children: React.ReactNode;
    } & (
        | {img: string; icon?: never}
        | {icon: LucideIcon; img?: never}
    )

export const RedirectionButton = ({className, style, children, ...props}: RedirectionButtonProps) => {
    const [expanded, setExpanded] = useState(false);
    const [listHeight, setListHeight] = useState(0);
    const buttonHeight = Dimensions.get('window').height * 0.05;
    const animation = useRef(new Animated.Value(buttonHeight)).current;

    const toggleExpand = () => {
        Animated.spring(animation, {
            toValue: expanded ? buttonHeight : buttonHeight + listHeight + 20,
            useNativeDriver: false
        }).start();
        setExpanded(!expanded);
    }

    const iconSize = 20;
    return (
        <Animated.View style={{ height: animation, overflow: 'hidden' }} className={cn('bg-background-light rounded-full', className)}>
            <Button onPress={toggleExpand} className="flex-row rounded-full gap-2 p-2" style={[{ height: buttonHeight }, style as any]} {...props}>
                {
                    props.icon &&
                    <Computer color={colors.text} size={iconSize}/> 
                }
                {
                    props.img &&
                    <Image source={{ uri: props.img }} className="aspect-square rounded-full" style={{width: "25%"}}/>
                }
                <CustomText className="text-lg">{props.label}</CustomText>
                <ChevronRight color={colors.secondary} size={iconSize}/>
            </Button>
            {
                expanded && 
                <View className="mx-4" onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}>
                    {children}
                </View>
            }
        </Animated.View>
    )
}