import { useState } from "react";
import { Button, ButtonProps } from "./Button"
import { cn } from "../etc/utils";
import { GestureResponderEvent, View } from "react-native";

type MenuButtonProps = ButtonProps & {
    widget: React.ReactNode;
    containerClassName?: string;
    expanded?: boolean;
}

export const MenuButton = ({children, widget, containerClassName, onPress, expanded: expandedProp, ...props}: MenuButtonProps) => {
    const [internalExpanded, setInternalExpanded] = useState(false);

    const isControlled = expandedProp !== undefined;
    const expanded = isControlled ? expandedProp : internalExpanded;

    const handlePress = (e: GestureResponderEvent) => {
        if(!isControlled)
            setInternalExpanded(!internalExpanded);
        
        onPress?.(e);
    }

    return (
        <View className={cn("relative", containerClassName)}>
            <Button onPress={handlePress} {...props}>
                {children}
            </Button>
            {
                expanded &&
                <View className="absolute bottom-full right-0 mb-2 w-64 rounded-xl border border-gray-300 bg-secondary p-2 shadow-lg">
                    {widget}
                </View>
            }
        </View>
    )
}