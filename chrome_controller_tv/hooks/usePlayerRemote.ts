import { useTVEventHandler } from "react-native";

export function usePlayerRemote({ onTogglePlay, onSeek }: {
    onTogglePlay: () => void;
    onSeek: (deltaSeconds: number) => void;
})
{
    useTVEventHandler((evt) => {
        console.log("TV Event:", evt);
        switch(evt.eventType)
        {
            case "playPause":
                onTogglePlay();
                break;
        }
    });
}