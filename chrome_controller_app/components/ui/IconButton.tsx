import { LucideIcon } from "lucide-react-native"
import { PressableProps } from "react-native"
import { Button } from "./Button";
import { colors } from "@/constants/colors";

type IconButtonProps = PressableProps & {
    icon: LucideIcon;
    fill?: string;
}

export const IconButton = (props: IconButtonProps) => {
    return (
        <Button className="rounded-full aspect-square p-3" {...props}>
            {
                props.fill ?
                <props.icon color={props.fill} fill={props.fill}/> :
                <props.icon color={colors.secondary} />
            }
        </Button>
    )
}