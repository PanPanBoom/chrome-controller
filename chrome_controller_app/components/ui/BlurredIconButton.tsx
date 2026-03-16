import { BlurView } from "expo-blur"
import { Button } from "./Button"
import { IconButtonProps } from "./IconButton"
import { colors } from "@/constants/colors"
import { cn } from "@/etc/utils"

type BlurredIconButtonProps = IconButtonProps & {
    blurViewClassName?: string;
}

export const BlurredIconButton = ({className, ...props}: BlurredIconButtonProps) => {
    return (
        <Button className={cn("bg-transparent p-0 border border-secondary overflow-hidden rounded-full", className)} {...props}>
            <BlurView tint='light' intensity={25} className={cn("p-4", props.blurViewClassName)}>
                {
                    props.fill ?
                    <props.icon color={props.fill} fill={props.fill} size={props.iconSize} strokeWidth={1.3}/> :
                    <props.icon color={props.color ?? colors.secondary} size={props.iconSize} strokeWidth={1.3}/>
                }
            </BlurView>
        </Button>
    )
}