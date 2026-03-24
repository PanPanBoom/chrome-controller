import { View } from "react-native"
import { IconButton, IconButtonProps } from "./IconButton"
import { CustomText } from "./CustomText";
import { cn } from "@/etc/utils";

type IconDescriptionButtonProps = IconButtonProps & {
    description: string;
}

export const IconDescriptionButton = ({className, ...props}: IconDescriptionButtonProps) => {
    return (
        <View className="gap-1 justify-center items-center">
            <IconButton className={cn("aspect-auto px-6", className)} iconSize={20} {...props} />
            <CustomText className="text-secondary text-sm">{props.description}</CustomText>
        </View>
    )
}