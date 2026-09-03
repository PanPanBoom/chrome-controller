import { FlatList } from "react-native";
import { ShowCarouselFilter } from "./ShowCarouselFilter";
import { useEffect, useState } from "react";

export type Filter = {
    displayText: string;
    apiValue: string;
}

type ShowCarouselFilterGroupProps = {
    activeFilterValue: string;
    onSelect: (apiValue: string) => void;
    filters: Filter[];
}

export const ShowCarouselFilterGroup = (props: ShowCarouselFilterGroupProps) => {
    return (
        <FlatList 
            data={props.filters}
            renderItem={({ item }) => 
                <ShowCarouselFilter active={item.apiValue == props.activeFilterValue} onPress={() => props.onSelect(item.apiValue)}>
                    {item.displayText}
                </ShowCarouselFilter>}
            keyExtractor={item => item.apiValue}
            horizontal
            contentContainerClassName="gap-2"
        />
    )
}