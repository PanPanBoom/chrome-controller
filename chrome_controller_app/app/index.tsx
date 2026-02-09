import { Text, View, Image, ScrollView, TextInput } from "react-native";
import "../global.css";
import { AppButton } from "@/components/AppButton";
import { apps } from "@/constants/apps";
import { DPad } from "@/components/DPad";
import { Button } from "@/components/ui/Button";
import { Maximize, Undo2, Volume1, Volume2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { SafeAreaView } from "react-native-safe-area-context";
import { socket } from '../server/socket';

const PC_ÏP = "http://192.168.1.46:3000";

export default function Index() {
  const [commands, setCommands] = useState<remoteConstantsDTO>({} as remoteConstantsDTO);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    fetch(`${PC_ÏP}/config/commands`)
      .then(res => res.json())
      .then(data => {
        setCommands(data);
        setLoading(false);
        console.log(data);
      });

      socket.on('keyboard', () => {
        console.log('Keyboard show event');
        if(inputRef.current)
          inputRef.current.focus();
      })
  }, [])

  const goBack = () => {
    fetch(`${PC_ÏP}/keypress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: commands.back })
        });
  }

  const volumeStep = 5;

  const handleVolume = (value: number) => {
    fetch(`${PC_ÏP}/volume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ volumeValue: value * volumeStep})
    });
  }

  const handleInput = (newInput) => {
    setInput(newInput);
    fetch(`${PC_ÏP}/input`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: newInput})
    });
  }

  return (
    <SafeAreaView className="flex-1 flex gap-4 items-center">
      {
        loading == false &&
        <DPad commands={commands}/>
      }
      <View className="flex-row gap-4 justify-center items-center">
        <Button onPressOut={goBack}>
          <Undo2 />
        </Button>
        <Button onPressOut={() => fetch(`${PC_ÏP}/fullscreen`)}>
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
      <View className="flex justify-around items-center flex-row flex-wrap w-full">
        { Object.keys(apps).map((name, index) => 
            <AppButton app={apps[name]} key={index}/>
        )}
      </View>
      <TextInput 
        className="w-0 h-0 opacity-0" 
        ref={inputRef} 
        value={input} 
        onChangeText={handleInput} 
        returnKeyType="search" 
        onSubmitEditing={() => fetch(`${PC_ÏP}/input/submit`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ input: input})
        })}/>
    </SafeAreaView>
  );
}