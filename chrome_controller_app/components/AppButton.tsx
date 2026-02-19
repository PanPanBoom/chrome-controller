import { Image } from "react-native";
import { Button } from "./ui/Button"
import { App } from "@/dtos/app";

type AppButtonProps = {
    app: App;
    ip: string;
}

export const AppButton = (props: AppButtonProps) => {
    const onPressOut = () => {
        fetch(`${props.ip}/open`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: props.app.url })
        });

        console.log(props.app.redirect);
        props.app.redirect?.();
    }

    return (
        <Button className="w-[48%] h-1/3 mt-2" onPressOut={onPressOut}>
            <Image source={props.app.img} className="w-full h-full"/>
        </Button>
    )
}