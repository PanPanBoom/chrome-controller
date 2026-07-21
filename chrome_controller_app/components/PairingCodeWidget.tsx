import { AppContext } from "@/contexts/appContext";
import { sendTvCode } from "@/server/socket";
import { useContext, useState } from "react";
import { TextInput, View } from "react-native";
import { CustomTitle } from "./ui/CustomTitle";
import { Button } from "./ui/Button";
import { CustomText } from "./ui/CustomText";

export const PairingCodeWidget = () => {
    const { server } = useContext(AppContext);

    const [input, setInput] = useState("");
    
    return (
        <View className="flex gap-4">
            <CustomTitle>Entrez le code affiché sur votre télé</CustomTitle>
            <View className="flex-row gap-2">
                <TextInput 
                    className="rounded-lg p-4 text-lg text-text flex-1 bg-black/50 mr-2"
                    value={input} 
                    onChangeText={setInput}
                    returnKeyType="send" 
                    onSubmitEditing={() => {
                        if(input !== "")
                            sendTvCode(server.ip, input);
                    }}
                />
                <Button className="bg-primary">
                    <CustomText>Envoyer</CustomText>
                </Button>
            </View>
        </View>
    )
}