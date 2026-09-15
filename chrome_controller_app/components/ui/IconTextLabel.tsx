import { LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import { CustomText } from "./CustomText";
import { colors } from "@/constants/colors";

type IconTextLabelProps = {
    icon: LucideIcon;
    text: string;
}

export const IconTextLabel = (props: IconTextLabelProps) => {
    if(!props.text || props.text.length === 0)
        return (<></>);
    
    return (
        <View className="flex-row items-center gap-1">
            <props.icon color={colors.text} size={14}/>
            <CustomText>{props.text}</CustomText>
        </View>
    )
}