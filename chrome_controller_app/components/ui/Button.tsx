import { Pressable } from "react-native";

type ButtonProps = {
    children: React.ReactNode;
    className?: string;
}

export const Button = (props: ButtonProps) => {
    return (
        <Pressable className={`p-3 bg-neutral-200 rounded-xl active:bg-neutral-300 ${props.className != undefined ? props.className : ""}`}>
            {props.children}
        </Pressable>
    )
}