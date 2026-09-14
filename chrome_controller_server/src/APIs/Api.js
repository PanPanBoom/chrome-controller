import { getShowById } from "../db.js";

export class Api
{
    constructor()
    {
        this.cache = {};
        this.apiClient = null;
        this.TTL = 6 * 60 * 60 * 1000;
        this.filters = [];
        this.platform = "none";
    }

    getCache(identifier, filter)
    {
        const entry = this.cache[identifier]?.[filter];

        if(entry?.data && (Date.now() - entry.lastFetch) < this.TTL)
            return entry.data;

        return null;
    }

    addToCache(identifier, filter, data)
    {
        if(!this.cache[identifier])
            this.cache[identifier] = {};

        this.cache[identifier][filter] = {
            data,
            lastFetch: Date.now()
        }

        console.log(`${this.platform}.${identifier}${filter !== "" ? '.' + filter : ""}: data added to cache`);
    }

    async fetchWithCache(identifier, filter, fetcher)
    {
        const cachedData = this.getCache(identifier, filter);
        if(cachedData !== null)
        {
            console.log(`${this.platform}.${identifier}${filter !== "" ? '.' + filter : ""}: cached data`);
            return cachedData; 
        }

        console.log(`${this.platform}.${identifier}${filter !== "" ? '.' + filter : ""}: no cached data`);

        let data = await fetcher();
        this.addToCache(identifier, filter, data);

        return data;
    }

    formatForCarousel(id, title, img, overview, media_type)
    {
        const showFromDB = getShowById(id);

        return {
            id,
            title,
            img,
            overview,
            media_type,
            platform: this.platform,
            nextStartTime: showFromDB?.nextStartTime,
            currentEpisodeInfo: media_type === "tv" && {
                season: showFromDB?.currentSeason ?? 1,
                episode: showFromDB?.currentEpisode ?? 1
            },
            percentageWatched: showFromDB?.percentageWatched
        }
    }

    async getTopShows(filter)
    {
        return this.fetchWithCache("topShows", filter, () => this.sendTopShowsRequest(filter));
    }

    async sendTopShowsRequest(filter)
    {
        throw new Error("Must be implemented.");
    }

    async searchShowsByTitle(title, filter)
    {
        throw new Error("Must be implemented.");
    }

    async getLists(filter)
    {
        return this.fetchWithCache("lists", filter, () => this.sendListsRequest(filter));
    }

    async sendListsRequest(filter)
    {
        throw new Error("Must be implemented.");
    }

    async getShowByTitle(title)
    {
        throw new Error("Must be implemented.");
    }

    getShowLink(id)
    {
       throw new Error("Must be implemented.");
    }
}