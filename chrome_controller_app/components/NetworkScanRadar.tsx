import { Pressable, ViewProps, View } from "react-native"
import { Radar } from "./ui/Radar"
import { useEffect, useMemo, useState } from "react"
import { scanNetwork } from "@/etc/utils";
import { Button } from "./ui/Button";
import { CustomText } from "./ui/CustomText";
import { Computer } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { NetworkScanServer } from "./NetworkScanServer";
import { ServerDataDTO } from "@/dtos/serverData";

type NetworkScanRadarProps = ViewProps & {
    isScanning: boolean;
    servers: ServerDataDTO[];
}

export const NetworkScanRadar = (props: NetworkScanRadarProps) => {
    const [radarRadius, setRadarRadius] = useState(0);
    const [serverRadius, setServerRadius] = useState(0);
    const [centerRadius, setCenterRadius] = useState(0);

    const serverPosition = useMemo(() => 
        props.servers.map(() => {
            const angle = Math.random() * 2 * Math.PI;
            const distance = centerRadius + Math.random() * (radarRadius - centerRadius - serverRadius);
    
            return {
                top: radarRadius + Math.sin(angle) * distance - serverRadius,
                left: radarRadius + Math.cos(angle) * distance - serverRadius
            }
        }), [props.servers.length, centerRadius, radarRadius, serverRadius]);

    return (
        <View className="gap-10">
            <Radar active={props.isScanning} setCenterRadius={setCenterRadius} onLayout={e => setRadarRadius(e.nativeEvent.layout.width/2)} {...props}>
                {
                    props.isScanning == false &&
                    props.servers.map((server, index) => 
                        <NetworkScanServer key={index} server={server} style={serverPosition[index]} onLayout={e => setServerRadius(e.nativeEvent.layout.width/2)}/>)
                }
            </Radar>
        </View>
    )
}