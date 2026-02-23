import { View } from "react-native"
import { AppButton } from "./AppButton"
import { useContext, useEffect, useState } from "react";
import { App } from "@/dtos/app";
import { AppContext } from "@/contexts/appContext";

export const AppsSection = () => {
    const [apps, setApps] = useState<App[] | null>(null);
    const { serverIp } = useContext(AppContext);

    useEffect(() => {
        fetch(`${serverIp}/remote/apps`)
        .then(res => res.json())
        .then(data => {
            console.log('Apps received from server:', data);
            setApps(data);
        });
    }, []);

    return (
        <View className="flex justify-around items-center flex-row flex-wrap w-full">
            { apps?.map((app, index) => 
                <AppButton app={app} key={index}/>
            )}
        </View>
    )
}