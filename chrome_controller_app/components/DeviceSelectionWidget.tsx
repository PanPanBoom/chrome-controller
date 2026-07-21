import { AppContext } from "@/contexts/appContext";
import { DeviceDataDTO } from "@/dtos/deviceData";
import { connectTv, getDevices } from "@/server/socket";
import { useContext, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { CustomText } from "./ui/CustomText";
import { Check } from "lucide-react-native";
import { colors } from "@/constants/colors";

type DeviceSelectionWidgetProps = {
    devices: DeviceDataDTO[];
}

export const DeviceSelectionWidget = (props: DeviceSelectionWidgetProps) => {
    const { server, device, setDevice } = useContext(AppContext);

    const handlePress = (selectedDevice: DeviceDataDTO) => {
        connectTv(server.ip, selectedDevice.host == "Android.local" ? selectedDevice.ip : "");
        setDevice(selectedDevice);
    }

    return (
        <View className="flex gap-2">
            {props.devices.map(currentDevice => (
                <Pressable key={currentDevice.ip} onPress={() => handlePress(currentDevice)} className="px-2 flex-row justify-between">
                    <CustomText className="text-lg">{currentDevice.name}</CustomText>
                    {currentDevice.ip === device?.ip && <Check color={colors.text}/>}
                </Pressable>
            ))}
        </View>
    )
}