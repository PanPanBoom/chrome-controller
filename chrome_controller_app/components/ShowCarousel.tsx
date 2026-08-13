import { Dimensions, FlatList, Pressable, ScrollView, ScrollViewProps, View, ViewProps } from "react-native"
import { Show } from "./Show";
import { useContext, useEffect, useState } from "react";
import { cn } from "@/etc/utils";
import { ShowDTO } from "@/dtos/show";
import { Filter, ShowCarouselFilterGroup } from "./ShowCarouselFilterGroup";
import { App } from "@/dtos/app";

type ShowCarouselProps = ViewProps & {
    shows: ShowDTO[];
    filters?: Filter[];
    selectedFilter?: string;
    onFilterChange?: (filter: string) => void;
    customInfoPress?: (id: string, mediaType: string) => void;
}

export const ShowCarousel = ({className, ...props}: ShowCarouselProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const { width } = Dimensions.get('screen');

    const SHOW_WIDTH = Math.round(width * 0.85);
    const SPACING = 25;
    const NB_SHOWS_DISPLAYED = 3;
    
    useEffect(() => {
        setActiveIndex(0);
    }, [props.shows]);


    const handleNext = () => setActiveIndex(i => {
        if(i + 1 > props.shows.length - 1) return 0;
        
        return i + 1;
    });

    const handlePrev = () => setActiveIndex(i => {
        if(i - 1 < 0) return props.shows.length - 1;

        return i - 1;
    });

    return (
        <View className={cn("gap-3", className)} {...props}>
            <ShowCarouselFilterGroup filters={props.filters || []} onFilterChange={props.onFilterChange}/>
            <View className="flex-row">
                {
                    props.shows &&
                    [...props.shows].reverse().map((show, reversedIndex) => {
                        const index = props.shows.length - 1 - reversedIndex;
                        let position = index - activeIndex;
                        if(position < 0)
                            position += props.shows.length;

                        if (position < 0 || position > NB_SHOWS_DISPLAYED - 1) return null;
                        
                        return (
                            <View
                                key={index}
                                className="h-full"
                                style={{
                                    width: SHOW_WIDTH,
                                    position: position === 0 ? 'relative' : 'absolute',
                                    right: -(position * SPACING),
                                    transform: [{ scale: 1 - position * 0.1}],
                                    zIndex: NB_SHOWS_DISPLAYED - position
                                }}
                            >
                                <Show 
                                    data={show} 
                                    onPrev={position === 0 ? handlePrev : undefined} 
                                    onNext={position === 0 ? handleNext : undefined}
                                    customInfoPress={props.customInfoPress}
                                />
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}