import { CustomText } from "@/components/ui/CustomText";
import { Screen } from "@/components/ui/Screen";
import { router, useLocalSearchParams } from "expo-router";
import { Image, View } from "react-native";
import { ServerDataDTO } from "@/dtos/serverData";
import { colors } from "@/constants/colors";
import { Button } from "@/components/ui/Button";
import { useContext, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppContext } from "@/contexts/appContext";

export default function Modal() {
    const { setServer } = useContext(AppContext);
    const { server } = useLocalSearchParams();
    const parsedServer: ServerDataDTO = JSON.parse(server as string);

    const buttonStyle = "flex-1";
    const insets = useSafeAreaInsets();

    const handleValidate = () => {
        setServer(parsedServer);
        router.back();
        router.push('/(tabs)/remote');
    }

    return (
        <View className="bg-background flex-row gap-2" style={{padding: 20, marginBottom: -insets.bottom}}>
            <Image source={{uri: parsedServer.serverData.img}} className="h-full aspect-square rounded-full border border-secondary" />
            <View className="flex-1 gap-2 justify-between">
                <CustomText className="text-2xl">{parsedServer.serverData.name} {parsedServer.serverData.platform && `(${parsedServer.serverData.platform})`}</CustomText>
                <CustomText style={{color: colors.secondary}}>{parsedServer.ip}</CustomText>
                <View className="flex-row gap-2">
                    <Button className={buttonStyle} onPress={router.back}>
                        <CustomText>Annuler</CustomText>
                    </Button>
                    <Button className={`${buttonStyle} bg-primary`} onPress={handleValidate}>
                        <CustomText>Se connecter</CustomText>
                    </Button>
                </View>
            </View>
        </View>
    )
}