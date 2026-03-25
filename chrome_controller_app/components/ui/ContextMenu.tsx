import { FlatList, Pressable, View, ViewProps } from "react-native"
import { CustomText } from "./CustomText";
import { useState } from "react";
import { ChevronDown } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { TextButton } from "./TextButton";

type ContextMenuProps = ViewProps & {
    context?: string[];
    onChange?: (newOptionIndex: number) => void
}

export const ContextMenu = (props: ContextMenuProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    const handleNewSelection = (newIndex: number) => {
        setActiveIndex(newIndex);
        props.onChange?.(newIndex);
        setShowMenu(false);
    }

    return (
        <View className="justify-center items-center">
            <Pressable className="flex-row justify-center items-center" onPress={() => setShowMenu(prev => !prev)}>
                <CustomText className="text-secondary">{props.context ? props.context[activeIndex] : ""}</CustomText>
                <ChevronDown color={colors.secondary} size={20} style={{transform: [{rotate: `${(showMenu ? 180 : 0)}deg`}]}}/>
            </Pressable>
            {
                showMenu &&
                <View className="absolute top-full z-50 bg-background-light rounded-lg" style={{minWidth: '100%'}}>
                    {
                        props.context?.map((option, index) => <TextButton key={option} className="aspect-auto rounded-none bg-transparent p-2" onPress={() => handleNewSelection(index)}>{option}</TextButton>)
                    }
                </View>
            }
        </View>
    )
}