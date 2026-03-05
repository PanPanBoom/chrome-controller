import { NetworkScanRadar } from "@/components/NetworkScanRadar";
import { CustomText } from "@/components/ui/CustomText";
import { Screen } from "@/components/ui/Screen";

export default function Cast()
{
    return (
        <Screen className="justify-center items-center">
            <NetworkScanRadar className="w-[90%]"/>
        </Screen>
    )
}