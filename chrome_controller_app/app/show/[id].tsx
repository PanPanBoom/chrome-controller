import { CustomText } from "@/components/ui/CustomText";
import { Screen } from "@/components/ui/Screen"
import { AppContext } from "@/contexts/appContext";
import { MovieDTO, SeriesDTO, PeopleDTO } from "@/dtos/show"
import { getPeopleFilmography, getPeopleProductions, getShowById, sendShowCast } from "@/server/api";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { colors } from "@/constants/colors";
import { Calendar, Clapperboard, Clock, Tv } from "lucide-react-native";
import { Tabs } from "@/components/ui/Tabs";
import { ShowOverview } from "@/components/ShowOverview";
import { SeriesSeasons } from "@/components/SeriesSeasons";
import { Button } from "@/components/ui/Button";
import { ShowReviews } from "@/components/ShowReviews";
import { RatingBox } from "@/components/RatingBox";
import { WatchButton } from "@/components/WatchButton";
import { IconTextLabel } from "@/components/ui/IconTextLabel";
import { parseFRDate } from "@/etc/utils";
import { ShowHeader } from "@/components/ShowHeader";
import { PeopleBio } from "@/components/PeopleBio";
import { ShowsList } from "@/components/ShowsList";

export default function Show()
{
    const { id, mediaType } = useLocalSearchParams<{ id: string; mediaType: string }>();
    const { server } = useContext(AppContext);
    const [showData, setShowData] = useState<MovieDTO | SeriesDTO | PeopleDTO | null>(null);

    useEffect(() => {
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

    if(showData.media_type === 'person')
    {
        return (
            <ScrollView className="bg-background flex-1">
                <ShowHeader img={showData.img} title={showData.title} subtitle={showData.profession}>
                    <IconTextLabel 
                        icon={Calendar}
                        text={showData.birth_date}
                    />
                </ShowHeader>
                <Tabs tabs={{
                    "Biographie": <PeopleBio peopleData={showData} />,
                    ...(showData.hasFilmography && {"Filmographie": <ShowsList showsFetchMethod={() => getPeopleFilmography(server.ip, showData.id) } />}),
                    ...(showData.hasProductions && {"Productions": <ShowsList showsFetchMethod={() => getPeopleProductions(server.ip, showData.id) }/>})
                }} />
            </ScrollView>
        )
    }

    const released = showData?.release_date ? parseFRDate(showData.release_date) <= new Date() : true;

    return (
        <ScrollView className="bg-background flex-1">
            <ShowHeader img={showData.img} title={showData.title} subtitle={showData?.directors?.length > 0 ? `De ${showData.directors.map(director => director.name).join(', ')}` : ''}>
                <View className="flex-row gap-2 justify-center">
                    <RatingBox rating={showData.vote_average} ratersNb={showData.vote_count}/>
                    <IconTextLabel
                        icon={Clock}
                        text={showData.runtime ? showData.runtime >= 60 ? `${Math.floor(showData.runtime / 60)}h ${showData.runtime % 60}min` : `${showData.runtime}min` : ''}
                    />
                    <IconTextLabel
                        icon={Tv} 
                        text={'seasons' in showData ? `${showData.number_of_seasons} saisons (${showData.number_of_episodes} ép.)` : ''}
                    />
                    <IconTextLabel 
                        icon={Calendar}
                        text={showData.release_date}
                    />
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
                    <WatchButton showId={showData.id} nextStartTime={showData.nextStartTime} episodeInfo={showData.currentEpisodeInfo} release_date={showData.release_date} className="flex-1"/>
                    {
                        showData.trailer &&
                        <Button className={released ? "bg-transparent" : "flex-1 bg-primary rounded-full"} onPress={() => sendShowCast(server.ip, 'youtube', showData.trailer)}>
                            <CustomText className={released ? "text-primary" : "text-background text-lg"}>Trailer</CustomText>
                        </Button>
                    }
                </View>
            </ShowHeader>
            <Tabs tabs={{
                "Aperçu": <ShowOverview showData={showData} />,
                ...('seasons' in showData && {"Saisons": <SeriesSeasons seasons={showData.seasons} showId={showData.id} currentSeason={showData.currentEpisodeInfo?.season}/>}),
                "Commentaires": <ShowReviews showId={showData.id} />
            }}/>
        </ScrollView>
    )
}