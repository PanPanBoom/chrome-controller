import { ApiManager } from "../APIs/ApiManager.js";

export class Device {
    constructor(ip) {
        this.ip = ip;
        this.isMuted = false;
    }

    keyPress(key)
    {
        throw new Error("Need to be implemented");
    }

    openUrl(url)
    {
        throw new Error("Need to be implemented");
    }

    async castShow(platform, id, episodeInfo = null)
    {
        console.log(`Getting link from ${platform} for ${id}`);

        const link = await ApiManager.getShowLink(platform, id, episodeInfo);

        console.log(`Opening ${link}`);

        await this.openUrl(link);
    }

    sendInput(input)
    {
        throw new Error("Need to be implemented");
    }

    submitInput(input)
    {
        throw new Error("Need to be implemented");
    }

    handleVolume(volumeValue)
    {
        throw new Error("Need to be implemented");
    }

    toggleMute()
    {
        this.isMuted = !this.isMuted;
    }
}