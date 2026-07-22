export class Device {
    constructor(ip) {
        this.ip = ip;
    }

    keyPress(key)
    {
        throw new Error("Need to be implemented");
    }

    openUrl(url)
    {
        throw new Error("Need to be implemented");
    }
}