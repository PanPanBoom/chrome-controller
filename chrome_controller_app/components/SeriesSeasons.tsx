import { SeasonDTO, SeriesDTO } from "@/dtos/show"
import { ContextMenu } from "./ui/ContextMenu";
import { useContext, useEffect, useState } from "react";
import { getSeasonById } from "@/server/api";
import { AppContext } from "@/contexts/appContext";
import { CustomText } from "./ui/CustomText";
import { View, Image } from "react-native";
import { CustomTitle } from "./ui/CustomTitle";
import { Episode } from "./Episode";
import { Calendar, Tv } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { RatingBox } from "./RatingBox";
import { cn } from "@/etc/utils";
import { IconTextLabel } from "./ui/IconTextLabel";
import { ShowCasting } from "./ShowCasting";

export const SeriesSeasons = ({ seasons, showId }: { seasons: SeriesDTO["seasons"], showId: string }) => {
    const { server } = useContext(AppContext);
    const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(seasons.findIndex(season => season.season_number === 1));
    const [seasonData, setSeasonData] = useState<SeasonDTO | null>(null);

    useEffect(() => {
        getSeasonById(server.ip, showId, seasons[selectedSeasonIndex].season_number)
            .then(res => res.json())
            .then(data => setSeasonData(data));
    }, [selectedSeasonIndex]);

    return (
        <View className="items-start gap-4">
            <ContextMenu context={seasons.map(season => season.name)} onChange={setSelectedSeasonIndex} baseSelectionIndex={selectedSeasonIndex}/> 
            {
                seasonData &&
                <>
                    <View className="flex-row gap-3">
                        <Image source={{uri: seasonData.poster_path}} className="aspect-[2/3] w-1/3 rounded-lg"/>
                        <View className="flex-1 justify-between">
                            <View className="gap-1">
                                <CustomTitle>{seasonData.title}</CustomTitle>
                                <CustomText 
                                    className={cn("text-justify", seasonData?.overview?.length > 0 ? '' : 'text-secondary')}
                                    numberOfLines={4}
                                >
                                    {seasonData.overview ? seasonData.overview : 'Pas de description'}
                                </CustomText>
                            </View>
                            <View className="flex-row justify-between">
                                <View>
                                    <IconTextLabel icon={Calendar} text={seasonData.air_date} />
                                    <IconTextLabel icon={Tv} text={seasonData.episodes.length > 0 ? `${seasonData.episodes.length} épisodes` : ''} />
                                </View>
                                <RatingBox rating={seasonData.vote_average}/>
                            </View>
                        </View>
                    </View>
                    <ShowCasting cast={seasonData.cast} />
                    <CustomTitle>Episodes</CustomTitle>
                    {
                        seasonData.episodes.map(episode => <Episode key={episode.id} episode={episode} showId={showId} />)
                    }
                </>
            }   
        </View>
    )
}