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

    async getTopShows(filter)
    {
        return this.fetchWithCache("topShows", filter, () => this.sendTopShowsRequest(filter));
    }

    async sendTopShowsRequest(filter)
    {
        throw new Error("Must be implemented.");
    }
}