
import { Device } from "./Device.js";
import loudness from 'loudness';
import { io } from '../io.js';
import { ApiManager } from "../APIs/ApiManager.js";
import { remoteConstants } from "../constants.js";
import { serverLog } from '../utils.js'

export class Extension extends Device
{
    constructor()
    {
        super("");
    }

    keyPress(key)
    {
        switch(key)
        {
            case remoteConstants.volume.up:
                this.handleVolume(5);
                break;
            case remoteConstants.volume.down:
                this.handleVolume(-5);
                break;
            case remoteConstants.volume.mute:
                this.toggleMute();
                break;

            default:
                io.emit('command', { action: "HANDLE", key});
                break;
        }
    }

    async castShow(platform, id, episodeInfo = null, source = null)
    {
        const link = await ApiManager.getShowLink(platform, id, episodeInfo, source);

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

        serverLog(isMuted ? "Demute" : "Mute");
        await loudness.setMuted(!isMuted);
        io.emit('muteChanged', { muted: !isMuted });
        
    }

    async handleVolume(volumeValue)
    {
        serverLog("volume");
        const vol = await loudness.getVolume();
        await loudness.setVolume(vol + volumeValue);
    }

    closeConnection()
    {
        
    }
}