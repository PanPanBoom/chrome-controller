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
import { ModalContext } from "@/contexts/modalProvider";

type ServerDataWidgetProps = {
    server: ServerDataDTO;
}

export const ServerDataWidget = (props: ServerDataWidgetProps) => {
    const { setServer } = useContext(AppContext);
    const { hideModal } = useContext(ModalContext);
    
    const buttonStyle = "flex-1";

    const handleValidate = () => {
        setServer(props.server);
        hideModal();
        router.push('/(tabs)/remote');
    };

    return (
        <View className="flex-row gap-2">
            <Image source={{uri: props.server.serverData.img}} className="h-full aspect-square rounded-full border border-secondary" />
            <View className="flex-1 gap-2 justify-between">
                <CustomText className="text-2xl">{props.server.serverData.name} {props.server.serverData.platform && `(${props.server.serverData.platform})`}</CustomText>
                <CustomText style={{color: colors.secondary}}>{props.server.ip}</CustomText>
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