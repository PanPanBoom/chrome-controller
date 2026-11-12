import { FlatList } from "react-native";
import { Filter } from "./Filter";

export type FilterDTO = {
    displayText: string;
    apiValue: string;
};

type FilterGroupProps = {
    activeFilterValue: string;
    onSelect: (apiValue: string) => void;
    filters: FilterDTO[];
}

export const FilterGroup = (props: FilterGroupProps) => {
    return (
        <FlatList 
            data={props.filters}
            renderItem={({ item }) => 
                <Filter active={item.apiValue == props.activeFilterValue} onPress={() => props.onSelect(item.apiValue)}>
                    {item.displayText}
                </Filter>}
            keyExtractor={item => item.apiValue}
            horizontal
            contentContainerClassName="gap-2"
        />
    )
}