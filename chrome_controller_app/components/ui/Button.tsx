import { Pressable } from "react-native";

type ButtonProps = {
    children?: React.ReactNode;
    className?: string;
    onPressOut?: () => void;
    onLongPress?: () => void;
}

export const Button = (props: ButtonProps) => {
    return (
        <Pressable className={`p-3 flex justify-center items-center bg-secondary rounded-xl active:bg-neutral-300 ${props.className != undefined ? props.className : ""}`} onPressOut={props.onPressOut} onLongPress={props.onLongPress}>
            {props.children}
        </Pressable>
    )
}