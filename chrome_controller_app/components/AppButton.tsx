import { Image, Text } from "react-native";
import { Button } from "./ui/Button"
import { App } from "@/dtos/app";

type AppButtonProps = {
    app: App;
}

export const AppButton = (props: AppButtonProps) => {
    return (
        <Button className="w-[48%] h-1/3 mt-2" onPressOut={() => fetch("http://192.168.1.46:3000/open", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: props.app.url })
        })}>
            <Image source={props.app.img} className="w-full h-full"/>
        </Button>
    )
}