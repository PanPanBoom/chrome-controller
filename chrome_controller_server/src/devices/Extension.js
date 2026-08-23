import { Device } from "./Device.js";
import loudness from 'loudness';
import { io } from '../../server.js';
import { ApiManager } from "../APIs/ApiManager.js";

export class Extension extends Device
{
    constructor()
    {
        super("");
    }

    keyPress(key)
    {
        io.emit('command', { action: "HANDLE", key});
    }

    async castShow(platform, id, episodeInfo)
    {
        const link = await ApiManager.getShowLink(platform, id, episodeInfo);

        await this.openUrl(link);
    }

    openUrl(url)
    {
        io.emit('command', { action: 'OPEN_TAB', url });
    }

    sendInput(input)
    {
        io.emit('command', { action: 'INPUT', input });
    }

    submitInput(input)
    {
        io.emit('command', { action: 'SUBMIT', input });
    }

    async toggleMute()
    {
        const isMuted = await loudness.getMuted();

        console.log(isMuted ? "Demute" : "Mute");
        await loudness.setMuted(!isMuted);
    }

    async handleVolume(volumeValue)
    {
        const vol = await loudness.getVolume();
        await loudness.setVolume(vol + volumeValue);
    }
}