import { Image, View, ViewProps } from "react-native"
import { CustomText } from "./ui/CustomText"
import { Button } from "./ui/Button"
import { BlurView } from "expo-blur"
import { Cast, Info } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { cn } from "@/etc/utils"
import { ShowDTO } from "@/dtos/show"
import Svg, { SvgUri } from "react-native-svg"
import { CustomTitle } from "./ui/CustomTitle"
import { sendAppLaunch } from "@/server/socket"
import { useContext, useState } from "react"
import { AppContext } from "@/contexts/appContext"
import { BlurredIconButton } from "./ui/BlurredIconButton"

type ShowProps = ViewProps & {
    data: ShowDTO;
}

export const Show = ({className, ...props}: ShowProps) => {
    const { server } = useContext(AppContext);
    const [showInfos, setShowInfos] = useState(false);

    const castButton = (<BlurredIconButton icon={Cast} color={colors.text} onPress={() => sendAppLaunch(server.ip, props.data.link)}/>);
    const infoButton = (<BlurredIconButton icon={Info} color={colors.text} iconSize={20} blurViewClassName="p-1" className="absolute top-2 right-2" onPress={() => setShowInfos(prev => !prev)}/>);
    const infoSection = (
        <>
            <CustomTitle className="text-xl">{props.data.title}</CustomTitle>
            <CustomText className="text-justify px-4 text-xs">{props.data.overview}</CustomText>
        </>
    );

    return (
        <View className={cn("w-full justify-center items-center border border-background-hover bg-background-hover rounded-xl aspect-video overflow-hidden gap-2", className)} {...props}>
            {
                props.data.img.includes('svg') ?
                <>
                    { infoSection }
                    { castButton }
                </> : showInfos ? 
                <>
                    { infoSection }
                    { infoButton }
                </> :
                <>
                    <Image source={{uri: props.data.img}} className="w-full aspect-video absolute"/>
                    { infoButton }
                </>
            }
        </View>
    )
}