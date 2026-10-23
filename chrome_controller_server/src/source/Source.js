import { FetcherWithCache } from "../FetcherWithCache.js";

export class Source extends FetcherWithCache
{
    constructor(name, baseUrl, endWatchUrl)
    {
        super();
        this.baseUrl = baseUrl;
        this.watchUrl = baseUrl + endWatchUrl;
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36 OPR/137.0.0.0';
        this.name = name;
    }

    generateIdentifier(id, episodeInfo, language)
    {
        return `${id}${id.includes('tv') ? `.${episodeInfo?.season ?? 1}.${episodeInfo?.episode ?? 1}` : ''}${language ? `.${language}` : ''}`;
    }

    async getShowUrl(id, episodeInfo = null, language)
    {
        console.log(`Getting ${id} ${id.includes("tv") ? `(Episode ${episodeInfo?.episode ?? 1} from season ${episodeInfo?.season ?? 1}) ` : ""}URL from ${this.baseUrl}...`);
        return this.fetchWithCache(this.generateIdentifier(id, episodeInfo, language), 'url', () => this.fetchUrl(id, episodeInfo, language));
    }

    async fetchUrl(id, episodeInfo = null, language)
    {
        throw new Error("Must be implemented.");
    }

    async getShowVideoInfo(id, episodeInfo = null, language)
    {
        console.log(`Getting ${id} ${id.includes("tv") ? `(Episode ${episodeInfo?.episode ?? 1} from season ${episodeInfo?.season ?? 1}) ` : ""}source video from ${this.baseUrl}...`);
        return this.fetchWithCache(this.generateIdentifier(id, episodeInfo, language), 'videoInfo', () => this.fetchVideoInfo(id, episodeInfo, language));
    }

    async fetchVideoInfo(id, episodeInfo = null, language)
    {
        throw new Error("Must be implemented.");
    }

    async checkShowAvailability(id, episodeInfo = null, language)
    {
        console.log(`Checking if ${id} ${id.includes("tv") ? `(Episode ${episodeInfo?.episode ?? 1} from season ${episodeInfo?.season ?? 1}) ` : ""}is available on ${this.baseUrl}...`);
        return this.fetchWithCache(this.generateIdentifier(id, episodeInfo, language), 'availability', () => this.fetchAvailability(id, episodeInfo, language));
    }

    async fetchAvailability(id, episodeInfo = null, language)
    {
        throw new Error("Must be implemented.");
    }

    log(log)
    {
        const time = new Date();
        console.log(`[${time.getUTCHours()}:${time.getUTCMinutes()}:${time.getUTCSeconds()}:${time.getUTCMilliseconds()}] ${this.name}:`, log);
    }
}