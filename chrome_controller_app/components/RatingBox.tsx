import { View } from "react-native";
import { CustomTitle } from "./ui/CustomTitle";
import { CustomText } from "./ui/CustomText";

type RatingBoxProps = {
    platform?: string;
    rating: number;
    ratersNb?: number;
}

export const RatingBox = ({ platform = 'TMDB', rating, ratersNb}: RatingBoxProps) => {
    if(!rating || ratersNb === 0)
        return null;
    
    return (
        <View className="flex-row gap-2 bg-primary rounded-full py-1 px-2 items-center">
            <CustomTitle className="text-background text-sm">{platform}</CustomTitle>
            <CustomText className="text-background text-xs">{rating} {ratersNb ? `(${ratersNb > 1000 ? `${Math.round(ratersNb/1000)}K` : ratersNb})` : ''}</CustomText>
        </View>
    )
}