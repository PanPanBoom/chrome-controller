import { Pressable, TextInput, View } from "react-native"
import { Button } from "./ui/Button"
import { CustomText } from "./ui/CustomText"
import { CircleX } from "lucide-react-native"
import { colors } from "@/constants/colors"

type SearchBarProps = {
    value: string;
    onSearch: () => void;
    onChangeText: (text: string) => void;
    onClear?: () => void;
}

export const SearchBar = (props: SearchBarProps) => {
    return (
        <View className="flex-row gap-2">
            <View className="flex-1 flex-row p-2 bg-black/50 rounded-xl items-center">
                <TextInput
                    className="flex-1 text-xl text-text" 
                    value={props.value}
                    onChangeText={props.onChangeText}
                    returnKeyType="search"
                    onSubmitEditing={props.onSearch}
                />
                {
                    props.value.length > 0 &&
                    <Pressable onPress={props.onClear}>
                        <CircleX color={colors.text} size={16} />
                    </Pressable>
                }
            </View>
            <Button className="bg-primary" onPress={props.onSearch}>
                <CustomText>Rechercher</CustomText>
            </Button>
        </View>
    )
}