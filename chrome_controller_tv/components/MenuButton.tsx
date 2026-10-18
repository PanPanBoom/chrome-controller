import { useEffect, useRef, useState } from "react";
import { Button, ButtonProps } from "./Button"
import { cn } from "../etc/utils";
import { BackHandler, GestureResponderEvent, Pressable, ScrollView, View } from "react-native";

type MenuButtonProps = ButtonProps & {
    widget: React.ReactNode | ((api: { close: () => void }) => React.ReactNode);
    containerClassName?: string;
    expanded?: boolean;
    onClose?: () => void;
}

export const MenuButton = ({children, widget, containerClassName, onPress, expanded: expandedProp, onFocus, onBlur, onClose, ...props}: MenuButtonProps) => {
    const [internalExpanded, setInternalExpanded] = useState(false);
    const [buttonFocused, setButtonFocused] = useState(false);
    const buttonRef = useRef<View>(null);

    const isControlled = expandedProp !== undefined;
    const expanded = isControlled ? expandedProp : internalExpanded;

    const handlePress = (e: GestureResponderEvent) => {
        if(!isControlled)
            setInternalExpanded(!internalExpanded);
        
        onPress?.(e);
    }

    const close = () => {
        if(!isControlled)
            setInternalExpanded(false);

        onClose?.();
        buttonRef.current?.requestTVFocus();
    }

    useEffect(() => {
        if(!expanded)
            return;

        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            close();
            return true;
        });

        return () => sub.remove();
    }, [expanded]);

    return (
        <View className={cn("relative", containerClassName)}>
            <Button
                ref={buttonRef}
                onPress={handlePress} 
                onFocus={(e) => {
                    setButtonFocused(true);
                    onFocus?.(e);
                }} 
                onBlur={(e) => {
                    setButtonFocused(false);
                    onBlur?.(e);
                }} 
                {...props}>
                {children}
            </Button>
            {
                expanded &&
                <ScrollView className="absolute bottom-full right-0 mb-2 w-64 rounded-xl border border-gray-300 bg-secondary p-2 shadow-lg max-h-48">
                    {typeof widget === 'function' ? widget({ close }) : widget}
                    <Pressable 
                        focusable={!buttonFocused}
                        onFocus={() => buttonRef.current?.requestTVFocus?.()}
                        className="opacity-0 h-1"
                    />
                </ScrollView>
            }
        </View>
    )
}