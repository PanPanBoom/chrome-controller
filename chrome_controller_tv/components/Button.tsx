import { useState } from "react";
import { Pressable, PressableProps, View } from "react-native"
import { cn } from "../etc/utils";

export type ButtonProps = PressableProps & {
    children: React.ReactNode;
    onFocusStyle: string;
}

export const Button = ({children, className, ...props}: ButtonProps) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <Pressable
            {...props}
            className={cn("rounded-xl py-2 px-6 shadow", className, isFocused ? props.onFocusStyle : "")}
            focusable={true}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        >
            {children}
        </Pressable>
    )
};