export class FetcherWithCache
{
    constructor()
    {
        this.cache = {};
        this.TTL = 6 * 60 * 60 * 1000;
    }

    getCache(id, key)
    {
        const entry = this.cache[id]?.[key];

        if(entry?.data && (Date.now() - entry.lastFetch) < this.TTL)
            return entry.data;

        return null;
    }

    addToCache(id, key, data)
    {
        if(!this.cache[id])
            this.cache[id] = {};

        this.cache[id][key] = {
            data,
            lastFetch: Date.now()
        }

        console.log(`${id}${key !== "" ? '.' + key : ""}: data added to cache`);
    }

    async fetchWithCache(id, key, fetcher)
    {
        const cachedData = this.getCache(id, key);
        if(cachedData !== null)
        {
            console.log(`${id}${key !== "" ? '.' + key : ""}: cached data`);
            return cachedData; 
        }

        console.log(`${id}${key !== "" ? '.' + key : ""}: no cached data`);

        let data = await fetcher();
        this.addToCache(id, key, data);

        return data;
    }
}