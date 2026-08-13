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
import { getApps, getTopShows, searchShow } from "@/server/socket";
import { Href, router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, TextInput, View } from "react-native";

export default function Apps()
{
    const [apps, setApps] = useState<App[] | null>(null);
    const [trendsPlatform, setTrendsPlatform] = useState<App | null>(null);
    const [trendingShows, setTrendingShows] = useState<ShowDTO[]>([]);
    const [searchedShows, setSearchedShows] = useState<ShowDTO[]>([]);
    const [input, setInput] = useState("");
    const [currentTrendsFilter, setCurrentTrendsFilter] = useState<string | null>(null);
    const [currentSearchFilter, setCurrentSearchFilter] = useState<string | null>(null);
    const { server } = useContext(AppContext);

    useEffect(() => {
        getApps(server.ip)
        .then(res => res.json())
        .then(data => {
            console.log('Apps received from server:', data);
            setApps(data);
            setTrendsPlatform(data[0]);
            setCurrentSearchFilter(data.find((platform: App) => platform.name === "TMDB")?.filters[0].apiValue)
        });
    }, []);

    useEffect(() => {
        if(!trendsPlatform) return;

        const activeFilter = currentTrendsFilter ?? trendsPlatform.filters?.[0]?.apiValue ?? "";

        getTopShows(server.ip, trendsPlatform.name, activeFilter)
            .then(res => res.json())
            .then(dataFetched => setTrendingShows(dataFetched));
    }, [trendsPlatform, currentTrendsFilter]);

    const handleSearch = () => {
        searchShow(server.ip, input, currentSearchFilter || "movie")
            .then(res => res.json())
            .then(dataFetched => setSearchedShows(dataFetched));
    } 
        
    return (
        <ScrollScreen className="gap-3">
            <View className="flex-row w-full justify-between">
                <CustomTitle>Tendances</CustomTitle>
                <ContextMenu context={apps?.map(app => app.name)} onChange={(newPlatformIndex: number) => apps && setTrendsPlatform(apps[newPlatformIndex])}/>
            </View>
            {
                trendsPlatform &&
                <ShowCarousel
                    shows={trendingShows}
                    filters={trendsPlatform.filters}
                    selectedFilter={currentTrendsFilter || ""}
                    onFilterChange={(newFilter) => setCurrentTrendsFilter(newFilter)}
                />
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
                selectedFilter={currentSearchFilter || ""}
                onFilterChange={(newFilter) => setCurrentSearchFilter(newFilter)}
                customInfoPress={(id, mediaType) => router.push(`/show/${id}?mediaType=${mediaType}` as Href)}
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