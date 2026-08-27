import { CustomText } from "@/components/ui/CustomText";
import { CustomTitle } from "@/components/ui/CustomTitle";
import { Screen } from "@/components/ui/Screen"
import { AppContext } from "@/contexts/appContext";
import { MovieDTO, SeriesDTO, ShowDTO } from "@/dtos/show"
import { getShowById, sendAppLaunch, sendShowCast } from "@/server/socket";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from "@/constants/colors";
import { Calendar, Cast, ChevronLeft, Clapperboard, Clock, Heart, Play, Tv } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "@/components/ui/IconButton";
import { BlurredIconButton } from "@/components/ui/BlurredIconButton";
import { Tabs } from "@/components/ui/Tabs";
import { ShowOverview } from "@/components/ShowOverview";
import { SeriesSeasons } from "@/components/SeriesSeasons";
import { Button } from "@/components/ui/Button";
import { ShowReviews } from "@/components/ShowReviews";
import { RatingBox } from "@/components/RatingBox";
import { WatchButton } from "@/components/WatchButton";

export default function Show()
{
    const insets = useSafeAreaInsets();
    const { id, mediaType } = useLocalSearchParams<{ id: string; mediaType: string }>();
    const { server } = useContext(AppContext);
    const [showData, setShowData] = useState<MovieDTO | SeriesDTO | null>(null);

    useEffect(() => {
        console.log(id);
        getShowById(server.ip, `${mediaType}/${id}`)
        .then(res => res.json())
        .then(data => setShowData(data));
    }, []);

    if (!showData) {
        return (
            <Screen className="justify-center items-center gap-4">
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
                <View className="w-full h-full absolute justify-between p-4" style={{paddingTop: insets.top}}>
                    <View className="flex-row w-full px-4 justify-between">
                        <IconButton icon={ChevronLeft} onPress={() => router.back()} />
                        <IconButton icon={Heart} />
                    </View>
                    {/* <BlurredIconButton icon={Cast} onPress={() => sendShowCast(server.ip, 'tmdb', showData.id)}/> */}
                    <View className="flex gap-4 items-start p-4">
                        <View>
                            <CustomTitle className="text-3xl" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>{showData.title}</CustomTitle>
                            {
                                showData.director &&
                                <CustomText className="text-xs text-secondary">De {showData.director}</CustomText>
                            }
                        </View>
                        {/* <CustomText>{showData.release_date}</CustomText>
                        <CustomText>{showData.vote_average}/10</CustomText> */}
                        <View className="flex-row gap-2 justify-center">
                            <RatingBox platform="TMDB" rating={showData.vote_average} />
                            {
                                showData.runtime ?
                                <View className="flex-row items-center gap-1">
                                    <Clock color={colors.text} size={14}/>
                                    <CustomText>{showData.runtime >= 60 ? `${Math.floor(showData.runtime / 60)}h ${showData.runtime % 60}min` : `${showData.runtime}min`}</CustomText>
                                </View>
                                :
                                <View className="flex-row items-center gap-1">
                                    <Tv color={colors.text} size={14}/>
                                    <CustomText>{(showData as SeriesDTO).number_of_seasons} saisons ({(showData as SeriesDTO).number_of_episodes} épisodes)</CustomText>
                                </View>
                            }
                            <View className="flex-row items-center gap-1">
                                <Calendar color={colors.text} size={14}/>
                                <CustomText>{showData.release_date}</CustomText>
                            </View>
                        </View>
                        <ScrollView horizontal className="grow-0" contentContainerClassName="flex-row gap-1 items-center" showsHorizontalScrollIndicator={false}>
                            {
                                showData?.genres?.map(genre => 
                                    <View key={genre} className="flex-row gap-1 rounded-md py-1 px-2 items-center border border-text">
                                        <Clapperboard color={colors.text} size={14} />
                                        <CustomText className="text-xs text-center">{genre}</CustomText>
                                    </View>
                                )
                            }
                        </ScrollView>
                        <View className="flex-row gap-2">
                            <WatchButton showId={showData.id} className="flex-1"/>
                            {
                                showData.trailer &&
                                <Button className="bg-transparent" onPress={() => sendShowCast(server.ip, 'youtube', showData.trailer)}>
                                    <CustomText className="text-primary">Trailer</CustomText>
                                </Button>
                            }
                        </View>
                    </View>
                </View>
            </View>
            <Tabs tabs={{
                "Aperçu": <ShowOverview showData={showData} />,
                ...('seasons' in showData && {"Saisons": <SeriesSeasons seasons={showData.seasons} showId={showData.id} />}),
                "Commentaires": <ShowReviews showId={showData.id} />
            }}/>
        </ScrollView>
    )
}