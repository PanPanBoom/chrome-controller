import { LucideIcon } from "lucide-react-native"
import { PressableProps } from "react-native"
import { Button } from "./Button";
import { colors } from "@/constants/colors";

type IconButtonProps = PressableProps & {
    icon: LucideIcon;
}

export const IconButton = (props: IconButtonProps) => {
    return (
        <Button className="bg-background-light rounded-full aspect-square p-4" {...props}>
            <props.icon color={colors.secondary}/>
        </Button>
    )
}