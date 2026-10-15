import { useCallback, useEffect, useRef, useState } from "react";
import { useTVEventHandler } from "react-native";

export function useAutoHide(delay = 5000, keepVisible = false)
{
    const [visible, setVisible] = useState(true);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clear = () => {
        if(timer.current)
            clearTimeout(timer.current);
    }

    const poke = useCallback(() => {
        setVisible(true);
        clear();
        if(!keepVisible)
            timer.current = setTimeout(() => setVisible(false), delay);
    }, [delay, keepVisible]);

    useEffect(() => {
        poke();
        return clear;
    }, [poke]);

    useTVEventHandler((evt) => {
        if(evt.eventKeyAction === 1)
            poke();
    });

    return { visible, poke };
}