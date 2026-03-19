import { AppContext } from "@/contexts/appContext"
import { Minus, Plus, ZoomIn } from "lucide-react-native";
import { useContext } from "react"
import { DPadSide } from "./DPadSide";
import { ZOOM_SIDE_ANGLES } from "./DPadSides";
import { sendZoom } from "@/server/socket";

export const DPadSideZoom = () => {
    const { server } = useContext(AppContext);
    const zoomStep = 0.1;

    const onPressArray = [
        () => sendZoom(server.ip, 1 * zoomStep),
        () => sendZoom(server.ip, 0),
        () => sendZoom(server.ip, -1 * zoomStep)
    ];

    return (
        <DPadSide startAngle={ZOOM_SIDE_ANGLES.startAngle} endAngle={ZOOM_SIDE_ANGLES.endAngle} onPressArray={onPressArray}/> 
    )
}

export const zoomIcons = [ Plus, ZoomIn, Minus ];