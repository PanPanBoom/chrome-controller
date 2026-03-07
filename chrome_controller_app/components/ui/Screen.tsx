import { cn } from "@/etc/utils";
import { View, ViewProps } from "react-native";

export const Screen = ({className, ...props}: ViewProps) => {
    return (
        <View className={cn("px-8 py-4 bg-background flex-1", className)} {...props}>
            {props.children}
        </View>
    )
}