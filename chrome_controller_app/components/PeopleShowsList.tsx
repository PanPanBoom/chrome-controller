import { View } from "react-native"
import { SearchBar } from "./SearchBar"
import { ShowsList } from "./ui/ShowsList"
import { FilterDTO, FilterGroup } from "./FilterGroup"
import { ContextMenu } from "./ui/ContextMenu"
import { useContext, useEffect, useMemo, useState } from "react"
import { ShowListDTO } from "@/dtos/show"
import { parseFRDate } from "@/etc/utils"
import { getPlatformFilters } from "@/server/api"
import { AppContext } from "@/contexts/appContext"

type PeopleShowsListProps = {
    showsFetchMethod: () => Promise<Response>;
}

const SORT_MAP = {
    'Pertinence': (a: ShowListDTO, b: ShowListDTO) => {
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

export const PeopleShowsList = (props: PeopleShowsListProps) => {
    const { server } = useContext(AppContext);
    const [filmography, setFilmography] = useState<ShowListDTO[]>([]);
    const [input, setInput] = useState("");
    const [filters, setFilters] = useState<FilterDTO[]>([]);
    const [activeFilter, setActiveFilter] = useState('');
    const [activeSort, setActiveSort] = useState<keyof typeof SORT_MAP>(SORT_KEYS[0]);
    const sortedShows = useMemo(() => {
            return [...filmography]
                .filter(show => show.media_type === activeFilter)
                .filter(show => show.title.includes(input))
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
            <ShowsList shows={sortedShows}/>
        </>
    )
}