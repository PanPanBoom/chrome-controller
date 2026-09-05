import { cn } from "@/etc/utils";
import { useEffect, useState } from "react";
import { GestureResponderEvent, Pressable, PressableProps } from "react-native";

export const Button = ({className, onPressIn, onPressOut, style, ...props}: PressableProps) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = (e: GestureResponderEvent) => {
        setIsPressed(true);
        console.log('onPressIn type:', typeof onPressIn, onPressIn);
        onPressIn?.(e);
    }

    const handlePressOut = (e: GestureResponderEvent) => {
        setIsPressed(false);
        onPressOut?.(e);
    }

    return (
        <Pressable 
            className={cn("p-3 flex justify-center items-center bg-background-light rounded-xl", className)}
            {...props}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[{opacity: isPressed || props.disabled ? 0.5 : 1}, style as any]}
        >
            {props.children}
        </Pressable>
    )
}