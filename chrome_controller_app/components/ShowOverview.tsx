import { ScrollView, View, Image } from "react-native";
import { CustomTitle } from "./ui/CustomTitle";
import { MovieDTO, SeriesDTO } from "@/dtos/show";
import { CustomText } from "./ui/CustomText";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "./ui/Button";
import { sendShowCast } from "@/server/socket";
import { useContext } from "react";
import { AppContext } from "@/contexts/appContext";
import { ShowCasting } from "./ShowCasting";
import { ShowCarousel } from "./ShowCarousel";

type ShowOverviewProps = {
    showData: MovieDTO | SeriesDTO;
};

export const ShowOverview = ({ showData }: ShowOverviewProps) => {
    const { server } = useContext(AppContext);

    return (
        <>
            <CustomText className="text-justify">{showData.overview}</CustomText>
            <ShowCasting cast={showData.cast}/>
            {
                showData?.platforms?.length > 0 &&
                <>
                    <CustomTitle>Où regarder</CustomTitle>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {
                            showData?.platforms?.map(platform => (
                                <Button key={platform.id} className="items-center gap-2 w-28 mx-2 p-0 bg-transparent" onPress={() => sendShowCast(server.ip, platform.name.toLowerCase(), showData.id)}>
                                    <View className="w-full aspect-square rounded-xl overflow-hidden">
                                        <Image source={{uri: platform.img}} className="w-full aspect-square" />
                                    </View>
                                    <CustomText className="text-xs text-center">{platform.name}</CustomText>
                                </Button>
                            ))
                        }
                    </ScrollView>
                </>
            }
            {
                showData.collection.length > 0 &&
                <>
                    <CustomTitle>Films de la saga</CustomTitle>
                    <ShowCarousel shows={showData.collection} />
                </>
            }
            {
                showData?.similars?.length > 0 &&
                <>
                    <CustomTitle>Similaires</CustomTitle>
                    <ShowCarousel shows={showData.similars} />
                </>
            }
        </>
    )
}