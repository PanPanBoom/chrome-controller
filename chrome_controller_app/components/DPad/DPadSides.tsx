import Svg from "react-native-svg";
import { DPadSideVolume } from "./DPadSideVolume";
import { DPadSideZoom } from "./DPadSideZoom";
import { View } from "react-native";
import { DPadSidesIcons } from "./DPadSidesIcons";

export const PAD_SIZE = 430;

export const VOLUME_SIDE_ANGLES = { startAngle: 240, endAngle: 300 };
export const ZOOM_SIDE_ANGLES = { startAngle: 60, endAngle: 120 };
export const INNER_R = PAD_SIZE * 0.32;
export const OUTER_R = PAD_SIZE * 0.38;

export const DPadSides = () => {
    return (
        <View className="z-0 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
            <Svg width={PAD_SIZE} height={PAD_SIZE}>
                <DPadSideVolume />
                <DPadSideZoom />
            </Svg>
            <DPadSidesIcons />
        </View>
    )
}