import { ChevronRight, Computer, LucideIcon } from "lucide-react-native"
import { Button } from "./Button"
import { colors } from "@/constants/colors"
import { CustomText } from "./CustomText"
import { Image, PressableProps } from "react-native"
import { cn } from "@/etc/utils"

type RedirectionButtonProps = PressableProps & { label: string } & (
    | {img: string; icon?: never}
    | {icon: LucideIcon; img?: never}
)

export const RedirectionButton = ({className, style, ...props}: RedirectionButtonProps) => {
    const iconSize = 20;
    return (
        <Button className={cn("flex-row rounded-full gap-2 p-2", className)} style={[{}, style as any]} {...props}>
            {
                props.icon &&
                <Computer color={colors.text} size={iconSize}/> 
            }
            {
                props.img &&
                <Image source={{ uri: props.img }} className="aspect-square rounded-full h-full" />
            }
            <CustomText className="text-lg">{props.label}</CustomText>
            <ChevronRight color={colors.secondary} size={iconSize}/>
        </Button>
    )
}