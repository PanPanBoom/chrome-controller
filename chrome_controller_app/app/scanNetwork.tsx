import { NetworkScanRadar } from "@/components/NetworkScanRadar";
import { CustomTitle } from "@/components/ui/CustomTitle";
import { IconButton } from "@/components/ui/IconButton";
import { Screen } from "@/components/ui/Screen";
import { ServerDataDTO } from "@/dtos/serverData";
import { scanNetwork } from "@/etc/utils";
import { router } from "expo-router";
import { ChevronLeft, Cross, RotateCcw, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function ScanNetwork()
{
    const [isScanning, setScanning] = useState(false);
    const [servers, setServers] = useState<ServerDataDTO[]>([]);

    const launchScan = () => {
        setServers([]);
        setScanning(true);
        scanNetwork().then(foundServers => {
            setServers(foundServers);
            setScanning(false);
        });
    };

    useEffect(() => {
        launchScan();
    }, []);
    
    return (
        <Screen className="items-center gap-10">
            <View className="flex-row w-full justify-between items-center">
                <IconButton icon={ChevronLeft} className="w-[15%]" onPress={router.back}/>
                <CustomTitle>Appareils trouvés</CustomTitle>
                <IconButton icon={RotateCcw} disabled={isScanning} onPress={launchScan} />
            </View>
            <NetworkScanRadar className="w-[90%]" isScanning={isScanning} servers={servers}/>
        </Screen>
    )
}