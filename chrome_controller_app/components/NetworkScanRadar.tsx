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

export const NetworkScanRadar = (props: ViewProps) => {
    const [isScanning, setScanning] = useState(false);
    const [servers, setServers] = useState<ServerDataDTO[]>([]);

    const [radarRadius, setRadarRadius] = useState(0);
    const [serverRadius, setServerRadius] = useState(0);
    const [centerRadius, setCenterRadius] = useState(0);

    const serverPosition = useMemo(() => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = centerRadius + Math.random() * (radarRadius - centerRadius - serverRadius);

        return {
            top: radarRadius + Math.sin(angle) * distance - serverRadius,
            left: radarRadius + Math.cos(angle) * distance - serverRadius
        }
    }, []);

    useEffect(() => {
        setServers([]);
        setScanning(true);
        scanNetwork().then(foundServers => {
            setServers(foundServers);
            setScanning(false);
        });
    }, []);

    useEffect(() => {
        console.log(radarRadius, serverRadius);
    }, [radarRadius, serverRadius]);

    return (
        <View className="gap-10">
            <Radar active={isScanning} setCenterRadius={setCenterRadius} onLayout={e => setRadarRadius(e.nativeEvent.layout.width/2)} {...props}>
                {
                    servers.map((server, index) => 
                        <NetworkScanServer key={index} server={server} style={serverPosition} onLayout={e => setServerRadius(e.nativeEvent.layout.width/2)}/>)
                }
            </Radar>
        </View>
    )
}