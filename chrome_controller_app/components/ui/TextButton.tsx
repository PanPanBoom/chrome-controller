import { Text } from "@react-navigation/elements"
import { Button } from "./Button"

type TextButtonProps = {
    children: string;
    onPressOut: () => void;
}

export const TextButton = (props: TextButtonProps) => {
    return (
        <Button onPressOut={props.onPressOut}>
            <Text>{props.children}</Text>
        </Button>
    )
}