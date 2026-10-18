import { View } from "react-native"
import { AudioTrack } from "react-native-video"
import { CustomText } from "./CustomText"
import { Button } from "./Button"
import { Check } from "lucide-react-native"

type ItemsSelectionWidgetProps = {
    items: any[];
    onSelection?: (item: any) => void;
    selectedItem?: any;
}

export const ItemsSelectionWidget = (props: ItemsSelectionWidgetProps) => {
    const isSelected = (item: any, index: number) => props.selectedItem === item || (props.selectedItem === undefined && index === 0)

    return (
        <>
            {props.items?.map((item, index) => (
                <Button key={index} className="p-2 justify-between flex-row shadow-none" onFocusClassName="bg-background-hover/30" hasTVPreferredFocus={isSelected(item, index)} onPress={() => props.onSelection?.(item)}>
                    <CustomText className="text-black flex-1">{item.title}</CustomText>
                    {
                        isSelected(item, index) &&
                        <Check color="black" />
                    }
                </Button>
            ))}
        </>
    )
}