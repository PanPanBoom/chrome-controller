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

export default function Modal() {
    const { content } = useContext(ModalContext);
    const insets = useSafeAreaInsets();

    return (
        <View className="bg-background" style={{padding: 20, marginBottom: -insets.bottom}}>
            {content}
        </View>
    )
}