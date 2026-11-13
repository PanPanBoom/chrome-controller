import { AppContext } from "@/contexts/appContext";
import { ShowListDTO } from "@/dtos/show";
import { getPlatformFilters } from "@/server/api";
import { useContext, useEffect, useMemo, useState } from "react";
import { Image, View } from "react-native";
import { Button } from "./ui/Button";
import { ChevronRight } from "lucide-react-native";
import { CustomText } from "./ui/CustomText";
import { colors } from "@/constants/colors";
import { Href, router } from "expo-router";
import { SearchBar } from "./SearchBar";
import { FilterDTO, FilterGroup } from "./FilterGroup";
import { ContextMenu } from "./ui/ContextMenu";
import { parseFRDate } from "@/etc/utils";

type ShowsListProps = {
    showsFetchMethod: () => Promise<Response>;
}

const SORT_MAP = {
    'Importance': (a: ShowListDTO, b: ShowListDTO) => {
        const votesA = a.vote_count ?? 0;
        const votesB = b.vote_count ?? 0;
        const orderA = a.order ?? a.apparitions;
        const orderB = b.order ?? b.apparitions;
        const orderWeight = 2000;
        
        const scoreA = votesA + ((a.order != null ? -1 : 1) * orderA * orderWeight);
        const scoreB = votesB + ((b.order != null ? -1 : 1) * orderB * orderWeight);

        return scoreB - scoreA;
    },
    'Date': (a: ShowListDTO, b: ShowListDTO) => {
        if(!a.releaseDate)
            return 1;
        if(!b.releaseDate)
            return -1;

        return parseFRDate(b.releaseDate).getTime() - parseFRDate(a.releaseDate).getTime()
    },
    // 'Rôle': (a: ShowListDTO, b: ShowListDTO) => 
};
const SORT_KEYS = Object.keys(SORT_MAP) as (keyof typeof SORT_MAP)[];

export const ShowsList = (props: ShowsListProps) => {
    const { server } = useContext(AppContext);
    const [filmography, setFilmography] = useState<ShowListDTO[]>([]);
    const [input, setInput] = useState("");
    const [filters, setFilters] = useState<FilterDTO[]>([]);
    const [activeFilter, setActiveFilter] = useState('');
    const [activeSort, setActiveSort] = useState<keyof typeof SORT_MAP>(SORT_KEYS[0]);
    const sortedShows = useMemo(() => {
        return [...filmography]
            .filter(show => show.media_type === activeFilter)
            .sort(SORT_MAP[activeSort])
        }, [filmography, activeFilter, activeSort]);

    useEffect(() => {
        props.showsFetchMethod()
            .then(res => res.json())
            .then(data => setFilmography(data));

        getPlatformFilters(server.ip, 'tmdb')
            .then(res => res.json())
            .then(filtersResult => {
                const cleanFilters = filtersResult.slice(1);

                setFilters(cleanFilters);
                setActiveFilter(cleanFilters[0].apiValue);
            })
    }, []);

    const handlePress = (showId: string) => {
        const [mediaType, realId] = showId.split('/');
        router.push(`/show/${realId}?mediaType=${mediaType}` as Href);
    }

    return (
        <>
            <SearchBar value={input} onChangeText={setInput} onClear={() => setInput("")} onSearch={() => null}/>
            <View className="flex-row">
                {
                    filters &&
                    <FilterGroup filters={filters} activeFilterValue={activeFilter} onSelect={setActiveFilter} />
                }
                <ContextMenu context={SORT_KEYS} onChange={(newIndex) => setActiveSort(SORT_KEYS[newIndex])}/>
            </View>
            {
                sortedShows
                    .filter(show => show.title.includes(input))
                    .map(show => 
                        <Button key={show.id} className="w-full justify-between flex-row bg-transparent" onPress={() => handlePress(show.id)}>
                            {
                                show.img ?
                                <Image source={{uri: show.img}} className="aspect-[2/3] w-1/4 rounded-xl" /> :
                                <View className="w-1/4"/>
                            }
                            <View className="px-6 flex-1 items-center gap-1">
                                <CustomText numberOfLines={2} className="text-center text-lg">{show.title + (show.releaseDate ? ` (${show.releaseDate.slice(-4)})` : '')}</CustomText>
                                <CustomText className="text-secondary text-sm text-center">{show.info}</CustomText>
                            </View>
                            <ChevronRight color={colors.text} />
                        </Button>
                )
            }
        </>
    )
}