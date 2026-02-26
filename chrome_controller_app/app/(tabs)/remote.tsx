import { Text, View, Image, ScrollView, TextInput } from "react-native";
import { DPad } from "@/components/DPad";
import { Button } from "@/components/ui/Button";
import { Maximize, Undo2, Volume1, Volume2 } from "lucide-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { socket } from '../../server/socket';
import { useLocalSearchParams } from "expo-router";
import { AppsSection } from "@/components/AppsSection";
import { AppContext } from "@/contexts/appContext";

export default function Remote() {
    const { serverIp } = useContext(AppContext);
    const [commands, setCommands] = useState<remoteConstantsDTO | null>(null);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        fetch(`${serverIp}/remote/config/commands`)
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
        fetch(`${serverIp}/extension/keypress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ key: commands?.back })
            });
    }

    const volumeStep = 5;

    const handleVolume = (value: number) => {
        fetch(`${serverIp}/volume`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ volumeValue: value * volumeStep})
        });
    }

    const handleInput = (newInput: string) => {
        setInput(newInput);
        fetch(`${serverIp}/extension/input`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input: newInput})
        });
    }

    return (
        <View className="flex-1 bg-background">
        {
            commands != undefined &&
            <View className="flex-1 flex gap-4 items-center">
                <DPad commands={commands}/>
                <View className="flex-row gap-4 justify-center items-center">
                    <Button onPressOut={goBack}>
                    <Undo2 />
                    </Button>
                    <Button onPressOut={() => fetch(`${serverIp}/extension/fullscreen`)}>
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
                <TextInput 
                    className="w-0 h-0 opacity-0" 
                    ref={inputRef} 
                    value={input} 
                    onChangeText={handleInput} 
                    returnKeyType="search" 
                    onSubmitEditing={() => fetch(`${serverIp}/extension/input/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ input: input})
                    })}/>
            </View>
        }
        </View>
    );
}