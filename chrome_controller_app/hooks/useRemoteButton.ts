import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { sendKeyPress } from "@/server/socket";
import { useRef } from "react";

const LONG_PRESS_THRESHOLD = 500;

export function useRemoteButton(ip: string, button: number, directions: remoteConstantsDTO["directions"] | null)
{
    const timeoutRef = useRef<number | null>(null);
    const longPressTriggered = useRef(false);

    console.log(directions);

    const handlePressIn = () => {
        if(!directions)
            return;

        longPressTriggered.current = false;

        timeoutRef.current = setTimeout(() => {
            longPressTriggered.current = true;
            sendKeyPress(ip, button, directions.longPressStart);
            console.log("long press start");
        }, LONG_PRESS_THRESHOLD);
    };

    const handlePressOut = () => {
        if(!directions) return;

        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        sendKeyPress(ip, button, longPressTriggered.current ? directions.longPressEnd : directions.shortPress);
        console.log(longPressTriggered.current ? "long press end" : "short press");
    }

    return { onPressIn: handlePressIn, onPressOut: handlePressOut }
}