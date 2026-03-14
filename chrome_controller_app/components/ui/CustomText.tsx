import { cn } from "@/etc/utils";
import { Text, TextProps } from "react-native";

export const CustomText = ({className, style, ...props}: TextProps) => {
    return (
        <Text style={[{fontFamily: 'Satoshi'}, style]} className={cn("text-text", className)} {...props}>
            {props.children}
        </Text>
    )
}