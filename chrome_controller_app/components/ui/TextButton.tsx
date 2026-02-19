import { Text } from "@react-navigation/elements"
import { Button } from "./Button"

type TextButtonProps = {
    children: string;
    onPressOut: () => void;
    className?: string;
}

export const TextButton = (props: TextButtonProps) => {
    return (
        <Button onPressOut={props.onPressOut} className={props.className}>
            <Text>{props.children}</Text>
        </Button>
    )
}