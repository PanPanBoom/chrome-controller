import Svg from "react-native-svg";
import { DPadSideVolume } from "./DPadSideVolume";
import { DPadSideZoom } from "./DPadSideZoom";
import { View } from "react-native";
import { DPadSidesIcons } from "./DPadSidesIcons";
import { PAD_SIZE } from "./constants";
import { useContext, useEffect, useState } from "react";
import { getisMuted } from "@/server/socket";
import { AppContext } from "@/contexts/appContext";

export const DPadSides = () => {
    const { server } = useContext(AppContext);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        getisMuted(server.ip)
            .then(res => res.json())
            .then(data => setIsMuted(data.isMuted));
    });
    
    return (
        <View className="z-0 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
            <Svg width={PAD_SIZE} height={PAD_SIZE}>
                <DPadSideVolume onMuteChange={(isMuted => setIsMuted(isMuted))}/>
                <DPadSideZoom />
            </Svg>
            <DPadSidesIcons isMuted={isMuted}/>
        </View>
    )
}