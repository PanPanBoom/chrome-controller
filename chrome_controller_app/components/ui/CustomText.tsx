import { Text, TextProps } from "react-native";

export const CustomText = ({children, ...props}: TextProps) => {
    return (
        <Text style={{fontFamily: 'Satoshi'}} {...props}>{children}</Text>
    )
}