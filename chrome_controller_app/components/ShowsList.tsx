import { AppContext } from "@/contexts/appContext";
import { ShowListDTO } from "@/dtos/show";
import { getPeopleFilmography, getPlatformFilters } from "@/server/api";
import { useContext, useEffect, useMemo, useState } from "react";
import { ShowCarousel } from "./ShowCarousel";
import { CustomTitle } from "./ui/CustomTitle";
import { Image, View } from "react-native";
import { Button } from "./ui/Button";
import { ChevronRight } from "lucide-react-native";
import { CustomText } from "./ui/CustomText";
import { colors } from "@/constants/colors";
import { Href, router } from "expo-router";
import { SearchBar } from "./SearchBar";
import { FilterDTO, FilterGroup } from "./FilterGroup";

type ShowsListProps = {
    showsFetchMethod: () => Promise<Response>;
}

export const ShowsList = (props: ShowsListProps) => {
    const { server } = useContext(AppContext);
    const [filmography, setFilmography] = useState<ShowListDTO[]>([]);
    const [input, setInput] = useState("");
    const [filters, setFilters] = useState<FilterDTO[]>([]);
    const [activeFilter, setActiveFilter] = useState('');
    const sortedShows = useMemo(() => {
        return [...filmography]
            .filter(show => show.media_type === activeFilter)
            .sort((a, b) => {
                const votesA = a.vote_count ?? 0;
                const votesB = b.vote_count ?? 0;
                const orderA = a.order ?? 99;
                const orderB = b.order ?? 99;
                const orderWeight = 2000;
                
                const scoreA = votesA - (orderA * orderWeight);
                const scoreB = votesB - (orderB * orderWeight);

                return scoreB - scoreA;
            })
        }, [filmography, activeFilter]);

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
            {
                filters &&
                <FilterGroup filters={filters} activeFilterValue={activeFilter} onSelect={setActiveFilter} />
            }
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
                                <CustomText numberOfLines={2} className="text-center text-lg">{show.title + (show.releaseYear ? ` (${show.releaseYear})` : '')}</CustomText>
                                <CustomText className="text-secondary text-sm text-center">{show.info}</CustomText>
                            </View>
                            <ChevronRight color={colors.text} />
                        </Button>
                )
            }
        </>
    )
}