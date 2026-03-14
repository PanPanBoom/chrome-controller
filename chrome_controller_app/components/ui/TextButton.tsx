import { Text } from "@react-navigation/elements"
import { Button } from "./Button"
import { PressableProps } from "react-native";
import { cn } from "@/etc/utils";
import { CustomText } from "./CustomText";
import { colors } from "@/constants/colors";

type TextButtonProps = PressableProps & {
    children: string;
}

export const TextButton = ({className, ...props}: TextButtonProps) => {
    return (
        <Button className={cn("rounded-full aspect-square p-3", className)} {...props}>
            <CustomText className="text-sm text-secondary">{props.children}</CustomText>
        </Button>
    )
}