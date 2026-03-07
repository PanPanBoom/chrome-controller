import { NetworkScanRadar } from "@/components/NetworkScanRadar";
import { CustomTitle } from "@/components/ui/CustomTitle";
import { IconButton } from "@/components/ui/IconButton";
import { Screen } from "@/components/ui/Screen";
import { router } from "expo-router";
import { ChevronLeft, Cross, X } from "lucide-react-native";
import { View } from "react-native";

export default function ScanNetwork()
{
    return (
        <Screen className="items-center gap-10">
            <View className="flex-row w-full justify-between items-center">
                <IconButton icon={ChevronLeft} className="w-[15%]" onPress={router.back}/>
                <CustomTitle>Appareils trouvés</CustomTitle>
                <IconButton icon={X} />
            </View>
            <NetworkScanRadar className="w-[90%]"/>
        </Screen>
    )
}