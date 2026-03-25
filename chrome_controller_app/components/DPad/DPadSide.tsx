import { colors } from "@/constants/colors";
import { useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Svg, { Path, G } from 'react-native-svg';
import { CurvedPanel, polarToCartesian } from "../ui/CurvedPanel";
import { LucideIcon } from "lucide-react-native";
import { INNER_R, OUTER_R, PAD_SIZE } from "./constants";

export const getDPadSections = (startAngle: number, endAngle: number) => {
    const step = Math.abs(endAngle - startAngle) / 3;
    
    return [
        { startAngle, endAngle: startAngle + step },
        { startAngle: startAngle + step, endAngle: endAngle - step },
        { startAngle: endAngle - step, endAngle}
    ];
}

type DPadSideProps = {
    startAngle: number;
    endAngle: number;
    onPressArray: (() => void)[];
}

export const DPadSide = (props: DPadSideProps) => {
    const [activeIndex, setActiveIndex] = useState(-1);

    const sections = getDPadSections(props.startAngle, props.endAngle);

    return (
        <>
            {
                sections.map((section, index) => <CurvedPanel
                                                    key={index}
                                                    size={PAD_SIZE}
                                                    startAngle={section.startAngle}
                                                    endAngle={section.endAngle}
                                                    innerR={INNER_R}
                                                    outerR={OUTER_R}
                                                    onPressIn={() => setActiveIndex(index)}
                                                    onPressOut={() => setActiveIndex(-1)}
                                                    fill={activeIndex === index ? colors.backgroundHover : colors.backgroundLight}
                                                    onPress={props.onPressArray[index]}
                                                    stroke={colors.backgroundLight}
                                                    strokeWidth={5}
                                                    strokeLinejoin="round"
                                                    strokeLinecap="round"
                                                    />)
            }
        </>
    );
}