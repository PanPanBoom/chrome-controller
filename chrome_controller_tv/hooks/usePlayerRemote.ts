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
            case "rewind":
                onSeek(-10);
                break;
            case "fastForward":
                onSeek(10);
                break;
        }
    });
}