import { Text, View, Image, ScrollView, TextInput } from "react-native";
import { DPad } from "@/components/DPad";
import { Button } from "@/components/ui/Button";
import { Maximize, Undo2, Volume1, Volume2 } from "lucide-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { getCommands, sendFullscreenToggle, sendInput, sendKeyPress, sendVolume, socket, submitInput } from '../../server/socket';
import { AppContext } from "@/contexts/appContext";
import { IconButton } from "@/components/ui/IconButton";

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

    const volumeStep = 5;

    const handleVolume = (value: number) => {
        sendVolume(serverIp, value * volumeStep);
    }

    const handleInput = (newInput: string) => {
        setInput(newInput);
        sendInput(serverIp, newInput);
    }

    return (
        <View className="flex-1 bg-background">
        {
            commands != undefined &&
            <View className="flex-1 flex gap-4 items-center">
                <DPad commands={commands}/>
                <View className="flex-row w-full gap-4 justify-around items-center">
                    <IconButton icon={Undo2} onPressOut={() => sendKeyPress(serverIp, commands?.back || '')} />
                    <IconButton icon={Maximize} onPressOut={() => sendFullscreenToggle(serverIp)} />
                    <View className="flex gap-2">
                        <IconButton icon={Volume2} onPressOut={() => handleVolume(1)} />
                        <IconButton icon={Volume1} onPressOut={() => handleVolume(-1)} />
                    </View>
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
        </View>
    );
}