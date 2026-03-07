import { AppContext } from "@/contexts/appContext"
import { Minus, Plus, Volume2 } from "lucide-react-native";
import { useContext } from "react"
import { DPadSide } from "./DPadSide";
import { PLACEHOLDER_SIDE_ANGLES } from "./DPadSides";

export const DPadSidePlaceholder = () => {
    // const { serverIp } = useContext(AppContext);

    const onPressArray = [
        () => console.log("jsp mdr"),
        () => console.log("mute"),
        () => console.log("jsp non plus")
    ];

    return (
        <DPadSide startAngle={PLACEHOLDER_SIDE_ANGLES.startAngle} endAngle={PLACEHOLDER_SIDE_ANGLES.endAngle} onPressArray={onPressArray}/> 
    )
}

export const placeholderIcons = [ Plus, Volume2, Minus ];