import { AppContext } from "@/contexts/appContext";
import { ShowReview } from "@/dtos/show";
import { getShowReviews } from "@/server/socket";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native"
import { CustomText } from "./ui/CustomText";
import { CustomTitle } from "./ui/CustomTitle";
import { CircleUserRound } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { RatingBox } from "./RatingBox";

type ShowReviewsProps = {
    showId: string;
}

export const ShowReviews = (props: ShowReviewsProps) => {
    const { server } = useContext(AppContext);
    const [reviews, setReviews] = useState<ShowReview[] | null>(null);

    useEffect(() => {
        getShowReviews(server.ip, props.showId)
        .then(res => res.json())
        .then(data => setReviews(data));
    }, []);

    console.log(reviews);

    if(!reviews)
        return (
            <View>
                <ActivityIndicator />
                <CustomText>Fetching reviews...</CustomText>
            </View>
        )
    
    return (
        <View className="flex gap-4">
            {
                reviews.map(review => (
                    <View key={review.id} className="flex-row gap-4"> 
                        <View className="w-[10%]">
                            {
                                review.author.avatar ?
                                <Image source={{ uri: review.author.avatar }} className="rounded-full aspect-square"/> :
                                <CircleUserRound color={colors.primary} size={35} strokeWidth={1}/>
                            }
                        </View>
                        <View className="flex-1 gap-2">
                            <View className="justify-between flex-row">
                                <View>
                                    <CustomTitle className="text-md border">{review.author.name}</CustomTitle>
                                    <CustomText className="text-xs text-secondary">@{review.author.username}</CustomText>
                                </View>
                                <RatingBox platform="TMDB" rating={review.rating} />
                            </View>
                            <CustomText className="text-justify text-sm">{review.content}</CustomText>
                        </View>
                    </View>
                ))
            }
        </View>
    )
}