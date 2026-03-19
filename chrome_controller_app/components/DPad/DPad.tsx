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

type DPadProps = ViewProps & {
    commands: remoteConstantsDTO;
}

export const DPad = ({className, style, ...props}: DPadProps) => {
    const { server } = useContext(AppContext);

    return (
        <View className={cn("w-[66%] aspect-square border-primary border border-[7px] bg-background rounded-full", className)} style={[{ shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 12 }, style]}>
            <DPadSides />
            <View className="p-5 flex-1">
                <View className="flex relative rounded-full p-2 aspect-square" style={{transform: [{ rotate: '45deg' }]}}>
                    <DPadButton keySimulated={props.commands.DPad.up} commands={props.commands}/>
                    <DPadButton keySimulated={props.commands.DPad.left} commands={props.commands} />
                    <DPadButton keySimulated={props.commands.DPad.right} commands={props.commands} />
                    <DPadButton keySimulated={props.commands.DPad.down} commands={props.commands} />
                    <Button
                        className={`bg-primary rounded-full m-auto w-[40%] aspect-square`}
                        onPressOut={() => sendKeyPress(server.ip, props.commands.DPad.validate)}
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
    keySimulated: string;
    commands: remoteConstantsDTO;
}

type ArrowConfig = {
    component: LucideIcon;
    className: string;
}

const DPadButton = (props: DPadArrowProps) => {
    const { server } = useContext(AppContext);

    const arrowsMapping: Record<string, ArrowConfig> = {
        [props.commands.DPad.up]: {
            component: ChevronUp,
            className: "left-0 top-0 rounded-tl-full"
        },
        [props.commands.DPad.left]: {
            component: ChevronLeft,
            className: "left-0 bottom-0 rounded-bl-full"
        },
        [props.commands.DPad.right]: {
            component: ChevronRight,
            className: "right-0 top-0 rounded-tr-full"
        },
        [props.commands.DPad.down]: {
            component: ChevronDown,
            className: "right-0 bottom-0 rounded-br-full"
        }
    }

    const Component = arrowsMapping[props.keySimulated].component;

    return (
        <Button className={`${arrowsMapping[props.keySimulated].className} w-[50%] h-[50%] absolute bg-background-light`} onPressOut={() => sendKeyPress(server.ip, props.keySimulated)}>
            <View className="bg-background-hover rounded-full p-1">
                <Component style={{transform: [{ rotate: '-45deg' }]}} color={colors.text}/>
            </View>
        </Button>
    )
}