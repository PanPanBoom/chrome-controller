import { Text, View, Image, ScrollView } from "react-native";
import "../global.css";
import { AppButton } from "@/components/AppButton";
import { apps } from "@/constants/apps";
import { DPad } from "@/components/DPad";
import { Button } from "@/components/ui/Button";
import { Undo2 } from "lucide-react-native";

export default function Index() {
  const goBack = () => {
    fetch("http://192.168.1.46:3000/keypress", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: "Back"})
        });
  }

  return (
    <ScrollView className="w-full h-full" contentContainerClassName="flex justify-center items-center w-full h-full">
      <DPad />
      <View className="my-4">
        <Button onPressOut={goBack}>
          <Undo2 />
        </Button>
      </View>
      <View className="flex justify-around align-items-center flex-row flex-wrap w-full">
        { Object.keys(apps).map((name, index) => 
            <AppButton app={apps[name]} key={index}/>
        )}
      </View>
    </ScrollView>
  );
}