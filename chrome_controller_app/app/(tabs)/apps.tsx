import { AppListElement } from "@/components/AppListElement";
import { ShowCarousel } from "@/components/ShowCarousel";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { CustomText } from "@/components/ui/CustomText";
import { CustomTitle } from "@/components/ui/CustomTitle";
import { Screen } from "@/components/ui/Screen";
import { AppContext } from "@/contexts/appContext";
import { App } from "@/dtos/app";
import { getApps } from "@/server/socket";
import { useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";

export default function Apps()
{
    const [apps, setApps] = useState<App[] | null>(null);
    const [trendsPlatform, setTrendsPlatform] = useState<App | null>(null);
    const { server } = useContext(AppContext);

    useEffect(() => {
            getApps(server.ip)
            .then(res => res.json())
            .then(data => {
                console.log('Apps received from server:', data);
                setApps(data);
                setTrendsPlatform(data[0]);
            });
        }, []);

    useEffect(() => {
        console.log(trendsPlatform);
    }, [trendsPlatform]);
        
    return (
        <Screen className="gap-3">
            <View className="flex-row w-full justify-between">
                <CustomTitle>Tendances</CustomTitle>
                <ContextMenu context={apps?.map(app => app.name)} onChange={(newPlatformIndex: number) => apps && setTrendsPlatform(apps[newPlatformIndex])}/>
            </View>
            {
                trendsPlatform &&
                <ShowCarousel platform={trendsPlatform}/>
            }
            <CustomTitle>Applications</CustomTitle>
            <FlatList
                data={apps}
                renderItem={({ item }) => <AppListElement app={item} />} 
                keyExtractor={item => item.name}
                contentContainerClassName="m-2 gap-2"
            />
        </Screen>
    )
}