import React, { useState } from "react";
import { Pressable, PressableProps, StyleProp, View, ViewStyle } from "react-native"
import { cn } from "../etc/utils";
import { StyleSheet } from "react-native-css-interop";

export type ButtonProps = PressableProps & {
    children: React.ReactNode;
    onFocusClassName?: string;
    onFocusStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    ref?: React.Ref<View>;
}

export const Button = ({children, className, style, onFocusStyle, ref, onFocus, onBlur, ...props}: ButtonProps) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <Pressable
            {...props}
            ref={ref}
            className={cn("rounded-xl py-2 px-6 shadow", className, isFocused && props.onFocusClassName, props.disabled && "opacity-50")}
            focusable={true}
            onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
            }} 
            onBlur={(e) => {
                setIsFocused(false);
                onBlur?.(e);
            }} 
            style={[style, isFocused && onFocusStyle]}
        >
            {children}
        </Pressable>
    )
};