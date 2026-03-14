import { LucideIcon } from "lucide-react-native"
import { PressableProps } from "react-native"
import { Button } from "./Button";
import { colors } from "@/constants/colors";
import { cn } from "@/etc/utils";

export type IconButtonProps = PressableProps & {
    icon: LucideIcon;
    fill?: string;
    color?: string;
    iconSize?: number;
}

export const IconButton = ({className, ...props}: IconButtonProps) => {
    return (
        <Button className={cn("rounded-full aspect-square p-3", className)} {...props}>
            {
                props.fill ?
                <props.icon color={props.fill} fill={props.fill} size={props.iconSize}/> :
                <props.icon color={props.color ?? colors.secondary} size={props.iconSize}/>
            }
        </Button>
    )
}