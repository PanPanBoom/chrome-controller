import { FlatList } from "react-native";
import { ShowCarouselFilter } from "./ShowCarouselFilter";
import { useEffect, useState } from "react";

type ShowCarouselFilterGroupProps = {
    onFilterChange?: (activeFilter: string) => void;
}

export const ShowCarouselFilterGroup = (props: ShowCarouselFilterGroupProps) => {
    const filters = [
        {
            displayText: "Tout",
            apiValue: ""
        },
        {
            displayText: "Séries",
            apiValue: "series"
        },
        {
            displayText: "Films",
            apiValue: "movie"
        }
    ];
    const [activeFilterIndex, setActiveFilterIndex] = useState(0);
    
    useEffect(() => {
        props.onFilterChange?.(filters[activeFilterIndex].apiValue);
    }, [activeFilterIndex]);

    return (
        <FlatList 
            data={filters}
            renderItem={({ item, index }) => 
                <ShowCarouselFilter active={index == activeFilterIndex} onPress={() => setActiveFilterIndex(index)}>
                    {item.displayText}
                </ShowCarouselFilter>}
            keyExtractor={item => item.displayText}
            horizontal
            contentContainerClassName="gap-1"
        />
    )
}