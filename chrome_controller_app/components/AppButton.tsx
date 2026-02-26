import { Image } from "react-native";
import { Button } from "./ui/Button"
import { App } from "@/dtos/app";
import { Linking } from "react-native"
import { AppContext } from "@/contexts/appContext";
import { useContext } from "react";
import { sendAppLaunch } from "@/server/socket";

type AppButtonProps = {
    app: App;
}

export const AppButton = (props: AppButtonProps) => {
    const { serverIp } = useContext(AppContext);
    const onPressOut = () => {
        sendAppLaunch(serverIp, props.app.url);

        if(props.app.redirect)
            Linking.openURL(props.app.redirect);
    }

    return (
        <Button className="w-[48%] h-1/3 mt-2" onPressOut={onPressOut}>
            <Image source={{ uri: `http://${serverIp}:3000${props.app.img}` }} className="w-full h-full"/>
        </Button>
    )
}