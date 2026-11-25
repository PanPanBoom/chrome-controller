import { FetcherWithCache } from "../FetcherWithCache.js";

export class Resource extends FetcherWithCache
{
    constructor(api, mapper)
    {
        super();
        this.api = api;
        this.mapper = mapper;
    }

    getTopShows(filter)
    {
        return this.fetchWithCache("topShows", filter, () => this.sendTopShowsRequest(filter));
    }

    sendTopShowsRequest(filter)
    {
        return this.api.getTopShows(filter)
                .then(shows => shows.map(show => this.mapper.carousel(show)))
    }

    searchShowsByTitle(title, filter)
    {
        return this.api.searchShowsByTitle(title, filter)
            .then(shows => shows.map(show => this.mapper.carousel(show)))
    }

    getLists(filter)
    {
        return this.fetchWithCache("lists", filter, () => this.sendListsRequest(filter));
    }

    sendListsRequest(filter)
    {
        throw new Error("Must be implemented.");
    }

    getShowByTitle(title)
    {
        throw new Error("Must be implemented.");
    }

    getShowLink(id)
    {
       throw new Error("Must be implemented.");
    }
}