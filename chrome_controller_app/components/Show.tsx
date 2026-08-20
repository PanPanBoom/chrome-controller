import { Image, Pressable, ScrollView, View, ViewProps } from "react-native"
import { CustomText } from "./ui/CustomText"
import { Cast, Info, Loader } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { cn } from "@/etc/utils"
import { ShowDTO } from "@/dtos/show"
import { CustomTitle } from "./ui/CustomTitle"
import { sendAppLaunch, sendShowCast } from "@/server/socket"
import { useContext, useState } from "react"
import { AppContext } from "@/contexts/appContext"
import { BlurredIconButton } from "./ui/BlurredIconButton"
import { LinearGradient } from 'expo-linear-gradient';
import { Href, router } from "expo-router"

type ShowProps = ViewProps & {
    data: ShowDTO;
    onPrev?: () => void;
    onNext?: () => void;
}

export const Show = ({className, ...props}: ShowProps) => {
    const { server } = useContext(AppContext);
    const [showInfos, setShowInfos] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCast = () => {
        setLoading(true);

        sendShowCast(server.ip, props.data.platform, props.data.id).then(_ => setLoading(false));
    }

    const handleInfoPress = () => {
        if(props.data.media_type)
        {
            const realId = props.data.id.split("/")[1];
            console.log(`/show/${realId}?mediaType=${props.data.media_type}`);
            router.push(`/show/${realId}?mediaType=${props.data.media_type}` as Href)
        }
        else
            setShowInfos(prev => !prev)
    }

    return (
        <View className={cn("w-full justify-center items-center border border-background-hover bg-background-hover rounded-xl aspect-video overflow-hidden", className)} {...props}>
            {
                props.data.img.includes('svg') == false &&
                <Image source={{uri: props.data.img}} className="w-full aspect-video absolute" style={{opacity: showInfos ? 0.25 : 1}}/>
            }
            {
                props.data.title !== "" &&
                <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']} style={{position: "absolute", bottom: 0, left: 0, width: '100%', height: '50%'}} />
            }
            <Pressable className="w-1/2 h-full absolute left-0" onPress={props.onPrev}/>
            <Pressable className="w-1/2 h-full absolute right-0" onPress={props.onNext}/>
            <View className="flex-row flex-1">
                {
                    showInfos ?
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <CustomText className="p-2 text-justify">{props.data.overview}</CustomText>
                    </ScrollView> :
                    <View className="flex-1" pointerEvents="none"/>
                }
                <View className="pt-2 pr-2">
                    <BlurredIconButton icon={Info} color={colors.text} iconSize={20} blurViewClassName="p-1" onPress={handleInfoPress}/>
                </View>
            </View>
            <ScrollView horizontal className="grow-0 p-2 w-full" showsHorizontalScrollIndicator={false}>   
                <CustomTitle>{props.data.title}</CustomTitle>
            </ScrollView>
            {
                showInfos == false &&
                <View className="absolute w-full h-full justify-center items-center">
                    <BlurredIconButton icon={loading ? Loader : Cast} color={colors.text} onPress={handleCast}/>
                </View>
            }
        </View>
    )
}