import { Text, View, Image } from "react-native";
import "../global.css";
import { AppButton } from "@/components/AppButton";
import { apps } from "@/constants/apps";
import { DPad } from "@/components/DPad";

export default function Index() {
  return (
    <View className="flex justify-center items-center w-full h-full">
      <DPad />
      <View className="flex justify-around align-items-center flex-row flex-wrap w-full">
        { Object.keys(apps).map((name, index) => 
            <AppButton app={apps[name]} key={index}/>
        )}
      </View>
    </View>
  );
}