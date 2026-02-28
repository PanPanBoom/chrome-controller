import { colors } from "@/constants/colors";
import { useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Svg, { Path, G, PathProps } from 'react-native-svg';

export const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
  };
};

const describeArc = (cx: number, cy: number, innerR: number, outerR: number, startAngle: number, endAngle: number) => {
    const start1 = polarToCartesian(cx, cy, outerR, startAngle);
    const end1 = polarToCartesian(cx, cy, outerR, endAngle);
    const start2 = polarToCartesian(cx, cy, innerR, endAngle);
    const end2 = polarToCartesian(cx, cy, innerR, startAngle);

    return `M ${start1.x} ${start1.y} A ${outerR} ${outerR} 0 0 1 ${end1.x} ${end1.y} L ${start2.x} ${start2.y} A ${innerR} ${innerR} 0 0 0 ${end2.x} ${end2.y} Z`;
};

type CurvedPanelProps = PathProps & {
    startAngle: number;
    endAngle: number;
    size: number;
    innerR: number;
    outerR: number;
}

export const CurvedPanel = (props: CurvedPanelProps) => {
    const cx = props.size / 2;
    const cy = props.size / 2;

    return (
        <Path
            d={describeArc(cx, cy, props.innerR, props.outerR, props.startAngle, props.endAngle)}
            {...props}
        />
    );
}