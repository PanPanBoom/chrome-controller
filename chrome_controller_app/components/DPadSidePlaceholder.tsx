import { AppContext } from "@/contexts/appContext"
import { sendVolume } from "@/server/socket";
import { Minus, Plus, Volume2 } from "lucide-react-native";
import { useContext } from "react"
import { ViewProps } from "react-native";
import { DPadSide } from "./DPadSide";

export const DPadSidePlaceholder = () => {
    // const { serverIp } = useContext(AppContext);

    const icons = [
        {
            icon: Plus,
            onPress: () => console.log("jsp mdr")
        },
        {
            icon: Volume2,
            onPress: () => console.log("mute")
        },
        {
            icon: Minus,
            onPress: () => console.log("jsp non plus")
        }
    ]

    return (
        <DPadSide startAngle={60} endAngle={120} icons={icons} /> 
    )
}