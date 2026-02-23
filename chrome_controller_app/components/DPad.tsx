import { View } from "react-native"
import { TextButton } from "./ui/TextButton"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react-native"
import { Button } from "./ui/Button"
import { remoteConstantsDTO } from "@/dtos/remoteConstants"

type DPadProps = {
    commands: remoteConstantsDTO;
    ip: string;
}

export const DPad = (props: DPadProps) => {
    const buttonStyle = "w-[30%] h-20 flex justify-center items-center";

    const handleValidation = () => {
        fetch(`${props.ip}/extension/keypress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: props.commands.DPad.validate })
        });
    }

    const arrowsMapping: Record<string, React.ReactNode> = {
        [props.commands.DPad.up]: (<ChevronUp />),
        [props.commands.DPad.left]: (<ChevronLeft />),
        [props.commands.DPad.right]: (<ChevronRight />),
        [props.commands.DPad.down]: (<ChevronDown />)
    }

    const gap = 2;

    return (
        <View className={`flex justify-center items-center w-full gap-${gap}`}>
            <DPadArrow ip={props.ip} keySimulated={props.commands.DPad.up} className={buttonStyle} arrows={arrowsMapping}/>
            <View className={`flex flex-row gap-${gap}`}>
                <DPadArrow ip={props.ip} keySimulated={props.commands.DPad.left} className={buttonStyle} arrows={arrowsMapping} />
                <Button className={buttonStyle} onPressOut={handleValidation}/>
                <DPadArrow ip={props.ip} keySimulated={props.commands.DPad.right} className={buttonStyle} arrows={arrowsMapping} />
            </View>
            <DPadArrow ip={props.ip} keySimulated={props.commands.DPad.down} className={buttonStyle} arrows={arrowsMapping}/>
        </View>
    )
}

type DPadArrowProps = {
    keySimulated: string;
    className?: string;
    arrows: Record<string, React.ReactNode>;
    ip: string;
}

const DPadArrow = (props: DPadArrowProps) => {
    const handleClick = () => {
        fetch(`${props.ip}/extension/keypress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: props.keySimulated})
        });
    }

    return (
        <Button className={props.className} onPressOut={handleClick}>
            { props.arrows[props.keySimulated] }
        </Button>
    )
}