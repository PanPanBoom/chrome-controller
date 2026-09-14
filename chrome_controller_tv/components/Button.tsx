import { useState } from "react";
import { Pressable, PressableProps, View } from "react-native"

type ButtonProps = PressableProps & {
    children: React.ReactNode;
}

export const Button = ({children, className, ...props}: ButtonProps) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <Pressable
            {...props}
            className={`${isFocused ? 'bg-primary' : 'bg-primary/50'} rounded-xl py-2 px-6 shadow ${className}`}
            focusable={true}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        >
            {children}
        </Pressable>
    )
};