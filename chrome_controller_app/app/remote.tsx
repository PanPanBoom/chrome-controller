import { Text, View, Image, ScrollView, TextInput } from "react-native";
import { AppButton } from "@/components/AppButton";
import { DPad } from "@/components/DPad";
import { Button } from "@/components/ui/Button";
import { Maximize, Undo2, Volume1, Volume2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { SafeAreaView } from "react-native-safe-area-context";
import { socket } from '../server/socket';
import { useLocalSearchParams } from "expo-router";
import { AppsSection } from "@/components/AppsSection";

export default function Remote() {
    const { PC_IP } = useLocalSearchParams();
    const [commands, setCommands] = useState<remoteConstantsDTO | null>(null);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        fetch(`${PC_IP}/remote/config/commands`)
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

    const goBack = () => {
        fetch(`${PC_IP}/extension/keypress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ key: commands?.back })
            });
    }

    const volumeStep = 5;

    const handleVolume = (value: number) => {
        fetch(`${PC_IP}/volume`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ volumeValue: value * volumeStep})
        });
    }

    const handleInput = (newInput: string) => {
        setInput(newInput);
        fetch(`${PC_IP}/extension/input`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input: newInput})
        });
    }

    return (
        <SafeAreaView className="flex-1">
        {
            commands != undefined &&
            <View className="flex-1 flex gap-4 items-center">
                <DPad commands={commands} ip={PC_IP}/>
                <View className="flex-row gap-4 justify-center items-center">
                    <Button onPressOut={goBack}>
                    <Undo2 />
                    </Button>
                    <Button onPressOut={() => fetch(`${PC_IP}/extension/fullscreen`)}>
                    <Maximize />
                    </Button>
                    <View className="flex gap-2">
                    <Button onPressOut={() => handleVolume(1)}>
                        <Volume2 />
                    </Button>
                    <Button onPressOut={() => handleVolume(-1)}>
                        <Volume1 />
                    </Button>
                    </View>
                </View>
                <AppsSection ip={PC_IP}/>
                <TextInput 
                    className="w-0 h-0 opacity-0" 
                    ref={inputRef} 
                    value={input} 
                    onChangeText={handleInput} 
                    returnKeyType="search" 
                    onSubmitEditing={() => fetch(`${PC_IP}/extension/input/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ input: input})
                    })}/>
            </View>
        }
        </SafeAreaView>
    );
}