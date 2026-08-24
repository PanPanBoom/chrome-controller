export class Source
{
    constructor(baseUrl, endWatchUrl)
    {
        this.baseUrl = baseUrl;
        this.watchUrl = baseUrl + endWatchUrl;
    }

    async getShowUrl(id, episodeInfo = null)
    {
        console.log(`Getting ${id} ${id.includes("tv") ? `(Episode ${episodeInfo?.episode ?? 1} from season ${episodeInfo?.season ?? 1}) ` : ""}URL from ${this.baseUrl}...`);
    }

    async getShowVideoInfo(id, episodeInfo = null)
    {
        console.log(`Getting ${id} ${id.includes("tv") ? `(Episode ${episodeInfo?.episode ?? 1} from season ${episodeInfo?.season ?? 1}) ` : ""}source video from ${this.baseUrl}...`);
    }

    async checkShowAvailability(id, episodeInfo = null)
    {
        console.log(`Checking if ${id} ${id.includes("tv") ? `(Episode ${episodeInfo?.episode ?? 1} from season ${episodeInfo?.season ?? 1}) ` : ""}is available on ${this.baseUrl}...`);
    }
}