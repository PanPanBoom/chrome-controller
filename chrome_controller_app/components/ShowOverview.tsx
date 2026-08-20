import { ScrollView, View, Image } from "react-native";
import { CustomTitle } from "./ui/CustomTitle";
import { MovieDTO, SeriesDTO } from "@/dtos/show";
import { CustomText } from "./ui/CustomText";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "./ui/Button";
import { sendShowCast } from "@/server/socket";
import { useContext } from "react";
import { AppContext } from "@/contexts/appContext";

type ShowOverviewProps = {
    showData: MovieDTO | SeriesDTO;
};

export const ShowOverview = ({ showData }: ShowOverviewProps) => {
    const { server } = useContext(AppContext);

    return (
        <>
            <CustomText className="text-justify">{showData.overview}</CustomText>
            <CustomTitle>Casting</CustomTitle>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {
                    showData?.cast?.map(actor => (
                        <View key={actor.name} className="items-center gap-2 w-28 mx-2">
                            <View className="w-full aspect-square rounded-xl overflow-hidden">
                                <Image source={{uri: actor.img}} className="w-full aspect-square" />
                                <LinearGradient colors={['rgba(0, 0, 0, 0)', "rgba(0, 0, 0, 0.8)"]} style={{position: "absolute", bottom: 0, left: 0, width: '100%', height: '100%'}} />
                                <View className="absolute bottom-0 left-0 p-2 w-full items-center">
                                    <CustomText className="text-xs text-center">{actor.name}</CustomText>
                                    <CustomText className="text-[7px] text-secondary text-center">{actor.character}</CustomText>
                                </View>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
            {
                showData?.platforms?.length > 0 &&
                <>
                    <CustomTitle>Où regarder</CustomTitle>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {
                            showData?.platforms?.map(platform => (
                                <Button key={platform.name} className="items-center gap-2 w-28 mx-2 p-0 bg-transparent" onPress={() => sendShowCast(server.ip, platform.name.toLowerCase(), showData.id)}>
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
        </>
    )
}