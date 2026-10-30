import { FlatList, Pressable, ScrollView, View, ViewProps } from "react-native"
import { CustomText } from "./CustomText";
import { useState } from "react";
import { ChevronDown } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { TextButton } from "./TextButton";

type ContextMenuProps = ViewProps & {
    context?: string[];
    onChange?: (newOptionIndex: number) => void
    baseSelectionIndex?: number;
}

export const ContextMenu = ({baseSelectionIndex = 0, ...props}: ContextMenuProps) => {
    const [activeIndex, setActiveIndex] = useState(baseSelectionIndex);
    const [showMenu, setShowMenu] = useState(false);
    const [buttonWidth, setButtonWidth] = useState(0);

    const handleNewSelection = (newIndex: number) => {
        setActiveIndex(newIndex);
        props.onChange?.(newIndex);
        setShowMenu(false);
    }

    return (
        <View className="justify-center items-center">
            <Pressable className="flex-row justify-center items-center" onPress={() => setShowMenu(prev => !prev)} onLayout={(e) => setButtonWidth(e.nativeEvent.layout.width)}>
                <CustomText className="text-secondary">{props.context ? props.context[activeIndex] : ""}</CustomText>
                <View style={{transform: [{rotate: `${(showMenu ? 180 : 0)}deg`}]}}>
                    <ChevronDown color={colors.secondary} size={20} />
                </View>
            </Pressable>
            {
                showMenu &&
                <View pointerEvents="box-none" className="absolute top-full z-50 items-center" style={{ left: -150, right: -150}}>
                    <ScrollView className="bg-background-light rounded-lg max-h-96" style={{minWidth: buttonWidth}}>
                        {
                            props.context?.map((option, index) => <TextButton key={option} className="aspect-auto rounded-none bg-transparent p-2 flex-1" onPress={() => handleNewSelection(index)}>{option}</TextButton>)
                        }
                    </ScrollView>
                </View>
            }
        </View>
    )
}