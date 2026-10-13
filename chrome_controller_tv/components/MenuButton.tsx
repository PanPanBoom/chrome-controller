import { useState } from "react";
import { Button, ButtonProps } from "./Button"
import { cn } from "../etc/utils";
import { View } from "react-native";

type MenuButtonProps = Omit<ButtonProps, 'onPress'> & {
    widget: React.ReactNode;
    containerClassName?: string
}

export const MenuButton = ({children, widget, containerClassName, ...props}: MenuButtonProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View className={cn("relative", containerClassName)}>
            <Button onPress={() => setExpanded(!expanded)} {...props}>
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