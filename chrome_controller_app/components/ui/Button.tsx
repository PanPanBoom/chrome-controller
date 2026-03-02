import { cn } from "@/etc/utils";
import { Pressable, PressableProps } from "react-native";

export const Button = ({className, ...props}: PressableProps) => {
    return (
        <Pressable className={cn("p-3 flex justify-center items-center active:bg-background-hover bg-background-light rounded-xl", className)} {...props}>
            {props.children}
        </Pressable>
    )
}