import { AppContext } from "@/contexts/appContext";
import { sendTvCode } from "@/server/socket";
import { useContext, useState } from "react";
import { TextInput, View } from "react-native";
import { CustomTitle } from "./ui/CustomTitle";
import { Button } from "./ui/Button";
import { CustomText } from "./ui/CustomText";
import { ModalContext } from "@/contexts/modalProvider";

export const PairingCodeWidget = () => {
    const { server } = useContext(AppContext);
    const { hideModal } = useContext(ModalContext);

    const [input, setInput] = useState("");

    const handleSubmit = () => {
        if(input !== "")
            sendTvCode(server.ip, input);

        hideModal();
    }
    
    return (
        <View className="flex gap-4">
            <CustomTitle>Entrez le code affiché sur votre télé</CustomTitle>
            <View className="flex-row gap-2">
                <TextInput 
                    className="rounded-lg p-4 text-lg text-text flex-1 bg-black/50 mr-2"
                    value={input} 
                    onChangeText={setInput}
                    returnKeyType="send" 
                    onSubmitEditing={handleSubmit}
                />
                <Button className="bg-primary" onPress={handleSubmit}>
                    <CustomText>Envoyer</CustomText>
                </Button>
            </View>
        </View>
    )
}