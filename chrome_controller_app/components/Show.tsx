import { View, ViewProps } from "react-native"
import { CustomText } from "./ui/CustomText"
import { Button } from "./ui/Button"
import { BlurView } from "expo-blur"
import { Cast } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { cn } from "@/etc/utils"

type ShowProps = ViewProps & {
    data: string;
}

export const Show = ({className, ...props}: ShowProps) => {
    console.log(className);
    return (
        <View className={cn("h-full justify-center items-center border border-background-hover rounded-xl bg-gray-500", className)} {...props}>
            <CustomText>{props.data}</CustomText>
            <Button className="bg-transparent p-0 border border-secondary overflow-hidden rounded-full">
                <BlurView className="p-4">
                    <Cast color={colors.text} strokeWidth={1.3}/>
                </BlurView>
            </Button>
        </View>
    )
}