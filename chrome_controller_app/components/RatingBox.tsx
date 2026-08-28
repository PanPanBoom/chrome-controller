import { View } from "react-native";
import { CustomTitle } from "./ui/CustomTitle";
import { CustomText } from "./ui/CustomText";

type RatingBoxProps = {
    platform: string;
    rating: number;
}

export const RatingBox = (props: RatingBoxProps) => {
    return (
        <View className="flex-row gap-2 bg-primary rounded-full py-1 px-2 items-center">
            <CustomTitle className="text-background text-sm">{props.platform}</CustomTitle>
            <CustomText className="text-background text-xs">{props.rating}</CustomText>
        </View>
    )
}