import { Text, View, Image, ScrollView, TextInput } from "react-native";
import { DPad } from "@/components/DPad/DPad";
import { Button } from "@/components/ui/Button";
import { Cast, Keyboard, ListIndentIncrease, Maximize, Power, Star, Undo2, Volume1, Volume2 } from "lucide-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { getCommands, getDevices, sendFullscreenToggle, sendInput, sendKeyPress, socket, submitInput } from '../../../server/socket';
import { AppContext } from "@/contexts/appContext";
import { IconButton } from "@/components/ui/IconButton";
import { CustomText } from "@/components/ui/CustomText";
import { Screen } from "@/components/ui/Screen";
import { VideoControlsPanel } from "@/components/VideoControlsPanel";
import { RedirectionButton } from "@/components/ui/RedirectionButton";
import { colors } from "@/constants/colors";
import { TextButton } from "@/components/ui/TextButton";
import { IconDescriptionButton } from "@/components/ui/IconDescriptionButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { RemoteContext, RemoteProvider } from "@/contexts/remoteContext";
import { router } from "expo-router";
import { ExpandableIconButton } from "@/components/ui/ExpandableIconButton";
import { DeviceSelectionWidget } from "@/components/DeviceSelectionWidget";
import { ModalContext } from "@/contexts/modalProvider";
import { PairingCodeWidget } from "@/components/PairingCodeWidget";

export default function Remote() {
    const { server, device, setDevice } = useContext(AppContext);
    const { commands, setCommands } = useContext(RemoteContext);
    const { showModal } = useContext(ModalContext);
    // const [commands, setCommands] = useState<remoteConstantsDTO | null>(null);
    const [input, setInput] = useState("");
    const [devices, setDevices] = useState([]);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        getCommands(server.ip)
        .then(res => res.json())
        .then(data => {
            console.log('Commands received from server:', data);
            setCommands(data);
            // console.log(data);
        });

        getDevices(server.ip)
        .then(res => res.json())
        .then(data => {
            // console.log('Devices received from server:', data);
            setDevices(data);
            if(data.length > 0)
                setDevice(data[0]);
        });

        socket.on('keyboard', () => {
            console.log('Keyboard show event');
            if(inputRef.current)
                inputRef.current.focus();
        });

        socket.on('tvCodeRequest', () => {
            showModal(<PairingCodeWidget />);
        });

    }, []);

    const handleInput = (newInput: string) => {
        setInput(newInput);
        sendInput(server.ip, newInput);
    }

    return (
        <Screen>
        {
            commands.DPad &&
            <View className="flex-1 flex items-center justify-between">
                <View className="h-[5%] w-full flex-row justify-between items-center z-20">
                    <IconButton icon={Power} disabled/>
                    <CustomText className="text-text text-2xl">Télécommande</CustomText>
                    <IconButton icon={Cast} />
                </View>
                <RedirectionButton label={device.name} img={server.serverData.img} className="h-[5%] z-50">
                    <DeviceSelectionWidget devices={devices} />
                </RedirectionButton>
                <DPad className="z-0" style={{marginVertical: 30}}/>
                <View className="flex-row w-[85%] justify-between">
                    <TextButton onPressOut={() => sendKeyPress(server.ip, commands?.back || '')}>BACK</TextButton>
                    <TextButton onPressOut={() => sendKeyPress(server.ip, commands?.home || '')}>HOME</TextButton>
                    <TextButton disabled>EXIT</TextButton>
                </View>
                <View className="flex-row gap-5 h-[8%]">
                    <FavoriteButton />
                    <VideoControlsPanel className="flex-1"/>
                    <IconButton icon={ListIndentIncrease} disabled/>
                </View>
                <View className="flex-row w-full justify-between px-2">
                    <IconDescriptionButton icon={Keyboard} description="Clavier" onPress={() => inputRef.current?.focus()}/>
                    <IconDescriptionButton icon={Maximize} description="Plein écran" onPressOut={() => sendFullscreenToggle(server.ip)} />
                </View>
                <TextInput 
                    className="w-0 h-0 opacity-0" 
                    ref={inputRef} 
                    value={input} 
                    onChangeText={handleInput} 
                    returnKeyType="search" 
                    onSubmitEditing={() => {
                        if(input !== "")
                            submitInput(server.ip, input)
                    }}/>
            </View>
        }
        </Screen>
    );
}