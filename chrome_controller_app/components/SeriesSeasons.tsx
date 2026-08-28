import { SeasonDTO, SeriesDTO } from "@/dtos/show"
import { ContextMenu } from "./ui/ContextMenu";
import { useContext, useEffect, useState } from "react";
import { getSeasonById } from "@/server/socket";
import { AppContext } from "@/contexts/appContext";
import { CustomText } from "./ui/CustomText";
import { View, Image } from "react-native";
import { CustomTitle } from "./ui/CustomTitle";
import { Episode } from "./Episode";

export const SeriesSeasons = ({ seasons, showId }: { seasons: SeriesDTO["seasons"], showId: string }) => {
    const { server } = useContext(AppContext);
    const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
    const [seasonData, setSeasonData] = useState<SeasonDTO | null>(null);

    useEffect(() => {
        getSeasonById(server.ip, showId, seasons[selectedSeasonIndex].season_number)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            return res;
        })
        .then(data => setSeasonData(data));
    }, [selectedSeasonIndex]);

    return (
        <View className="items-start gap-4">
            <ContextMenu context={seasons.map(season => season.name)} onChange={setSelectedSeasonIndex}/> 
            {
                seasonData &&
                <>
                    <CustomText>{seasonData.overview}</CustomText>
                    {
                        seasonData.episodes.map(episode => <Episode key={episode.id} episode={episode} showId={showId} />)
                    }
                </>
            }   
        </View>
    )
}