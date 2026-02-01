import { View } from "react-native"
import { TextButton } from "./ui/TextButton"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react-native"
import { Button } from "./ui/Button"

export const DPad = () => {
    const buttonStyle = "w-[30%] h-20 flex justify-center items-center";

    const handleValidation = () => {
        fetch("http://192.168.1.46:3000/keypress", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: " "})
        });
    }

    return (
        <View className="flex justify-center items-center w-full mt-10">
            <DPadArrow keySimulated="ArrowUp" className={buttonStyle}/>
            <View className="flex flex-row my-2">
                <DPadArrow keySimulated="ArrowLeft" className={buttonStyle} />
                <Button className={`mx-2 ${buttonStyle}`} onPressOut={handleValidation}/>
                <DPadArrow keySimulated="ArrowRight" className={buttonStyle} />
            </View>
            <DPadArrow keySimulated="ArrowDown" className={buttonStyle}/>
        </View>
    )
}

const arrows: Record<string, React.ReactNode> = {
    "ArrowUp": (<ChevronUp />),
    "ArrowLeft": (<ChevronLeft />),
    "ArrowRight": (<ChevronRight />),
    "ArrowDown": (<ChevronDown />)
}

type DPadArrowProps = {
    keySimulated: string;
    className?: string;
}

const DPadArrow = (props: DPadArrowProps) => {
    const handleClick = () => {
        fetch("http://192.168.1.46:3000/keypress", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: props.keySimulated})
        });
    }

    return (
        <Button className={props.className} onPressOut={handleClick}>
            { arrows[props.keySimulated] }
        </Button>
    )
}