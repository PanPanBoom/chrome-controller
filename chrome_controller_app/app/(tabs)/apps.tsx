import { AppListElement } from "@/components/AppListElement";
import { SearchBar } from "@/components/SearchBar";
import { ShowCarousel } from "@/components/ShowCarousel";
import { Button } from "@/components/ui/Button";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { CustomText } from "@/components/ui/CustomText";
import { CustomTitle } from "@/components/ui/CustomTitle";
import { ScrollScreen } from "@/components/ui/ScrollScreen";
import { AppContext } from "@/contexts/appContext";
import { App } from "@/dtos/app";
import { ShowDTO } from "@/dtos/show";
import { getApps, getHistoryShows, getShowLists, getTopShows, searchShow } from "@/server/api";
import { Href, Label, router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, TextInput, View } from "react-native";

export default function Apps()
{
    const [apps, setApps] = useState<App[] | null>(null);
    const [currentPlatform, setCurrentPlatform] = useState<App | null>(null);
    const [trendingShows, setTrendingShows] = useState<ShowDTO[]>([]);
    // const [historyShows, setHistoryShows] = useState<ShowDTO[]>([]);
    const [showLists, setShowLists] = useState<Record<string, ShowDTO[]>>({});
    const [searchedShows, setSearchedShows] = useState<ShowDTO[]>([]);
    const [input, setInput] = useState("");
    const [activeFilter, setActiveFilter] = useState("");
    const { server } = useContext(AppContext);

    useEffect(() => {
        getApps(server.ip)
            .then(res => res.json())
            .then(data => {
                console.log('Apps received from server:', data);
                setApps(data);

                const initialPlatform = data[0];
                setCurrentPlatform(initialPlatform);

                setActiveFilter(initialPlatform?.filters?.[0]?.apiValue || "");
            });

        // getHistoryShows(server.ip)
        //     .then(res => res.json())
        //     .then(data => setHistoryShows(data));
    }, []);

    const handlePlatformChange = (newPlatformIndex: number) => {
        if(!apps)
            return;

        const newPlatform = apps[newPlatformIndex];
        setCurrentPlatform(newPlatform);
        setActiveFilter(newPlatform?.filters?.[0]?.apiValue || "");
    }

    useEffect(() => {
        if(!currentPlatform) return;

        getShowLists(server.ip, currentPlatform.name, activeFilter)
            .then(res => res.json())
            .then(data => setShowLists(data));

        getTopShows(server.ip, currentPlatform.name, activeFilter)
            .then(res => res.json())
            .then(dataFetched => setTrendingShows(dataFetched));

        if(input)
            handleSearch();
    }, [currentPlatform, activeFilter]);

    const handleSearch = () => {
        if(!input || !currentPlatform)
            return;

        searchShow(server.ip, currentPlatform.name, input, activeFilter)
            .then(res => res.json())
            .then(dataFetched => setSearchedShows(dataFetched));
    }

    const handleChangeText = (newText: string) =>   {
        setInput(newText);
        if(newText.length === 0)
            setSearchedShows([]);
    }
        
    return (
        <ScrollScreen className="gap-3">
            <View className="flex-row w-full justify-between">
                <CustomTitle>Rechercher</CustomTitle>
                <ContextMenu context={apps?.map(app => app.name)} onChange={handlePlatformChange}/>
            </View>
            <SearchBar
                value={input}
                onSearch={handleSearch}
                onChangeText={handleChangeText}
                onClear={() => setInput("")}
            />
            <ShowCarousel
                shows={searchedShows.length > 0 ? searchedShows : trendingShows}
                filters={currentPlatform?.filters || []}
                selectedFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />
            {
                Object.entries(showLists).map(([ label, shows ]) => 
                    shows.length > 0 &&
                    <View key={label} className="gap-4 py-1">
                        <CustomTitle>{label}</CustomTitle>
                        <ShowCarousel 
                            shows={shows}
                        />
                    </View>)
            }
            <CustomTitle>Applications</CustomTitle>
            <View className="m-2 gap-2">
                {
                    apps?.map(app => <AppListElement key={app.name} app={app} />)
                }
            </View>
        </ScrollScreen>
    )
}