import { Dimensions, FlatList, Pressable, ScrollView, ScrollViewProps, View, ViewProps } from "react-native"
import { Show } from "./Show";
import { useState } from "react";
import { cn } from "@/etc/utils";

export const ShowCarousel = ({className, ...props}: ViewProps) => {
    const mockData = ["Mock", "Mock2", "Mock3", "Mock4", "Mock5"];
    const [activeIndex, setActiveIndex] = useState(0);

    const { width } = Dimensions.get('screen');

    const SHOW_WIDTH = Math.round(width * 0.85);
    const SPACING = 25;

    const handleNext = () => {
        setActiveIndex(i => {
            if(i + 1 > mockData.length - 1) return 0;
            
            return i + 1;
        })
    }

    return (
        <View className={cn("flex-row", className)} {...props}>
            {
                mockData.reverse().map((show, reversedIndex) => {
                    const index = mockData.length - 1 - reversedIndex;
                    const position = index - activeIndex;

                    if (position < 0 || position > 2) return null;
                    
                    return (
                        <Pressable 
                            key={index} 
                            onPress={position === 0 ? handleNext : undefined}
                            className="absolute h-full"
                            style={{
                                width: SHOW_WIDTH,
                                right: -(position * SPACING),
                                transform: [{ scale: 1 - position * 0.1}]
                            }}
                        >
                            <Show data={show}/>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}