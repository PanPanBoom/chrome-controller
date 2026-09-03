import { AppListElement } from "@/components/AppListElement";
import { ShowCarousel } from "@/components/ShowCarousel";
import { Button } from "@/components/ui/Button";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { CustomText } from "@/components/ui/CustomText";
import { CustomTitle } from "@/components/ui/CustomTitle";
import { Screen } from "@/components/ui/Screen";
import { ScrollScreen } from "@/components/ui/ScrollScreen";
import { AppContext } from "@/contexts/appContext";
import { App } from "@/dtos/app";
import { ShowDTO } from "@/dtos/show";
import { getApps, getHistoryShows, getTopShows, searchShow } from "@/server/socket";
import { Href, router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, TextInput, View } from "react-native";

export default function Apps()
{
    const [apps, setApps] = useState<App[] | null>(null);
    const [trendsPlatform, setTrendsPlatform] = useState<App | null>(null);
    const [trendingShows, setTrendingShows] = useState<ShowDTO[]>([]);
    const [historyShows, setHistoryShows] = useState<ShowDTO[]>([]);
    const [searchedShows, setSearchedShows] = useState<ShowDTO[]>([]);
    const [input, setInput] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    // const [currentTrendsFilter, setCurrentTrendsFilter] = useState<string | null>(null);
    // const [currentSearchFilter, setCurrentSearchFilter] = useState<string | null>(null);
    const { server } = useContext(AppContext);

    const handleFilterChange = (carouselId: string, filterValue: string) => setActiveFilters(prev => ({
        ...prev,
        [carouselId]: filterValue
    }));

    useEffect(() => {
        getApps(server.ip)
            .then(res => res.json())
            .then(data => {
                console.log('Apps received from server:', data);
                setApps(data);

                const initialPlatform = data[0];
                setTrendsPlatform(initialPlatform);

                const tmdbApp = data.find((platform: App) => platform.name === "TMDB");

                setActiveFilters({
                    "trends": initialPlatform?.filters?.[0]?.apiValue || "",
                    "search": tmdbApp?.filters?.[0]?.apiValue || ""
                });
            });

        getHistoryShows(server.ip)
            .then(res => res.json())
            .then(data => setHistoryShows(data));
    }, []);

    const handlePlatformChange = (newPlatformIndex: number) => {
        if(!apps)
            return;

        const newPlatform = apps[newPlatformIndex];
        setTrendsPlatform(newPlatform);
        handleFilterChange('trends', newPlatform?.filters?.[0]?.apiValue);
    }

    useEffect(() => {
        if(!trendsPlatform) return;

        console.log(trendsPlatform);

        getTopShows(server.ip, trendsPlatform.name, activeFilters['trends'])
            .then(res => res.json())
            .then(dataFetched => setTrendingShows(dataFetched));
    }, [trendsPlatform, activeFilters["trends"]]);

    const handleSearch = () => {
        if(!input)
            return;

        searchShow(server.ip, input, activeFilters['search'] || "movie")
            .then(res => res.json())
            .then(dataFetched => setSearchedShows(dataFetched));
    } 

    useEffect(() => {
        if(input)
            handleSearch();
    }, [activeFilters["search"]])
        
    return (
        <ScrollScreen className="gap-3">
            <View className="flex-row w-full justify-between">
                <CustomTitle>Tendances</CustomTitle>
                <ContextMenu context={apps?.map(app => app.name)} onChange={handlePlatformChange}/>
            </View>
            {
                trendsPlatform &&
                <ShowCarousel
                    shows={trendingShows}
                    filters={trendsPlatform.filters}
                    selectedFilter={activeFilters['trends'] || ""}
                    onFilterChange={(newFilter) => handleFilterChange('trends', newFilter)}
                />
            }
            {
                historyShows?.length > 0 && 
                <>
                    <CustomTitle>Reprendre</CustomTitle>
                    <ShowCarousel 
                        shows={historyShows}
                    />
                </>
            }
            <CustomTitle>Rechercher</CustomTitle>
            <View className="flex-row gap-2">
                <TextInput
                    className="flex-1 p-2 bg-black/50 text-xl text-text rounded-xl" 
                    value={input}
                    onChangeText={setInput}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                />
                <Button className="bg-primary" onPress={handleSearch}>
                    <CustomText>Rechercher</CustomText>
                </Button>
            </View>
            <ShowCarousel
                shows={searchedShows}
                filters={apps?.find(app => app.name === "TMDB")?.filters || []}
                selectedFilter={activeFilters['search'] || ""}
                onFilterChange={(newFilter) => handleFilterChange('search', newFilter)}
            />
            <CustomTitle>Applications</CustomTitle>
            <View className="m-2 gap-2">
                {
                    apps?.map(app => <AppListElement key={app.name} app={app} />)
                }
            </View>
        </ScrollScreen>
    )
}