import { View } from "react-native";
import { CustomTitle } from "./ui/CustomTitle";
import { CustomText } from "./ui/CustomText";

type RatingBoxProps = {
    platform?: string;
    rating: number;
}

export const RatingBox = ({ platform = 'TMDB', rating}: RatingBoxProps) => {
    if(!rating || rating === 0)
        return (<></>);
    
    return (
        <View className="flex-row gap-2 bg-primary rounded-full py-1 px-2 items-center">
            <CustomTitle className="text-background text-sm">{platform}</CustomTitle>
            <CustomText className="text-background text-xs">{rating}</CustomText>
        </View>
    )
}