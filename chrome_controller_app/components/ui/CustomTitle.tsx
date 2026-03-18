import { cn } from "@/etc/utils";
import { Text, TextProps } from "react-native";

export const CustomTitle = ({className, ...props}: TextProps) => <Text style={{fontFamily: 'Satoshi-Bold'}} className={cn("text-text text-2xl", className)} {...props}>{props.children}</Text>