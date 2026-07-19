import { useRef, useState } from "react";
import { Animated, PressableProps, View } from "react-native";
import { IconButton, IconButtonProps } from "./IconButton";

type ExpandableIconButtonProps = IconButtonProps & {
    children: React.ReactNode;
}

export const ExpandableIconButton = ({ children, ...props }: ExpandableIconButtonProps) => {

    const [expanded, setExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleExpand = () => {
        Animated.timing(animation, {
            toValue: expanded ? 0 : 1,
            useNativeDriver: false
        }).start();
        setExpanded(!expanded);
    }

    const height = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 200]
    });
    
    return (
        <Animated.View style={{ height, overflow: 'hidden' }} className='bg-background-light rounded-full'>
            <IconButton {...props} onPress={toggleExpand} />
            {
                expanded && 
                <View className='mx-4'>{children}</View>
            }
        </Animated.View>
    )
}