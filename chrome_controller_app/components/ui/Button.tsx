import { Pressable, PressableProps } from "react-native";

export const Button = ({className, ...props}: PressableProps) => {
    return (
        <Pressable className={`p-3 flex justify-center items-center active:bg-neutral-300 ${className != undefined ? className : "bg-background-light rounded-xl"}`} {...props}>
            {props.children}
        </Pressable>
    )
}