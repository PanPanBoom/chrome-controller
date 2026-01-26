import { Image, Text } from "react-native";
import { Button } from "./Button"

type AppButtonProps = {
    src: any;
}

export const AppButton = (props: AppButtonProps) => {
    return (
        <Button className="w-[48%] h-1/3 mt-2">
            <Image source={props.src} className="w-full h-full"/>
        </Button>
    )
}