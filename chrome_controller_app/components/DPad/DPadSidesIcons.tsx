import { LucideIcon } from "lucide-react-native";
import { volumeIcons } from "./DPadSideVolume";
import { placeholderIcons } from "./DPadSidePlaceholder";
import { getDPadSections } from "./DPadSide";
import { INNER_R, OUTER_R, PAD_SIZE, PLACEHOLDER_SIDE_ANGLES, VOLUME_SIDE_ANGLES } from "./DPadSides";
import { polarToCartesian } from "../ui/CurvedPanel";
import { colors } from "@/constants/colors";

export const DPadSidesIcons = () => {
    const iconSize = 15;
    const icons = volumeIcons.concat(placeholderIcons);

    const buildIcon = (Icon: LucideIcon, coordinates: {x: number, y: number}, key: number) => <Icon key={key} size={iconSize} color={colors.text} style={{position: "absolute", top: coordinates.y - iconSize/2, left: coordinates.x - iconSize/2}}/>
    const volumeSections = getDPadSections(VOLUME_SIDE_ANGLES.startAngle, VOLUME_SIDE_ANGLES.endAngle);
    const placeholderSections = getDPadSections(PLACEHOLDER_SIDE_ANGLES.startAngle, PLACEHOLDER_SIDE_ANGLES.endAngle);
    const sections = volumeSections.concat(placeholderSections);
    const iconCoordinates = sections.map(section => polarToCartesian(PAD_SIZE/2, PAD_SIZE/2, (INNER_R + OUTER_R)/2, (section.startAngle + section.endAngle)/2));
    
    return (
        <>
            {
                icons.map((iconData, index) => buildIcon(iconData, iconCoordinates[index], index))
            }
        </>
    )
}