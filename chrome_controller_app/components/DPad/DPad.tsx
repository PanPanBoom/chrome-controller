import { View, ViewProps } from "react-native"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, LucideIcon } from "lucide-react-native"
import { Button } from "../ui/Button"
import { remoteConstantsDTO } from "@/dtos/remoteConstants"
import { AppContext } from "@/contexts/appContext"
import { useContext } from "react"
import { sendKeyPress } from "@/server/socket"
import { colors } from "@/constants/colors"
import { DPadSideVolume } from "./DPadSideVolume"
import { DPadSideZoom } from "./DPadSideZoom"
import { CustomText } from "../ui/CustomText"
import { DPadSides } from "./DPadSides"
import { cn } from "@/etc/utils"
import { RemoteContext } from "@/contexts/remoteContext"
import { useRemoteButton } from "@/hooks/useRemoteButton"

export const DPad = ({className, style, ...props}: ViewProps) => {
    const { server } = useContext(AppContext);
    const { commands } = useContext(RemoteContext);

    const validateButton = useRemoteButton(server.ip, commands.DPad.validate, commands.directions);

    return (
        <View className={cn("w-[66%] aspect-square border-primary border border-[7px] bg-background rounded-full", className)} style={[{ shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 12 }, style]}>
            <DPadSides />
            <View className="p-5 flex-1">
                <View className="flex relative rounded-full p-2 aspect-square" style={{transform: [{ rotate: '45deg' }]}}>
                    <DPadButton keySimulated={commands.DPad.up} />
                    <DPadButton keySimulated={commands.DPad.left} />
                    <DPadButton keySimulated={commands.DPad.right} />
                    <DPadButton keySimulated={commands.DPad.down} />
                    <Button
                        className={`bg-primary rounded-full m-auto w-[40%] aspect-square`}
                        {...validateButton}
                        style={{transform: [{rotate: '-45deg'}]}}
                    >
                        <CustomText style={{color: colors.text}}>OK</CustomText>
                    </Button>
                </View>
            </View>
        </View>
    )
}

type DPadArrowProps = {
    keySimulated: number;
}

type ArrowConfig = {
    component: LucideIcon;
    className: string;
}

const DPadButton = (props: DPadArrowProps) => {
    const { server } = useContext(AppContext);
    const { commands } = useContext(RemoteContext);

    const arrowsMapping: Record<string, ArrowConfig> = {
        [commands.DPad.up]: {
            component: ChevronUp,
            className: "left-0 top-0 rounded-tl-full"
        },
        [commands.DPad.left]: {
            component: ChevronLeft,
            className: "left-0 bottom-0 rounded-bl-full"
        },
        [commands.DPad.right]: {
            component: ChevronRight,
            className: "right-0 top-0 rounded-tr-full"
        },
        [commands.DPad.down]: {
            component: ChevronDown,
            className: "right-0 bottom-0 rounded-br-full"
        }
    }

    const Component = arrowsMapping[props.keySimulated].component;

    const button = useRemoteButton(server.ip, props.keySimulated, commands.directions);

    return (
        <Button className={`${arrowsMapping[props.keySimulated].className} w-[50%] h-[50%] absolute bg-background-light`} {...button}>
            <View className="bg-background-hover rounded-full p-1">
                <View style={{transform: [{ rotate: '-45deg' }]}}>
                    <Component color={colors.text}/>
                </View>
            </View>
        </Button>
    )
}