import { Pressable, ViewProps, View } from "react-native"
import { Radar } from "./ui/Radar"
import { useEffect, useState } from "react"
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

    useEffect(() => {
        setServers([]);
        setScanning(true);
        scanNetwork().then(foundServers => {
            setServers(foundServers);
            setScanning(false);
        });
    }, []);

    return (
        <View className="gap-10">
            <Radar active={isScanning} {...props}>
                {
                    servers.map((server, index) => 
                        <NetworkScanServer key={index} server={server} className=""/>)
                }
            </Radar>
        </View>
    )
}