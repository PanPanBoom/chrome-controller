import { getShowById } from "../db.js";
import { FetcherWithCache } from "../FetcherWithCache.js";
import { serverLog } from '../utils.js'

export class Api extends FetcherWithCache
{
    constructor()
    {
        super();
        this.apiClient = null;
        this.filters = [];
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
}