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