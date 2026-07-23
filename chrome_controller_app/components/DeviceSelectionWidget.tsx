import { AppContext } from "@/contexts/appContext";
import { DeviceDataDTO } from "@/dtos/deviceData";
import { connectTv, getDevices } from "@/server/socket";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { CustomText } from "./ui/CustomText";
import { Check } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { ModalContext } from "@/contexts/modalProvider";

type DeviceSelectionWidgetProps = {
    devices: DeviceDataDTO[];
}

export const DeviceSelectionWidget = (props: DeviceSelectionWidgetProps) => {
    const { server, device, setDevice } = useContext(AppContext);
    const { hideModal } = useContext(ModalContext);

    const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(props.devices.findIndex((currentDevice) => device.name === currentDevice.name));
    const [fetching, setFetching] = useState(false);

    const handlePress = async (newIndex: number) => {
        const oldIndex = selectedDeviceIndex;
        setSelectedDeviceIndex(newIndex);
        
        setFetching(true);
        const res = await connectTv(server.ip, props.devices[newIndex].host == "Android.local" ? props.devices[newIndex].ip : "");
        setFetching(false);

        console.log(res);

        if(!res.ok)
            setSelectedDeviceIndex(oldIndex);
        else
            setDevice(props.devices[newIndex]);
    }

    useEffect(() => {
        console.log(selectedDeviceIndex);
    }, [selectedDeviceIndex]);

    return (
        <View className="flex gap-2">
            {props.devices.map((currentDevice, index) => (
                <Pressable key={currentDevice.ip} onPress={() => handlePress(index)} className="px-2 flex-row justify-between">
                    <CustomText className="text-lg">{currentDevice.name}</CustomText>
                    {
                        index === selectedDeviceIndex && 
                        (fetching ? 
                        <ActivityIndicator/> : 
                        <Check color={colors.text}/>
                    )}
                </Pressable>
            ))}
        </View>
    )
}