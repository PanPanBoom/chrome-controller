import { AppContext } from "@/contexts/appContext"
import { Minus, Plus, ZoomIn } from "lucide-react-native";
import { useContext } from "react"
import { DPadSide } from "./DPadSide";
import { ZOOM_SIDE_ANGLES } from "./DPadSides";

export const DPadSideZoom = () => {
    // const { serverIp } = useContext(AppContext);

    const onPressArray = [
        () => console.log("zoom"),
        () => console.log("r"),
        () => console.log("dezoom")
    ];

    return (
        <DPadSide startAngle={ZOOM_SIDE_ANGLES.startAngle} endAngle={ZOOM_SIDE_ANGLES.endAngle} onPressArray={onPressArray}/> 
    )
}

export const zoomIcons = [ Plus, ZoomIn, Minus ];