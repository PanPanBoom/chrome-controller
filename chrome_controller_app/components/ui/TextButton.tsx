import { Text } from "@react-navigation/elements"
import { Button } from "./Button"
import { PressableProps } from "react-native";
import { cn } from "@/etc/utils";
import { CustomText } from "./CustomText";
import { colors } from "@/constants/colors";

export type TextButtonProps = PressableProps & {
    children: string;
    textClassName?: string;
}

export const TextButton = ({className, ...props}: TextButtonProps) => {
    return (
        <Button className={cn("rounded-full aspect-square p-3", className)} {...props}>
            <CustomText numberOfLines={1} className={cn("text-sm text-secondary", props.textClassName)}>{props.children}</CustomText>
        </Button>
    )
}