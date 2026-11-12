import { LinearGradient } from "expo-linear-gradient"
import { View, Image } from "react-native"
import { IconButton } from "./ui/IconButton"
import { ChevronLeft, Heart } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { router } from "expo-router"
import { CustomTitle } from "./ui/CustomTitle"
import { CustomText } from "./ui/CustomText"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { cn } from "@/etc/utils"

export type ShowHeaderProps = {
    img: string;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export const ShowHeader = (props: ShowHeaderProps) => {
    return (
        <View>
            {
                props.img &&
                <View style={{position: "absolute", top: 0, left: 0, width: '100%', height: '100%'}}>
                    <LinearGradient colors={['rgba(0, 0, 0, 0)', colors.background]} style={{flex: 1}}/>
                    <View className="bg-background flex-1"/>
                </View>
            }
            <View className={cn("justify-between p-4")}>
                <View className="flex gap-4 items-start p-4">
                    <View>
                        <CustomTitle className="text-3xl" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>{props.title}</CustomTitle>
                        {
                            props.subtitle &&
                            <CustomText className="text-xs text-secondary">{props.subtitle}</CustomText>
                        }
                    </View>
                    {props.children}
                </View>
            </View>
        </View>
    )
}