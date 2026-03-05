import { App } from "@/dtos/app"
import { Pressable, Image } from "react-native";
import { CustomText } from "./ui/CustomText";
import { useContext } from "react";
import { AppContext } from "@/contexts/appContext";
import { sendAppLaunch } from "@/server/socket";

type AppListElementProps = {
    app: App;
}

export const AppListElement = (props: AppListElementProps) => {
    const { serverIp } = useContext(AppContext);
    console.log(`http://${serverIp}:3000${props.app.img}`);
    
    return (
        <Pressable className="flex-row flex-1 items-center rounded-full bg-background-light gap-2" onPress={() => sendAppLaunch(serverIp, props.app.url)}>
            <Image source={{ uri: `http://${serverIp}:3000${props.app.img}`}} className="h-full aspect-square rounded-full"/>
            <CustomText className="my-4 text-xl">{props.app.name}</CustomText>
        </Pressable>
    )
}