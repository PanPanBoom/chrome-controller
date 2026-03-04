import { Text, View, Image, ScrollView, TextInput } from "react-native";
import { DPad } from "@/components/DPad";
import { Button } from "@/components/ui/Button";
import { Cast, ListIndentIncrease, Maximize, Power, Star, Undo2, Volume1, Volume2 } from "lucide-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { getCommands, sendFullscreenToggle, sendInput, sendKeyPress, socket, submitInput } from '../../server/socket';
import { AppContext } from "@/contexts/appContext";
import { IconButton } from "@/components/ui/IconButton";
import { CustomText } from "@/components/ui/CustomText";
import { Screen } from "@/components/ui/Screen";
import { VideoControlsPanel } from "@/components/VideoControlsPanel";

export default function Remote() {
    const { serverIp } = useContext(AppContext);
    const [commands, setCommands] = useState<remoteConstantsDTO | null>(null);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        getCommands(serverIp)
        .then(res => res.json())
        .then(data => {
            console.log('Commands received from server:', data);
            setCommands(data);
            // console.log(data);
        });

        socket.on('keyboard', () => {
            console.log('Keyboard show event');
            if(inputRef.current)
            inputRef.current.focus();
        })
    }, []);

    useEffect(() => {
        console.log('Current commands state:', commands);
    }, [commands]);

    const handleInput = (newInput: string) => {
        setInput(newInput);
        sendInput(serverIp, newInput);
    }

    return (
        <Screen>
        {
            commands != undefined &&
            <View className="flex-1 flex gap-4 items-center">
                <View className="h-[5%] w-full flex-row justify-between items-center">
                    <IconButton icon={Power} />
                    <CustomText className="text-text text-2xl">Remote</CustomText>
                    <IconButton icon={Cast} />
                </View>
                <DPad commands={commands}/>
                <View className="flex-row w-full justify-around gap-4">
                    <IconButton icon={Undo2} onPressOut={() => sendKeyPress(serverIp, commands?.back || '')} />
                    <IconButton icon={Maximize} onPressOut={() => sendFullscreenToggle(serverIp)} />
                </View>
                <View className="flex-row gap-5 h-[10%]">
                    <IconButton icon={Star} fill={"#f0b604"}/>
                    <VideoControlsPanel className="flex-1"/>
                    <IconButton icon={ListIndentIncrease} />
                </View>
                <TextInput 
                    className="w-0 h-0 opacity-0" 
                    ref={inputRef} 
                    value={input} 
                    onChangeText={handleInput} 
                    returnKeyType="search" 
                    onSubmitEditing={() => submitInput(serverIp, input)}/>
            </View>
        }
        </Screen>
    );
}