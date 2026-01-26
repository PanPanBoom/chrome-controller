import { verifyInstallation } from "nativewind";
import { Text, View, Image } from "react-native";
import "../global.css";
import { Button } from "../components/ui/Button";
import { AppButton } from "@/components/ui/AppButton";

const images = [
  require("../assets/images/youtube.png"),
  require("../assets/images/netflix.png"),
  require("../assets/images/prime.png")
]

export default function Index() {
  return (
    <View className="flex justify-around align-items-center flex-row flex-wrap w-full">
      { images.map((image, index) => 
          <AppButton src={image} key={index}/>
      ) }
    </View>
  );
}
