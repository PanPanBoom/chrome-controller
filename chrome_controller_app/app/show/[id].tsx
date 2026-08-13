import { CustomText } from "@/components/ui/CustomText";
import { CustomTitle } from "@/components/ui/CustomTitle";
import { Screen } from "@/components/ui/Screen"
import { AppContext } from "@/contexts/appContext";
import { MovieDTO, SeriesDTO, ShowDTO } from "@/dtos/show"
import { getShowById } from "@/server/socket";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from "@/constants/colors";
import { Calendar, Cast, ChevronLeft, Clapperboard, Clock, Heart } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "@/components/ui/IconButton";
import { BlurredIconButton } from "@/components/ui/BlurredIconButton";
import { Tabs } from "@/components/ui/Tabs";
import { ShowOverview } from "@/components/ShowOverview";
import { SeriesSeasons } from "@/components/SeriesSeasons";

export default function Show()
{
    const insets = useSafeAreaInsets();
    const { id, mediaType } = useLocalSearchParams<{ id: string; mediaType: string }>();
    const { server } = useContext(AppContext);
    const [showData, setShowData] = useState<MovieDTO | SeriesDTO | null>(null);

    useEffect(() => {
        getShowById(server.ip, id, mediaType)
        .then(res => res.json())
        .then(data => setShowData(data));
    }, []);

    if (!showData) {
        return (
            <Screen>
                <ActivityIndicator />
                <CustomText>Loading...</CustomText>
            </Screen>
        );
    }

    return (
        <ScrollView className="bg-background flex-1">
            <View className="items-center justify-center">
                <Image source={{uri: showData.img}} className="w-full aspect-[2/3]"/>
                <LinearGradient colors={['rgba(0, 0, 0, 0)', colors.background]} style={{position: "absolute", bottom: 0, left: 0, width: '100%', height: '100%'}} />
                <View className="w-full h-full absolute justify-between items-center p-4" style={{paddingTop: insets.top}}>
                    <View className="flex-row w-full px-4 justify-between">
                        <IconButton icon={ChevronLeft} onPress={() => router.back()} />
                        <IconButton icon={Heart} />
                    </View>
                    <BlurredIconButton icon={Cast} />
                    <View className="flex gap-4">
                        <View className="flex-row gap-1 justify-center">
                            {
                                showData?.genres?.map(genre => 
                                    <View key={genre} className="flex-row gap-1 bg-background-light rounded-full p-2 items-center">
                                        <Clapperboard color={colors.text} size={14} />
                                        <CustomText className="text-sm text-center">{genre}</CustomText>
                                    </View>
                                )
                            }
                        </View>
                        <View className="flex">
                            <CustomTitle className="text-3xl text-center">{showData.title}</CustomTitle>
                            <CustomText className="text-center text-sm text-secondary">Réalisé par {showData.director}</CustomText>
                        </View>
                        <View className="flex-row gap-2 justify-center">
                            <View className="flex-row gap-2 bg-primary rounded-full p-2">
                                <CustomTitle className="text-background text-md">TMDB</CustomTitle>
                                <CustomText className="text-background">{showData.vote_average}</CustomText>
                            </View>
                            {
                                showData.runtime &&
                                <View className="flex-row items-center gap-1">
                                    <Clock color={colors.text} size={14}/>
                                    <CustomText>{showData.runtime >= 60 ? `${Math.floor(showData.runtime / 60)}h ${showData.runtime % 60}min` : `${showData.runtime}min`}</CustomText>
                                </View>
                            }
                            <View className="flex-row items-center gap-1">
                                <Calendar color={colors.text} size={14}/>
                                <CustomText>{showData.release_date}</CustomText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <Tabs tabs={{
                "Aperçu": <ShowOverview showData={showData} />,
                ...('seasons' in showData && {"Saisons": <SeriesSeasons seasons={showData.seasons} showId={showData.id} />}),
                "Commentaires": <></>
            }}/>
        </ScrollView>
    )
}