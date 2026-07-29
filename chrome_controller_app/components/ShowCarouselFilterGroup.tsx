import { FlatList } from "react-native";
import { ShowCarouselFilter } from "./ShowCarouselFilter";
import { useEffect, useState } from "react";

export type Filter = {
    displayText: string;
    apiValue: string;
}

type ShowCarouselFilterGroupProps = {
    onFilterChange?: (activeFilter: string) => void;
    filters: Filter[];
}

export const ShowCarouselFilterGroup = (props: ShowCarouselFilterGroupProps) => {
    const [activeFilterIndex, setActiveFilterIndex] = useState(0);
    
    useEffect(() => {
        if(props.filters.length > 0)
            props.onFilterChange?.(props.filters[activeFilterIndex].apiValue);
    }, [activeFilterIndex]);

    return (
        <FlatList 
            data={props.filters}
            renderItem={({ item, index }) => 
                <ShowCarouselFilter active={index == activeFilterIndex} onPress={() => setActiveFilterIndex(index)}>
                    {item.displayText}
                </ShowCarouselFilter>}
            keyExtractor={item => item.displayText}
            horizontal
            contentContainerClassName="gap-2"
        />
    )
}