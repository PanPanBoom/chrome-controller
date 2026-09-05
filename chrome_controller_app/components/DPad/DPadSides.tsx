import Svg from "react-native-svg";
import { DPadSideVolume } from "./DPadSideVolume";
import { DPadSideZoom } from "./DPadSideZoom";
import { View } from "react-native";
import { DPadSidesIcons } from "./DPadSidesIcons";
import { PAD_SIZE } from "./constants";
import { useContext, useEffect, useState } from "react";
import { getisMuted, socket } from "@/server/socket";
import { AppContext } from "@/contexts/appContext";

export const DPadSides = () => {
    const { server, device } = useContext(AppContext);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        socket.on('muteChanged', (data) => {
            setIsMuted(data.muted);
        })
    })

    useEffect(() => {
        getisMuted(server.ip)
            .then(res => res.json())
            .then(data => setIsMuted(data.isMuted));

        console.log("Device changed, updating mute status");
    }, [device]);
    
    return (
        <View className="z-0 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
            <Svg width={PAD_SIZE} height={PAD_SIZE}>
                <DPadSideVolume />
                <DPadSideZoom />
            </Svg>
            <DPadSidesIcons isMuted={isMuted}/>
        </View>
    )
}