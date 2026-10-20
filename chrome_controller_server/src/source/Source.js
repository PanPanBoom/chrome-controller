export class Source
{
    constructor(name, baseUrl, endWatchUrl)
    {
        this.baseUrl = baseUrl;
        this.watchUrl = baseUrl + endWatchUrl;
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36 OPR/137.0.0.0';
        this.name = name;
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