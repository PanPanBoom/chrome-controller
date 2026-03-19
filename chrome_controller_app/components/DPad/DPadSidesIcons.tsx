import { Plus, Minus, Volume2, ZoomIn, LucideIcon, VolumeOff } from "lucide-react-native";
import { getDPadSections } from "./DPadSide";
import { INNER_R, OUTER_R, PAD_SIZE, ZOOM_SIDE_ANGLES, VOLUME_SIDE_ANGLES } from "./constants";
import { polarToCartesian } from "../ui/CurvedPanel";
import { colors } from "@/constants/colors";

type DPadSideIconsProps = {
    isMuted: boolean;
}

export const DPadSidesIcons = (props: DPadSideIconsProps) => {
    const iconSize = 15;
    const volumeIcons = [ Minus, props.isMuted ? VolumeOff : Volume2, Plus ];
    const zoomIcons = [ Plus, ZoomIn, Minus ];
    const icons = volumeIcons.concat(zoomIcons);

    const buildIcon = (Icon: LucideIcon, coordinates: {x: number, y: number}, key: number) =>
        <Icon
            key={key}
            size={iconSize}
            color={colors.text} 
            style={{
                position: "absolute", 
                top: coordinates.y - iconSize/2, 
                left: coordinates.x - iconSize/2
            }}
        />
    
    const volumeSections = getDPadSections(VOLUME_SIDE_ANGLES.startAngle, VOLUME_SIDE_ANGLES.endAngle);
    const zoomSections = getDPadSections(ZOOM_SIDE_ANGLES.startAngle, ZOOM_SIDE_ANGLES.endAngle);
    const sections = volumeSections.concat(zoomSections);
    const iconCoordinates = sections.map(section => polarToCartesian(PAD_SIZE/2, PAD_SIZE/2, (INNER_R + OUTER_R)/2, (section.startAngle + section.endAngle)/2));
    
    return (
        <>
            {
                icons.map((iconData, index) => buildIcon(iconData, iconCoordinates[index], index))
            }
        </>
    )
}