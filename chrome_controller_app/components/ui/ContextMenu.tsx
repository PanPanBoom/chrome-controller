import { FlatList, Pressable, View } from "react-native"
import { CustomText } from "./CustomText";
import { useState } from "react";
import { ChevronDown } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { TextButton } from "./TextButton";

export const ContextMenu = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const data = [
        "Netflix",
        "Youtube",
        "Twitch"
    ];

    const handleNewSelection = (newIndex: number) => {
        setActiveIndex(newIndex);
        setShowMenu(false);
    }

    return (
        <View className="overflow-visible justify-center items-center">
            <Pressable className="flex-row justify-center items-center" onPress={() => setShowMenu(prev => !prev)}>
                <CustomText className="text-secondary">{data[activeIndex]}</CustomText>
                <ChevronDown color={colors.secondary} size={20} />
            </Pressable>
            {
                showMenu &&
                <FlatList 
                    data={data}
                    renderItem={({ item, index }) => <TextButton className="aspect-auto rounded-none bg-transparent" onPress={() => handleNewSelection(index)}>{item}</TextButton>}
                    keyExtractor={item => item}
                    className="absolute top-full z-50 bg-background-light rounded-lg"
                />
            }
        </View>
    )
}