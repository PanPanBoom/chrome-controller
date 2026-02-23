import { View } from "react-native"
import { AppButton } from "./AppButton"
import { useEffect, useState } from "react";
import { App } from "@/dtos/app";

type AppsSectionProps = {
    ip: string;
}

export const AppsSection = (props: AppsSectionProps) => {
    const [apps, setApps] = useState<App[] | null>(null);

    useEffect(() => {
        fetch(`${props.ip}/remote/apps`)
        .then(res => res.json())
        .then(data => {
            console.log('Apps received from server:', data);
            setApps(data);
        });
    }, []);

    return (
        <View className="flex justify-around items-center flex-row flex-wrap w-full">
            { apps?.map((app, index) => 
                <AppButton app={app} key={index} ip={props.ip}/>
            )}
        </View>
    )
}