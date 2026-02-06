import { Text, View, Image, ScrollView } from "react-native";
import "../global.css";
import { AppButton } from "@/components/AppButton";
import { apps } from "@/constants/apps";
import { DPad } from "@/components/DPad";
import { Button } from "@/components/ui/Button";
import { Undo2, Volume1, Volume2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [commands, setCommands] = useState<remoteConstantsDTO>({} as remoteConstantsDTO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://192.168.1.46:3000/config/commands")
      .then(res => res.json())
      .then(data => {
        setCommands(data);
        setLoading(false);
        console.log(data);
      });
  }, [])

  const goBack = () => {
    fetch("http://192.168.1.46:3000/keypress", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: commands.back })
        });
  }

  const volumeStep = 5;

  const handleVolume = (value: number) => {
    fetch("http://192.168.1.46:3000/volume", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ volumeValue: value * volumeStep})
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
    </SafeAreaView>
  );
}