import { useState } from "react";
import { Pressable, PressableProps, StyleProp, View, ViewStyle } from "react-native"
import { cn } from "../etc/utils";
import { StyleSheet } from "react-native-css-interop";

export type ButtonProps = PressableProps & {
    children: React.ReactNode;
    onFocusClassName?: string;
    onFocusStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
}

export const Button = ({children, className, style, onFocusStyle, ...props}: ButtonProps) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <Pressable
            {...props}
            className={cn("rounded-xl py-2 px-6 shadow", className, isFocused && props.onFocusClassName, props.disabled && "opacity-50")}
            focusable={true}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[style, isFocused && onFocusStyle]}
        >
            {children}
        </Pressable>
    )
};