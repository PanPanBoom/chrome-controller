export class Source
{
    constructor(baseUrl, endWatchUrl)
    {
        this.baseUrl = baseUrl;
        this.watchUrl = baseUrl + endWatchUrl;
    }

    getShowUrl(id, episodeInfo = null)
    {
        throw new Error("Need to be implemented");
    }

    async getShowVideoInfo(id, episodeInfo = null)
    {
        throw new Error("Need to be implemented");
    }
}