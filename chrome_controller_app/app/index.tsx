import { verifyInstallation } from "nativewind";
import { Text, View, Image } from "react-native";
import "../global.css";
import { Button } from "../components/ui/Button";
import { AppButton } from "@/components/ui/AppButton";
import { apps } from "@/constants/apps";

export default function Index() {
  return (
    <View className="flex justify-around align-items-center flex-row flex-wrap w-full">
      { Object.keys(apps).map((name, index) => 
          <AppButton app={apps[name]} key={index}/>
      ) }
    </View>
  );
}
