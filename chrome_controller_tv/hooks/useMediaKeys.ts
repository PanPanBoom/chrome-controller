import { useEffect, useRef } from "react";
import { DeviceEventEmitter } from "react-native";

type MediaKey = "rewind" | "forward";

type Handlers = {
    onPress?: (key: MediaKey) => void;
    onHoldStart?: (key: MediaKey) => void;
    onHold?: (key: MediaKey) => void;
    onHoldEnd?: (key: MediaKey) => void;
};

export function useMediaKeys(handlers: Handlers)
{
    const ref = useRef(handlers);
    ref.current = handlers;

    useEffect(() => {
        let held: MediaKey | null = null;

        const sub = DeviceEventEmitter.addListener('onMediaKey', ({ key, action, repeat}: {key: MediaKey; action: "down" | "up"; repeat: number}) => {
            if(action === "down" && repeat > 0)
            {
                if(held !== key)
                {
                    held = key;
                    ref.current.onHoldStart?.(key);
                }
                ref.current.onHold?.(key);
            }

            else if(action === "up")
            {
                if(held === key)
                    ref.current.onHoldEnd?.(key);
                else
                    ref.current.onPress?.(key);

                held = null;
            }
        });

        return () => {
            if(held)
                ref.current.onHoldEnd?.(held);

            sub.remove();
        };
    }, []);
}