import { colors } from "@/constants/colors";
import { useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Svg, { Path, G } from 'react-native-svg';
import { CurvedPanel, polarToCartesian } from "./ui/CurvedPanel";
import { LucideIcon } from "lucide-react-native";

type DPadSideProps = {
    startAngle: number;
    endAngle: number;
    icons: {
        icon: LucideIcon;
        onPress: () => void;
    }[];
}

export const DPadSide = (props: DPadSideProps) => {
    const [activeIndex, setActiveIndex] = useState(-1);
    const size = 430;
    const iconSize = 15;
    const innerR = size * 0.32;
    const outerR = size * 0.38;

    const step = Math.abs(props.endAngle - props.startAngle) / 3;

    const sections = [
        { startAngle: props.startAngle, endAngle: props.startAngle + step },
        { startAngle: props.startAngle + step, endAngle: props.endAngle - step },
        { startAngle: props.endAngle - step, endAngle: props.endAngle}
    ];

    const buildIcon = (Icon: LucideIcon, coordinates: {x: number, y: number}, key: number) => <Icon key={key} size={iconSize} color={colors.text} style={{position: "absolute", top: coordinates.y - iconSize/2, left: coordinates.x - iconSize/2}}/>

    const iconCoordinates = sections.map(section => polarToCartesian(size/2, size/2, (innerR + outerR)/2, (section.startAngle + section.endAngle)/2));

    return (
        <View className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
            <Svg width={size} height={size}>
                {
                    sections.map((section, index) => <CurvedPanel
                                                        key={index}
                                                        size={size}
                                                        startAngle={section.startAngle}
                                                        endAngle={section.endAngle}
                                                        innerR={innerR}
                                                        outerR={outerR}
                                                        onPressIn={() => setActiveIndex(index)}
                                                        onPressOut={() => setActiveIndex(-1)}
                                                        fill={activeIndex === index ? colors.backgroundHover : colors.backgroundLight}
                                                        onPress={props.icons[index].onPress}
                                                        stroke={colors.backgroundLight}
                                                        strokeWidth={10}
                                                        strokeLinejoin="round"
                                                        strokeLinecap="round"
                                                        />)
                }
            </Svg>
            {
                props.icons.map((iconData, index) => buildIcon(iconData.icon, iconCoordinates[index], index))
            }
        </View>
    );
}