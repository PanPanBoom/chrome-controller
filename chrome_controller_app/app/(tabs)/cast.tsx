import { NetworkScanRadar } from "@/components/NetworkScanRadar";
import { CustomText } from "@/components/ui/CustomText";
import { CustomTitle } from "@/components/ui/CustomTitle";
import { Screen } from "@/components/ui/Screen";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import { Search } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";

export default function Cast()
{
    return (
        <Screen>
            <CustomTitle>Serveurs</CustomTitle>
            <View className="flex-1 justify-between items-center py-20">
                <View className="border border-secondary aspect-square w-[60%] rounded-full shadow shadow-primary shadow-2xs justify-center items-center" style={{borderWidth: 5}}>
                    <BlurView intensity={50} tint="light" className="border border-text w-[85%] aspect-square rounded-full overflow-hidden justify-center items-center">
                        <View className="w-1/2 h-[40%] border border-text rounded-2xl justify-center items-center" style={{borderWidth: 2}}>
                            <Search color={colors.text} size={35}/>
                        </View>
                    </BlurView>
                </View>
                <Button className="bg-primary rounded-full w-[75%]" onPress={() => router.push('/scanNetwork')}>
                    <CustomText>Lancer un scan</CustomText>
                </Button>
            </View>
        </Screen>
    )
}