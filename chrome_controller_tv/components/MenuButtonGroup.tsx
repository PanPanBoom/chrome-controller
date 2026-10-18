import { LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import { MenuButton } from "./MenuButton";
import { colors } from "../constants";
import { useState } from "react";

type MenuButtonGroupsProps = {
    buttons: {
        icon: LucideIcon;
        widget: React.ReactNode | ((api: { close: () => void}) => React.ReactNode);
        disabled: boolean;
    }[];
    className?: string;
    buttonsClassName?: string;
    buttonsFocusClassName?: string;
}

export const MenuButtonGroup = (props: MenuButtonGroupsProps) => {
    const [expandedIndex, setExpandedIndex] = useState(-1);

    return (
        <View className={props.className}>
            {
                props.buttons.map((button, index) => (
                    <MenuButton
                        key={index}
                        onFocusClassName={props.buttonsFocusClassName ?? ""}
                        className={props.buttonsClassName}
                        widget={button.widget}
                        disabled={button.disabled}
                        expanded={expandedIndex === index}
                        onPress={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
                        onClose={() => setExpandedIndex(-1)}
                    >
                        <button.icon color={colors.text}/>
                    </MenuButton>
                ))
            }
        </View>
    )
}